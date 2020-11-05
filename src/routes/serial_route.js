const express = require('express');
const router = express.Router();
const controller = require('../controllers/serial_controller')
const auth = require('../../config/auth');

router.post('/bycnpj', auth.isValid, controller.list_by_cnpj);
router.post('/criar', auth.loggedIn, controller.create_edit);
router.post('/remover', auth.loggedIn, controller.delete);

module.exports = router;
