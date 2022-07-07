const express = require('express');
const router = express.Router();
const indexController = require('../controller/index_controller');

router.get('/whiteboard/:room',indexController.joinWhiteboard);

module.exports = router;