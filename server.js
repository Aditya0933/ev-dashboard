const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = 3001;

// Enable CORS
app.use(cors());

// Enable gzip compression for responses
app.use(compression());

// Rate Limiting: Limit each IP to 100 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Cache the data once it's read from the CSV file
let cachedData = null;

app.get('/data', (req, res) => {
  // If data is cached, return the cached data
  if (cachedData) {
    return res.json(cachedData);
  }

  const results = [];
  const page = parseInt(req.query.page) || 1; // Default to page 1 if no query parameter
  const limit = parseInt(req.query.limit) || 10; // Default to 10 results per page
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  // Handle invalid page and limit
  if (page < 1 || limit < 1) {
    return res.status(400).json({ error: 'Page and limit must be positive numbers' });
  }

  // Use the relative path to the CSV file
  fs.createReadStream('./data/Electric_Vehicle_Population_Data.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      // Cache the data after it's read
      cachedData = results;

      // Handle case when startIndex exceeds results length (invalid page)
      if (startIndex >= results.length) {
        return res.status(400).json({ error: 'Page number exceeds available data' });
      }

      // Paginate the data
      const paginatedResults = results.slice(startIndex, endIndex);

      // Send the paginated results and total pages back as JSON
      res.json({
        data: paginatedResults,
        totalPages: Math.ceil(results.length / limit),
      });
    })
    .on('error', (err) => {
      console.error('Error reading CSV file:', err);
      res.status(500).send('Error reading CSV file.');
    });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});