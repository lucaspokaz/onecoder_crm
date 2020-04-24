const express = require('express');
const router = express.Router();
const auth = require('../../config/auth');
const tarefasService = require('../services/tarefa_service');
const andamentosService = require('../services/andamento_service')
const moment = require('moment');

moment.locale('pt-br');

router.get('/', auth.loggedIn, async function (req, res, next) {

    let results = await tarefasService.get_mytasks_created(req.session.codigo_usuario);
    let geral = await tarefasService.get_tasks_overview();
    let ultimos = await andamentosService.get_progress_last15(req.session.codigo_usuario);

    dados = JSON.parse(results);
    dados_geral = JSON.parse(geral);
    dados_ultimos_andamentos = JSON.parse(ultimos);

    res.render('index', {
        menu: '',
        session: req.session,
        data: dados,
        data_geral: dados_geral,
        data_ultimos_andamentos: dados_ultimos_andamentos,
        moment: moment,
        formatter: require('../utils/formatter')
    });
});

module.exports = router;