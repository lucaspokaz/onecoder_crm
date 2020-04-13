const express = require('express');
const router = express.Router();
const controller = require('../controllers/login_controller')

router.get('/', controller.get);
router.get('/logout', controller.logout);
router.post('/', controller.post);

module.exports = router;