const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');

const router = express.Router();

router.get('/', (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default to 10 results per page
  const startIndex = (page - 1) * limit;
  const results = [];
  let currentIndex = 0;

  // Read CSV file
  fs.createReadStream('./data/Electric_Vehicle_Population_Data.csv')
    .pipe(csv())
    .on('data', (data) => {
      if (currentIndex >= startIndex && currentIndex < startIndex + limit) {
        results.push(data); // Add data within range
      }
      currentIndex++;
    })
    .on('end', () => {
      const totalPages = Math.ceil(currentIndex / limit); // Total pages
      res.json({ data: results, totalPages });
    })
    .on('error', (err) => {
      console.error('Error reading CSV file:', err);
      res.status(500).send('Error reading CSV file.');
    });
});

module.exports = router;