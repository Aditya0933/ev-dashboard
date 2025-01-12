const express = require('express');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const dataRoutes = require('./routes/dataRoutes');
const filterRoutes = require('./routes/filterRoutes');

const app = express();
const PORT = 3001;

// Enable CORS
app.use(cors());

// Enable gzip compression for responses
app.use(compression());

// Rate Limiting: Limit each IP to 100 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Use the routes
app.use(dataRoutes);
app.use(filterRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});