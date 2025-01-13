const express = require('express');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

// Import routes
const dataRoutes = require('./routes/dataRoutes'); // Data route
const barChartRoutes = require('./routes/barChartRoutes'); // Bar Chart route
const scatterPlotRoutes = require('./routes/scatterPlotRoutes'); // Scatter Plot route
const pieChartRoutes = require('./routes/pieChartRoutes'); // Pie Chart route
const lineChartRoutes = require('./routes/lineChartRoutes'); // Line Chart route
const stackedBarChartRoutes = require('./routes/stackedBarChartRoutes'); // Stacked Bar Chart route

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(compression());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
});
app.use(limiter);

// Routes
app.use('/data', dataRoutes); // Apply data route
app.use('/bar-chart', barChartRoutes); // Bar Chart route
app.use('/scatter-plot', scatterPlotRoutes); // Scatter Plot route
app.use('/pie-chart', pieChartRoutes); // Pie Chart route
app.use('/line-chart', lineChartRoutes); // Line Chart route
app.use('/stacked-bar-chart', stackedBarChartRoutes); // Stacked Bar Chart route

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});