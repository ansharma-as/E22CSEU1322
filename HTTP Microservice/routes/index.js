const express = require('express');
const userRoutes = require('./user.routes');
const postRoutes = require('./post.routes');

const router = express.Router();

router.use('/users', userRoutes);
router.use('/posts', postRoutes);

router.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Not Found',
    error: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

module.exports = router;