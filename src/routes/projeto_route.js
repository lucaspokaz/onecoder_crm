const express = require('express');
const router = express.Router();
const controller = require('../controllers/projeto_controller')
const auth = require('../../config/auth');

router.get('/', auth.loggedIn, controller.listar);

router.get('/criar', auth.loggedIn, controller.carregar);
router.get('/editar/(:id)', auth.loggedIn, controller.carregar);

router.post('/criar', auth.loggedIn, controller.criar);
router.post('/editar/(:id)', auth.loggedIn, controller.editar);

module.exports = router;