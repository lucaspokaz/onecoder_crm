const express = require('express');
const router = express.Router();
const controller = require('../controllers/update_controller');

router.get('/elysius', controller.get_versions);

module.exports = router;