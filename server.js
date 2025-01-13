const express = require('express');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const dataRoutes = require('./routes/dataRoutes'); // Existing route
const barChartRoutes = require('./routes/barChartRoutes'); // Bar Chart route
const scatterPlotRoutes = require('./routes/scatterPlotRoutes'); // Scatter Plot route
const pieChartRoutes = require('./routes/pieChartRoutes'); // Pie Chart route
const lineChartRoutes = require('./routes/lineChartRoutes'); // Line Chart route
const stackedBarChartRoutes = require('./routes/stackedBarChartRoutes'); // Stacked Bar Chart route

const app = express();
const PORT = 3001;

app.use(cors());
app.use(compression());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Use existing data routes
app.use(dataRoutes);

// Use graph-specific routes
app.use(barChartRoutes);
app.use(scatterPlotRoutes);
app.use(pieChartRoutes);
app.use(lineChartRoutes);
app.use(stackedBarChartRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});