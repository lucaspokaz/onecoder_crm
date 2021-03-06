const express = require('express');
const router = express.Router();
const controller = require('../controllers/contrato_controller')
const auth = require('../../config/auth');

router.get('/', auth.loggedIn, controller.list);
router.get('/consulta', auth.loggedIn, controller.list_consulta);

router.get('/criar', auth.loggedIn, controller.load);
router.get('/editar/(:id)', auth.loggedIn, controller.load);
router.post('/criar', auth.loggedIn, controller.create);
router.post('/editar/(:id)', auth.loggedIn, controller.edit);
router.post('/remover', auth.loggedIn, controller.delete);
router.post('/renovar', auth.loggedIn, controller.renew);

module.exports = router;