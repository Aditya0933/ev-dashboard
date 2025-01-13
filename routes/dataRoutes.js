const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Enable CORS and compression
router.use(cors());
router.use(compression());

// Rate Limiting: Limit each IP to 100 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
router.use(limiter);

// Handle the paginated data request
router.get('/data', (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1 if no query parameter
  const limit = parseInt(req.query.limit) || 10; // Default to 10 results per page
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  // Handle invalid page and limit
  if (page < 1 || limit < 1) {
    return res.status(400).json({ error: 'Page and limit must be positive numbers' });
  }

  const results = [];
  let currentIndex = 0;

  // Read the CSV file and handle paginated results
  fs.createReadStream('./data/Electric_Vehicle_Population_Data.csv')
    .pipe(csv())
    .on('data', (data) => {
      if (currentIndex >= startIndex && currentIndex < endIndex) {
        results.push(data); // Only push data for the current page
      }
      currentIndex++;
    })
    .on('end', () => {
      const totalRecords = currentIndex; // The total number of records in the CSV file
      const totalPages = Math.ceil(totalRecords / limit); // Calculate total pages

      // Handle case when startIndex exceeds results length (invalid page)
      if (startIndex >= totalRecords) {
        return res.status(400).json({ error: 'Page number exceeds available data' });
      }

      // If no records are found, send a 404 response
      if (results.length === 0) {
        return res.status(404).json({ error: 'No data available for the requested page' });
      }

      // Send the paginated results and total pages back as JSON
      res.json({
        data: results,
        totalPages: totalPages,
      });
    })
    .on('error', (err) => {
      console.error('Error reading CSV file:', err);
      res.status(500).send('Error reading CSV file.');
    });
});

module.exports = router;