const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');

const router = express.Router(); // Initialize the router

// Route for Scatter Plot data with year query
router.get('/scatter-plot', (req, res) => {
  const year = req.query.year || '2024'; // Default to 2024 if no year is provided
  const results = [];

  fs.createReadStream('./data/Electric_Vehicle_Population_Data.csv')
    .pipe(csv())
    .on('data', (data) => {
      const modelYear = data['Model Year'] ? data['Model Year'].trim() : '';
      const make = data['Make'] ? data['Make'].trim() : '';
      const vehicleType = data['Electric Vehicle Type'] ? data['Electric Vehicle Type'].trim() : '';

      // Only push data for the selected year
      if (modelYear === year && make && vehicleType) {
        results.push({
          modelYear,
          make,
          vehicleType,
        });
      }
    })
    .on('end', () => {
      if (results.length === 0) {
        return res.status(404).send(`No data found for the year ${year}.`);
      }
      res.json(results); // Return all results as JSON
    })
    .on('error', (err) => {
      console.error('Error reading CSV file:', err);
      res.status(500).send('Error reading CSV file.');
    });
});

module.exports = router;