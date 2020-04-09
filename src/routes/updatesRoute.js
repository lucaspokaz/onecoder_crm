const express = require('express');
const router = express.Router();
const controller = require('../controllers/updatesController');

router.get('/elysius', controller.get_versions);

module.exports = router;