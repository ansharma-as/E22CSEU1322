
const authController = require('../controllers/auth.controller');
const cache = require('../utils/cache');

const ensureFreshData = async (req, res, next) => {
  try {
    await authController.ensureValidToken();
    
    if (Date.now() - cache.getLastUpdated() > cache.getTTL()) {
      const dataController = require('../controllers/data.controller');
      await dataController.refreshData();
    }
    
    next();
  } catch (error) {
    console.error('Middleware error:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  ensureFreshData
};