const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');

const router = express.Router();

router.get('/bar-chart/:year', (req, res) => {
  const year = req.params.year.trim();
  const results = {};

  if (!year || isNaN(year)) {
    return res.status(400).send('Invalid year parameter.');
  }

  fs.createReadStream('./data/Electric_Vehicle_Population_Data.csv')
    .pipe(csv())
    .on('data', (data) => {
      const modelYear = data['Model Year'] ? data['Model Year'].toString().trim() : '';
      const make = data['Make'] ? data['Make'].trim() : '';

      if (modelYear === year) {
        if (!results[make]) {
          results[make] = 0;
        }
        results[make]++;
      }
    })
    .on('end', () => {
      if (Object.keys(results).length === 0) {
        return res.status(404).send(`No data found for the selected year ${year}.`);
      }
      res.json(results);
    })
    .on('error', (err) => {
      console.error('Error reading CSV file:', err);
      res.status(500).send('Error reading CSV file.');
    });
});

module.exports = router;