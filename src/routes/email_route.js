const express = require('express');
const router = express.Router();
const controller = require('../controllers/email_controller')
const auth = require('../../config/auth');

router.get('/enviar_email', auth.loggedIn, controller.enviar);

module.exports = router;