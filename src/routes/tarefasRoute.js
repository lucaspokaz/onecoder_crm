const express = require('express');
const router = express.Router();
const controller = require('../controllers/tarefaController')
const auth = require('../../config/auth');

router.get('/', auth.loggedIn, controller.acompanhamento_minhas);

router.get('/acompanhamento', auth.loggedIn, controller.acompanhamento_todas);
router.get('/acompanhamento/todas', auth.loggedIn, controller.acompanhamento_todas);
router.get('/acompanhamento/pendentes', auth.loggedIn, controller.acompanhamento_pendentes);
router.get('/acompanhamento/minhas', auth.loggedIn, controller.acompanhamento_minhas);
router.get('/criar', auth.loggedIn, controller.carregar);
router.get('/editar/(:id)', auth.loggedIn, controller.carregar);
router.get('/historico/(:id)', auth.loggedIn, controller.get_historico);
router.get('/quadro', auth.loggedIn, controller.get_quadro_tarefas);

router.post('/criar', auth.loggedIn, controller.criar);
router.post('/editar/(:id)', auth.loggedIn, controller.editar);
router.post('/atender', auth.loggedIn, controller.atender_tarefa);
router.post('/retornar-para-fila', auth.loggedIn, controller.retornar_para_fila);
router.post('/enviar-tarefa', auth.loggedIn, controller.enviar_tarefa);

module.exports = router;