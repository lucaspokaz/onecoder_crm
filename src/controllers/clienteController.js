const
    clientesService = require('../services/clientesService'),
    tarefasService = require('../services/tarefasService'),
    contratosService = require('../services/contratosService');

exports.listar = async (req, res, next) => {

    let results = await clientesService.get_clientes_responsaveis(req.session.codigo_usuario);
    let dados = JSON.parse(results);

    res.render('clientes/index', {
        session: req.session,
        menu: 'lista_cliente',
        data: dados,
        moment: require('moment'),
        formatter: require('../utils/formatter')
    });
};

exports.carregar = async (req, res, next) => {

    if ((req.params.id) && (req.params.id > 0)) {

        let cliente = await clientesService.get_cliente_by_id(req.params.id);
        let dados_cliente = JSON.parse(cliente);

        let geral = await tarefasService.get_tarefas_visao_geral_por_cliente(req.params.id);
        let dados_geral = JSON.parse(geral);

        let contratos = await contratosService.get_contratos_visao_geral_por_cliente(req.params.id);
        let dados_geral_contratos = JSON.parse(contratos);

        res.render('clientes/editar', {
            session: req.session,
            menu: 'lista_cliente',
            data: dados_cliente[0],
            data_geral: dados_geral[0],
            data_contratos: dados_geral_contratos[0],
            moment: require('moment'),
            formatter: require('../utils/formatter')
        })

    } else {

        res.render('clientes/criar', {
            session: req.session,
            menu: 'cria_cliente',
            data: [],
            moment: require('moment'),
            formatter: require('../utils/formatter')
        })

    }
};

exports.criar = async (req, res, next) => {

    let inserted = await clientesService.insert(req, res);

    if (inserted.status == 200) {

        req.flash('success', `Salvo com sucesso.`);
        res.redirect('/clientes/editar/' + inserted.insertedId);

    } else {

        req.flash('error', inserted.statusMessage);
        res.locals.message = req.flash();

        res.render('tarefas/criar', {
            session: req.session,
            menu: 'cria_cliente',
            data: req.body,
            moment: require('moment'),
            formatter: require('../utils/formatter')
        })
    }
};

exports.editar = async (req, res, next) => {

    let edited = await clientesService.edit(req, res);

    if (edited.status == 200) {

        req.flash('success', `Salvo com sucesso.`);
        res.redirect('/clientes/editar/' + req.params.id);

    } else {

        req.flash('success', `Erro ao salvar.`);

        res.render('clientes/editar/' + req.params.id, {
            session: req.session,
            menu: 'lista_cliente',
            data: req.body,
            moment: require('moment'),
            formatter: require('../utils/formatter')
        })
    }
};