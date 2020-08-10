const express = require('express');
const router = express.Router();
const controller = require('../controllers/serial_controller')
const auth = require('../../config/auth');

router.post('/bycnpj', auth.isValid, controller.list_by_cnpj);

module.exports = router;