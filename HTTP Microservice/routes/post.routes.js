const express = require('express');
const postController = require('../controllers/post.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', authMiddleware.ensureFreshData, postController.getPosts);

module.exports = router;