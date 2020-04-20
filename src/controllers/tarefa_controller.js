const
    clienteService = require('../services/cliente_service'),
    projetosService = require('../services/projeto_service'),
    tiposAtendimentoService = require('../services/tipoatendimento_service'),
    tarefasService = require('../services/tarefa_service'),
    andamentosService = require('../services/andamento_service'),
    departamentosService = require('../services/departamento_service');

let
    dados_cliente,
    dados_projeto,
    dados_tipo;

var
    moment = require('moment');
    moment.locale('pt-br');

exports.acompanhamento_pendentes = async (req, res, next) => {

    let results = await tarefasService.get_tarefas_acompanhamento(req.session.codigo_usuario, true);
    let geral = await tarefasService.get_tarefas_visao_geral();

    dados = JSON.parse(results);
    dados_geral = JSON.parse(geral);

    res.render('tarefas/acompanhamento', {
        session: req.session,
        menu: 'tarefas_pendentes',
        data: dados,
        data_geral: dados_geral,
        info: {
            titulo: 'Acompanhamento de Tarefas Pendentes'
        },
        moment: moment,
        formatter: require('../utils/formatter')
    });

    info_adicional = [];
};

exports.acompanhamento_minhas = async (req, res, next) => {

    let results = await tarefasService.get_minhas_tarefas_acompanhamento(req.session.codigo_usuario);
    let geral = await tarefasService.get_tarefas_visao_geral();

    dados = JSON.parse(results);
    dados_geral = JSON.parse(geral);

    res.render('tarefas/acompanhamento', {
        session: req.session,
        menu: 'tarefas_minhas',
        data: dados,
        data_geral: dados_geral,
        info: {
            titulo: 'Acompanhamento das Minhas Tarefas'
        },
        moment: moment,
        formatter: require('../utils/formatter')
    });
};

exports.acompanhamento_todas = async (req, res, next) => {

    let results = await tarefasService.get_tarefas_acompanhamento(req.session.codigo_usuario, false);
    let geral = await tarefasService.get_tarefas_visao_geral();

    let dados = JSON.parse(results);
    let dados_geral = JSON.parse(geral);

    res.render('tarefas/acompanhamento', {
        session: req.session,
        menu: 'tarefas_todas',
        data: dados,
        data_geral: dados_geral,
        info: {
            titulo: 'Acompanhamento de Todas as Tarefas',
        },
        moment: moment,
        formatter: require('../utils/formatter')
    });
};

exports.carregar = async (req, res, next) => {

    let clientes = await clienteService.get_clientes_responsaveis(req.session.codigo_usuario);
    dados_cliente = JSON.parse(clientes);

    let projetos = await projetosService.get_all();
    dados_projeto = JSON.parse(projetos);

    let tipos = await tiposAtendimentoService.get_all();
    dados_tipo = JSON.parse(tipos);

    if ((req.params.id) && (req.params.id > 0)) {

        let tarefa = await tarefasService.get_tarefa_by_id(req.params.id);
        let dados_tarefa = JSON.parse(tarefa);
        let historico = await tarefasService.get_historico_tarefa(req.params.id);
        let dados_historico = JSON.parse(historico);

        res.render('tarefas/editar', {
            session: req.session,
            menu: 'tarefas_editar',
            data: dados_tarefa[0],
            data_clientes: dados_cliente,
            data_projetos: dados_projeto,
            data_tipos: dados_tipo,
            data_historico: dados_historico,
            moment: moment,
            formatter: require('../utils/formatter')
        })

    } else {

        res.render('tarefas/criar', {
            session: req.session,
            menu: 'tarefas_criar',
            data: [],
            data_clientes: dados_cliente,
            data_projetos: dados_projeto,
            data_tipos: dados_tipo,
            moment: moment,
            formatter: require('../utils/formatter')
        })

    }
};

