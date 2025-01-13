const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');

const router = express.Router();

router.get('/pie-chart', (req, res) => {
  const results = {};

  fs.createReadStream('./data/Electric_Vehicle_Population_Data.csv')
    .pipe(csv())
    .on('data', (data) => {
      const vehicleType = data['Electric Vehicle Type'] ? data['Electric Vehicle Type'].trim() : '';
      
      if (vehicleType) {
        if (!results[vehicleType]) {
          results[vehicleType] = 0;
        }
        results[vehicleType]++;
      }
    })
    .on('end', () => {
      if (Object.keys(results).length === 0) {
        return res.status(404).send('No data found for pie chart.');
      }
      res.json(results);
    })
    .on('error', (err) => {
      console.error('Error reading CSV file:', err);
      res.status(500).send('Error reading CSV file.');
    });
});

module.exports = router;
