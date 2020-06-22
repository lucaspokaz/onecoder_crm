const clienteService = require('../services/cliente_service');
const projetosService = require('../services/projeto_service');
const tiposAtendimentoService = require('../services/tipoatendimento_service');
const tarefasService = require('../services/tarefa_service');
const andamentosService = require('../services/andamento_service');
const departamentosService = require('../services/departamento_service');
const path = require('path');

let dados_cliente;
let dados_projeto;
let dados_tipo;

var moment = require('moment');
moment.locale('pt-br');

exports.list_pending = async (req, res, next) => {

    let results = await tarefasService.get_tasks(req.session.codigo_usuario, true);
    dados = await JSON.parse(results);

    let geral = await tarefasService.get_tasks_overview();
    dados_geral = await JSON.parse(geral);

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

exports.list_my_list = async (req, res, next) => {

    let results = await tarefasService.get_mytasks(req.session.codigo_usuario);
    let geral = await tarefasService.get_tasks_overview();

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

exports.list_all = async (req, res, next) => {

    let results = await tarefasService.get_tasks(req.session.codigo_usuario, false);
    let geral = await tarefasService.get_tasks_overview();

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

exports.load = async (req, res, next) => {

    let clientes = await clienteService.get_clients_responsibles(req.session.codigo_usuario);
    dados_cliente = JSON.parse(clientes);

    let projetos = await projetosService.get_all();
    dados_projeto = JSON.parse(projetos);

    let tipos = await tiposAtendimentoService.get_all();
    dados_tipo = JSON.parse(tipos);

    if ((req.params.id) && (req.params.id > 0)) {

        let tarefa = await tarefasService.get_by_id(req.params.id);
        let dados_tarefa = JSON.parse(tarefa);

        let historico = await tarefasService.get_task_history(req.params.id);
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
            path: path,
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
            path: path,
            formatter: require('../utils/formatter')
        })

    }
};

exports.create = async (req, res, next) => {

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

exports.edit = async (req, res, next) => {

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

exports.list_task_history = async (req, res, next) => {
    let dados_historico = await tarefasService.get_task_history(req.params.id);
    res.json(JSON.parse(dados_historico));
};

exports.list_task_board = async (req, res, next) => {

    let atendimentos = await tarefasService.get_tasks_in_progress(req.session.codigo_usuario);
    let dados_atendimento = JSON.parse(atendimentos);

    let sem_atendimento = await tarefasService.get_tasks_no_progress(req.session.codigo_usuario);
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

exports.take_task = async (req, res, next) => {

    let retorno = await tarefasService.edit_task_status(req.body.id_atendimento, 'Em Andamento');

    if (retorno.status == 200) {

        let retorno = await andamentosService.edit_progress_owner(req.session.codigo_usuario, req.body.id_andamento);

        if (retorno.status == 200) {
            return res.status(200).send({ status: 200, mensagem: 'Tarefa em atendimento.' });
        } else {
            return res.status(400).send(retorno);
        }
    } else {
        return res.status(400).send(retorno);
    }
};

exports.return_task = async (req, res, next) => {

    let retorno = await andamentosService.edit_progress_return(
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

exports.send_task = async (req, res, next) => {

    let retorno = await andamentosService.send_task(
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

exports.finish_task = async (req, res, next) => {

    let retorno = await andamentosService.finish_task(
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

exports.anexar = async (req, res, next) => {

    if ((req.params.id) && (req.params.id > 0)) {
        let retorno = await tarefasService.anexar_arquivo(req.params.id, req.file.originalname, req.file.filename, req.file.size);
        if (retorno.status == 200) {
            return res.status(200).send(retorno);
        } else {
            return res.status(400).send(retorno);
        }
    }
};

exports.list_anexos = async (req, res, next) => {
    let dados_anexo = await tarefasService.get_anexos(req.params.id);
    res.json(JSON.parse(dados_anexo));
};

exports.get_by_key = async (req, res, next) => {
    let dados_anexo = await tarefasService.get_by_key(req.params.key);
    let retorno = JSON.parse(dados_anexo);
    retorno[0].url = path.resolve(__dirname, '..', '..', 'public', 'uploads');
    res.json(retorno[0]);
};

exports.remover_anexo = async (req, res, next) => {

    if (req.params.key) {

        let retorno = await tarefasService.delete_anexo(req.params.key);

        let fs = require('fs');
        var filePath = path.join('uploads/', req.params.key);
        console.log(filePath);
        fs.unlinkSync(filePath);

        if (retorno.status == 200) {
            return res.status(200).send(retorno);
        } else {
            return res.status(400).send(retorno);
        }
    }
};