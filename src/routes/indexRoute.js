const express = require('express');
const router = express.Router();
const auth = require('../../config/auth');
const tarefasService = require('../services/tarefasService')

router.get('/', auth.loggedIn, async function (req, res, next) {

    let results = await tarefasService.get_tarefas_abertas_por_mim(req.session.codigo_usuario);
    let geral = await tarefasService.get_tarefas_visao_geral();

    dados = JSON.parse(results);
    dados_geral = JSON.parse(geral);

    res.render('index', {
        menu: '',
        session: req.session,
        data: dados,
        data_geral: dados_geral,
        moment: require('moment'),
        formatter: require('../utils/formatter')
    });
});

module.exports = router;