const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');

const router = express.Router();

router.get('/data/by-year', (req, res) => {
  const year = req.query.year;

  if (!year) {
    return res.status(400).json({ error: 'Year query parameter is required' });
  }

  const results = { BEV: 0, PHEV: 0 };

  fs.createReadStream('./data/Electric_Vehicle_Population_Data.csv')
    .pipe(csv())
    .on('data', (data) => {
      if (data['Model Year'] === year) {
        if (data['Electric Vehicle Type'] === 'Battery Electric Vehicle (BEV)') {
          results.BEV++;
        } else if (data['Electric Vehicle Type'] === 'Plug-in Hybrid Electric Vehicle (PHEV)') {
          results.PHEV++;
        }
      }
    })
    .on('end', () => {
      res.json(results);
    })
    .on('error', (err) => {
      console.error('Error reading CSV file:', err);
      res.status(500).send('Error reading CSV file.');
    });
});

module.exports = router;