exports.criar = async (req, res, next) => {

    let inserted = await tarefasService.insert(req, res);

    if (inserted.status == 200) {

        req.flash('success', inserted.statusMessage);
        res.locals.message = req.flash();
        res.redirect('/tarefas/acompanhamento/minhas');

    } else {

        req.flash('error', inserted.statusMessage);
        res.locals.message = req.flash();

        res.render('tarefas/criar', {
            session: req.session,
            menu: 'tarefas_minhas',
            data: req.body,
            data_clientes: dados_cliente,
            data_projetos: dados_projeto,
            data_tipos: dados_tipo,
            moment: moment,
            formatter: require('../utils/formatter')
        })
    }
};

exports.editar = async (req, res, next) => {

    let tarefa_editada = await tarefasService.edit(req, res);

    if (tarefa_editada.status == 200) {

        req.flash('success', `Salvo com sucesso.`);
        res.redirect('/tarefas/editar/' + req.params.id);

    } else {

        req.flash('success', `Erro ao salvar.`);

        res.render('tarefas/editar/' + req.params.id, {
            session: req.session,
            menu: 'tarefas_minhas',
            data: req.body,
            data_clientes: dados_cliente,
            data_projetos: dados_projeto,
            data_tipos: dados_tipo,
            moment: moment,
            formatter: require('../utils/formatter')
        })
    }
};

exports.get_historico = async (req, res, next) => {
    let dados_historico = await tarefasService.get_historico_tarefa(req.params.id);
    res.json( JSON.parse(dados_historico) );
};

exports.get_quadro_tarefas = async (req, res, next) => {

    let atendimentos = await tarefasService.get_tarefas_atendendo(req.session.codigo_usuario);
    let dados_atendimento = JSON.parse(atendimentos);

    let sem_atendimento = await tarefasService.get_tarefas_sem_atendimento(req.session.codigo_usuario);
    let dados_sem_atendimento = JSON.parse(sem_atendimento);

    let departamentos = await departamentosService.get_all();
    let dados_departamento = JSON.parse(departamentos);

    res.render('tarefas/quadro', {
        session: req.session,
        menu: 'tarefas_quadro',
        data_atendimento: dados_atendimento,
        data_sem_atendimento: dados_sem_atendimento,
        data_departamentos: dados_departamento,
        moment: moment,
        formatter: require('../utils/formatter')
    });
};

exports.atender_tarefa = async (req, res, next) => {

    let retorno = await tarefasService.update_status_tarefa(req.body.id_atendimento, 'Em Andamento');

    if (retorno.status == 200) {

        let retorno = await andamentosService.update_andamento_atendimento(req.session.codigo_usuario, req.body.id_andamento);

        if (retorno.status == 200) {
            return res.status(200).send({status: 200, mensagem: 'Tarefa em atendimento.'});
        } else {
            return res.status(400).send(retorno);
        }
    } else {
        return res.status(400).send(retorno);
    }
};

exports.retornar_para_fila = async (req, res, next) => {

    let retorno = await andamentosService.update_andamento_retorno(
        req.body.id_andamento,
        req.body.id_atendimento,
        req.body.id_departamento,
        req.session.codigo_usuario
    );

    if (retorno.status == 200) {
        return res.status(200).send(retorno);
    } else {
        return res.status(400).send(retorno);
    }
};

exports.enviar_tarefa = async (req, res, next) => {

    let retorno = await andamentosService.enviar_tarefa(
        req.body.id_andamento,
        req.body.id_atendimento,
        req.body.id_departamento,
        req.session.codigo_usuario,
        req.body.observacao
    );

    if (retorno.status == 200) {
        return res.status(200).send(retorno);
    } else {
        return res.status(400).send(retorno);
    }
};

exports.concluir_tarefa = async (req, res, next) => {

    let retorno = await andamentosService.concluir_tarefa(
        req.body.id_andamento,
        req.body.id_atendimento,
        req.body.id_departamento,
        req.session.codigo_usuario
    );

    if (retorno.status == 200) {
        return res.status(200).send(retorno);
    } else {
        return res.status(400).send(retorno);
    }
};