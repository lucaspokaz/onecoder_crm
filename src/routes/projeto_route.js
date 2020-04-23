const express = require('express');
const router = express.Router();
const controller = require('../controllers/projeto_controller')
const auth = require('../../config/auth');

router.get('/', auth.loggedIn, controller.list);

router.get('/criar', auth.loggedIn, controller.load);
router.get('/editar/(:id)', auth.loggedIn, controller.load);
router.post('/criar', auth.loggedIn, controller.create);
router.post('/editar/(:id)', auth.loggedIn, controller.edit);

module.exports = router;