const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');

const router = express.Router();

router.get('/data', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  if (page < 1 || limit < 1) {
    return res.status(400).json({ error: 'Page and limit must be positive numbers' });
  }

  const results = [];
  let currentIndex = 0;

  fs.createReadStream('./data/Electric_Vehicle_Population_Data.csv')
    .pipe(csv())
    .on('data', (data) => {
      if (currentIndex >= startIndex && currentIndex < endIndex) {
        results.push(data);
      }
      currentIndex++;
    })
    .on('end', () => {
      const totalRecords = currentIndex;
      const totalPages = Math.ceil(totalRecords / limit);

      if (startIndex >= totalRecords) {
        return res.status(400).json({ error: 'Page number exceeds available data' });
      }

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
