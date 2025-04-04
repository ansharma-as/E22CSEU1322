const express = require('express');
const config = require('./config');
const corsMiddleware = require('./middleware/cors.middleware');
const routes = require('./routes');
const dataController = require('./controllers/data.controller');

const app = express();

app.use(corsMiddleware);
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Social Media Analytics API is running'
  });
});

app.use(routes);

async function startServer() {
  try {
    
    app.listen(config.server.port, () => {
      console.log(`Server running on port ${config.server.port}`);
      console.log(`API available at http://localhost:${config.server.port}`);
      console.log(`Environment: ${config.server.nodeEnv}`);
      console.log('Social Media Analytics Service is ready');
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Promise Rejection:', reason);
  process.exit(1);
});

startServer();