const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');

const router = express.Router(); // Initialize the router

// Route to get data for the stacked bar chart, with optional year query
router.get('/stacked-bar-chart', (req, res) => {
  const year = req.query.year || '2024'; // Default to 2024 if no year is provided
  const results = {};

  // Read and parse the CSV file
  fs.createReadStream('./data/Electric_Vehicle_Population_Data.csv')
    .pipe(csv())
    .on('data', (data) => {
      const modelYear = data['Model Year'] ? data['Model Year'].toString().trim() : '';
      const vehicleType = data['Electric Vehicle Type'] ? data['Electric Vehicle Type'].trim() : '';

      // Filter data by the specified year
      if (modelYear === year && vehicleType) {
        // Aggregate the data by model year and vehicle type
        if (!results[modelYear]) {
          results[modelYear] = {};
        }
        if (!results[modelYear][vehicleType]) {
          results[modelYear][vehicleType] = 0;
        }
        results[modelYear][vehicleType]++;
      }
    })
    .on('end', () => {
      // Return the results or a 404 if no data found for the specified year
      if (Object.keys(results).length === 0) {
        return res.status(404).send(`No data found for the year ${year} in the stacked bar chart.`);
      }
      res.json(results); // Return the aggregated data as JSON
    })
    .on('error', (err) => {
      console.error('Error reading CSV file:', err);
      res.status(500).send('Error reading CSV file.');
    });
});

module.exports = router; // Export the router