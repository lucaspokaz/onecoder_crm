const
    contratosService = require('../services/contrato_service'),
    clienteService = require('../services/cliente_service'),
    projetosService = require('../services/projeto_service');

let
    dados_projeto,
    dados_cliente;

exports.listar = async (req, res, next) => {

    let results = await contratosService.get_contratos();
    let dados = JSON.parse(results);

    res.render('contratos/index', {
        session: req.session,
        menu: 'lista_contrato',
        data: dados,
        moment: require('moment'),
        formatter: require('../utils/formatter')
    });
};

exports.carregar = async (req, res, next) => {

    let projetos = await projetosService.get_all();
    dados_projeto = JSON.parse(projetos);

    let clientes = await clienteService.get_clientes_responsaveis(req.session.codigo_usuario);
    dados_cliente = JSON.parse(clientes);

    if ((req.params.id) && (req.params.id > 0)) {

        let contratos = await contratosService.get_contrato_by_id(req.params.id);
        dados_contrato = JSON.parse(contratos);

        res.render('contratos/editar', {
            session: req.session,
            menu: 'lista_contrato',
            data: dados_contrato[0],
            data_projetos: dados_projeto,
            data_clientes: dados_cliente,
            moment: require('moment'),
            formatter: require('../utils/formatter')
        })

    } else {

        res.render('contratos/criar', {
            session: req.session,
            menu: 'cria_contrato',
            data: [],
            data_projetos: dados_projeto,
            data_clientes: dados_cliente,
            moment: require('moment'),
            formatter: require('../utils/formatter')
        })

    }
};

exports.criar = async (req, res, next) => {

    let inserted = await contratosService.insert(req, res);

    if (inserted.status == 200) {

        req.flash('success', `Salvo com sucesso.`);
        res.redirect('/contratos/editar/' + inserted.insertedId);

    } else {

        let projetos = await projetosService.get_all();
        dados_projeto = JSON.parse(projetos);

        let clientes = await clienteService.get_clientes_responsaveis(req.session.codigo_usuario);
        dados_cliente = JSON.parse(clientes);

        req.flash('error', inserted.statusMessage);
        res.locals.message = req.flash();

        res.render('contratos/criar', {
            session: req.session,
            menu: 'cria_contrato',
            data: req.body,
            data_projetos: dados_projeto,
            data_clientes: dados_cliente,
            moment: require('moment'),
            formatter: require('../utils/formatter')
        })
    }
};

exports.editar = async (req, res, next) => {

    let edited = await contratosService.edit(req, res);

    if (edited.status == 200) {

        req.flash('success', `Salvo com sucesso.`);
        res.redirect('/contratos/editar/' + req.params.id);

    } else {

        let projetos = await projetosService.get_all();
        dados_projeto = JSON.parse(projetos);

        let clientes = await clienteService.get_clientes_responsaveis(req.session.codigo_usuario);
        dados_cliente = JSON.parse(clientes);

        req.flash('success', `Erro ao salvar.`);

        res.render('contratos/editar/' + req.params.id, {
            session: req.session,
            menu: 'lista_contrato',
            data: req.body,
            moment: require('moment'),
            formatter: require('../utils/formatter')
        })
    }
};

exports.remover = async (req, res, next) => {

    let idContrato = req.body.id;
    let deleted = await contratosService.delete(idContrato);

    if (deleted.status == 200) {
        return res.status(200).send(deleted);
    } else {
        return res.status(400).send(deleted);
    }
};