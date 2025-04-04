
const cors = require('cors');
const config = require('../config');

const corsOptions = {
  origin: config.isProduction() 
    ? 'http://localhost:3000'
    : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 
};

module.exports = cors(corsOptions);