const express = require('express');
const router = express.Router();
const controller = require('../controllers/login_controller')

router.get('/', controller.load);
router.get('/logout', controller.logout);
router.post('/', controller.login);

module.exports = router;