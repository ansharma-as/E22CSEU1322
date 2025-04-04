const express = require('express');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();


router.get('/', authMiddleware.ensureFreshData, userController.getTopUsers);

module.exports = router;