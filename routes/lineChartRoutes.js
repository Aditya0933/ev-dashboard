const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');

const router = express.Router();

router.get('/line-chart', (req, res) => {
  const results = {};

  fs.createReadStream('./data/Electric_Vehicle_Population_Data.csv')
    .pipe(csv())
    .on('data', (data) => {
      const modelYear = data['Model Year'] ? data['Model Year'].toString().trim() : '';
      const electricRange = data['Electric Range'] ? parseFloat(data['Electric Range']) : 0;

      if (modelYear && electricRange) {
        if (!results[modelYear]) {
          results[modelYear] = [];
        }
        results[modelYear].push(electricRange);
      }
    })
    .on('end', () => {
      if (Object.keys(results).length === 0) {
        return res.status(404).send('No data found for line chart.');
      }
      res.json(results);
    })
    .on('error', (err) => {
      console.error('Error reading CSV file:', err);
      res.status(500).send('Error reading CSV file.');
    });
});

module.exports = router;
