const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');

const router = express.Router();

router.get('/model-year-make/:year', (req, res) => {
  const year = req.params.year.trim();  // Trim any leading/trailing spaces from the year parameter
  const results = {};

  // Check if year is a valid number or string
  if (!year || isNaN(year)) {
    return res.status(400).send('Invalid year parameter. Please provide a valid year.');
  }

  // Read the CSV file and process the data
  fs.createReadStream('./data/Electric_Vehicle_Population_Data.csv')
    .pipe(csv())
    .on('data', (data) => {
      // Ensure the required columns exist
      const modelYear = data['Model Year'] ? data['Model Year'].toString().trim() : '';
      const make = data['Make'] ? data['Make'].trim() : '';

      // Log if columns are missing
      if (!modelYear || !make) {
        console.warn('Missing data:', data);  // Log missing columns
        return;  // Skip this row if any critical data is missing
      }

      // Filter by the requested year
      if (modelYear === year) {
        if (!results[make]) {
          results[make] = 0;
        }

        results[make]++;
      }
    })
    .on('end', () => {
      // If no data found for the year, send 404
      if (Object.keys(results).length === 0) {
        return res.status(404).send(`No data found for the selected year ${year}.`);
      }
      res.json(results);  // Return the results for the selected year
    })
    .on('error', (err) => {
      // Log the error and send a 500 status code
      console.error('Error reading CSV file:', err);
      res.status(500).send('Error reading CSV file. Please try again later.');
    });
});

module.exports = router;