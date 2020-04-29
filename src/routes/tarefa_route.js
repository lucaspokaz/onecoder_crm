const express = require('express');
const router = express.Router();
const controller = require('../controllers/tarefa_controller')
const auth = require('../../config/auth');

var wordsFileContentLength = 938848;

router.get('/', auth.loggedIn, controller.list_my_list);

router.get('/criar', auth.loggedIn, controller.load);
router.get('/editar/(:id)', auth.loggedIn, controller.load);
router.post('/criar', auth.loggedIn, controller.create);
router.post('/editar/(:id)', auth.loggedIn, controller.edit);

router.get('/historico/(:id)', auth.loggedIn, controller.list_task_history);
router.get('/acompanhamento', auth.loggedIn, controller.list_all);

router.get('/acompanhamento/todas', auth.loggedIn, controller.list_all);


router.get('/acompanhamento/pendentes', auth.loggedIn, controller.list_pending);
router.get('/acompanhamento/minhas', auth.loggedIn, controller.list_my_list);
router.get('/quadro', auth.loggedIn, controller.list_task_board);

router.post('/atender', auth.loggedIn, controller.take_task);
router.post('/retornar-para-fila', auth.loggedIn, controller.return_task);
router.post('/enviar-tarefa', auth.loggedIn, controller.send_task);
router.post('/concluir-tarefa', auth.loggedIn, controller.finish_task);

module.exports = router;