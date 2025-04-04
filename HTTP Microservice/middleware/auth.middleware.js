const authController = require('../controllers/auth.controller');
const cache = require('../utils/cache');

let dataController = null;


const ensureFreshData = async (req, res, next) => {
  try {
    if (!dataController) {
      dataController = require('../controllers/data.controller');
    }
    
    try {
      await authController.ensureValidToken();
    } catch (tokenError) {
      console.error('Token validation error in middleware:', tokenError.message);
    }
    
    try {
      if (Date.now() - cache.getLastUpdated() > cache.getTTL()) {
        await dataController.refreshData();
      }
    } catch (refreshError) {
      console.error('Data refresh error in middleware:', refreshError.message);
    }
    
    next();
  } catch (error) {
    console.error('Critical middleware error:', error.message);
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