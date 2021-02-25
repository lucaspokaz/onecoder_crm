const projetosService = require('../services/projeto_service');
const clientesService = require('../services/cliente_service');

exports.list = async (req, res, next) => {

    let results = await projetosService.get_all();
    let dados = JSON.parse(results);

    res.render('projetos/index', {
        session: req.session,
        menu: 'lista_projeto',
        data: dados,
        moment: require('moment'),
        formatter: require('../utils/formatter')
    });
};

exports.load = async (req, res, next) => {

    

    let clientes = await clientesService.get_clients_responsibles(req.session.codigo_usuario);
    dados_cliente = JSON.parse(clientes);

    if ((req.params.id) && (req.params.id > 0)) {

        let projeto = await projetosService.get_by_id(req.params.id);
        let dados_projeto = JSON.parse(projeto);

        res.render('projetos/editar', {
            session: req.session,
            menu: 'edita_projeto',
            data: dados_projeto[0],
            data_clientes: dados_cliente,
            moment: require('moment'),
            formatter: require('../utils/formatter')
        })

    } else {

        res.render('projetos/criar', {
            session: req.session,
            menu: 'cria_projeto',
            data: [],
            data_clientes: dados_cliente,
            moment: require('moment'),
            formatter: require('../utils/formatter')
        })

    }
};

exports.create = async (req, res, next) => {

    let inserted = await projetosService.insert(req, res);

    if (inserted.status == 200) {

        req.flash('success', `Salvo com sucesso.`);
        res.redirect('/projetos/editar/' + inserted.insertedId);

    } else {

        req.flash('error', inserted.statusMessage);
        res.locals.message = req.flash();

        res.render('projetos/criar', {
            session: req.session,
            menu: 'cria_projeto',
            data: req.body,
            moment: require('moment'),
            formatter: require('../utils/formatter')
        })
    }
};

exports.edit = async (req, res, next) => {

    let edited = await projetosService.edit(req, res);

    if (edited.status == 200) {

        req.flash('success', `Salvo com sucesso.`);
        res.redirect('/projetos/editar/' + req.params.id);

    } else {

        req.flash('success', `Erro ao salvar.`);

        res.render('projetos/editar/' + req.params.id, {
            session: req.session,
            menu: 'lista_projeto',
            data: req.body,
            moment: require('moment'),
            formatter: require('../utils/formatter')
        })
    }
};