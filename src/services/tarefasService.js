const db = require('../../config/database');
const andamentosService = require('../services/andamentosService');
const tiposAtendimentoService = require('../services/tiposAtendimentoService');
const moment = require('moment');

exports.get_tarefa_by_id = async (IdAtendimento) => {

    let SQL = `select atendimento.*, usuario.nome as nome_usuario from atendimento
                 left join usuario on usuario.id_usuario = atendimento.id_usuario
                where id_atendimento = ${IdAtendimento} `;

    let retorno = db.exec_promise_json(SQL, [], 'Tarefa');
    return retorno;
}

exports.get_tarefas_acompanhamento = (idUsuario, SomentePendentes) => {

    let SQL =
        `SELECT
            at.id_atendimento,
            at.inicio as abertura,
            c.nome AS nome_cliente,
            t.descricao AS tipo_atendimento,
            f.descricao as fonte_atendimento,
            REPLACE(REPLACE(at.observacao, CHAR(13), '\r\n'), CHAR(10),'') as observacao,
            d.descricao as departamento,
            at.assunto,
            at.prioridade,
            u.nome as nome_contato,
            at.status,
            at.id_cliente,
            an.id_andamento,
            at.id_tipo_atendimento
        FROM
            atendimento at
        LEFT JOIN andamento an ON at.id_atendimento = an.id_atendimento
                               and an.id_andamento = (select max(id_andamento) from andamento
                                                       where andamento.id_atendimento = at.id_atendimento)
        LEFT JOIN cliente c ON c.id_cliente = at.id_cliente
        LEFT JOIN tipo_atendimento t ON t.id_tipo_atendimento = at.id_tipo_atendimento
        LEFT JOIN fonte_atendimento f ON f.id_fonte_atendimento = at.id_fonte
        LEFT JOIN departamento d ON d.id_departamento = an.id_departamento
        LEFT JOIN usuario u ON u.id_usuario = at.id_usuario

        WHERE at.id_cliente in (select id_cliente from cliente_responsavel
                                 where id_usuario = ${idUsuario}) `;

        if (SomentePendentes) {
            SQL = SQL + `AND at.status <> 'Concluído'`;
        }

    let retorno = db.exec_promise_json(SQL, [], 'Acompanhamento de tarefas');
    return retorno;
}

exports.get_minhas_tarefas_acompanhamento = (idUsuario) => {

    let SQL =
        `SELECT
            at.id_atendimento,
            at.inicio as abertura,
            c.nome AS nome_cliente,
            t.descricao AS tipo_atendimento,
            f.descricao as fonte_atendimento,
            REPLACE(REPLACE(at.observacao, CHAR(13), '\r\n'), CHAR(10),'') as observacao,
            d.descricao as departamento,
            at.assunto,
            at.prioridade,
            u.nome as nome_contato,
            at.status,
            at.id_cliente,
            an.id_andamento,
            at.id_tipo_atendimento
        FROM
            atendimento at
        LEFT JOIN andamento an ON at.id_atendimento = an.id_atendimento
                              AND an.id_andamento = (select max(id_andamento) from andamento
                                                      where andamento.id_atendimento = at.id_atendimento)
        LEFT JOIN cliente c ON c.id_cliente = at.id_cliente
        LEFT JOIN tipo_atendimento t ON t.id_tipo_atendimento = at.id_tipo_atendimento
        LEFT JOIN fonte_atendimento f ON f.id_fonte_atendimento = at.id_fonte
        LEFT JOIN departamento d ON d.id_departamento = an.id_departamento
        LEFT JOIN usuario u ON u.id_usuario = at.id_usuario

        WHERE at.id_usuario = ${idUsuario} `;

    let retorno = db.exec_promise_json(SQL, [], 'Minhas Tarefas');
    return retorno;
}


exports.get_tarefas_visao_geral = () => {

    let SQL =
        `select (select count(*) from atendimento) as tarefas_total,
                (select count(*) from atendimento where atendimento.status = 'Concluído') as tarefas_concluidas,
                (select count(*) from atendimento where atendimento.status <> 'Concluído') as tarefas_em_aberto,
                (select count(*) from fonte_atendimento where id_fonte_atendimento in (select id_fonte from atendimento)) as sistemas_em_atendimento `;

    let retorno = db.exec_promise_json(SQL, [], 'Visao Geral');
    return retorno;
}

exports.get_tarefas_visao_geral_por_cliente = (idCliente) => {

    let SQL =
        `select (select count(*) from atendimento where id_cliente = ${idCliente}) as tarefas_total,
                (select count(*) from atendimento where id_cliente = ${idCliente} and atendimento.status = 'Concluído') as tarefas_concluidas,
                (select count(*) from atendimento where id_cliente = ${idCliente} and atendimento.status <> 'Concluído') as tarefas_em_aberto `;

    let retorno = db.exec_promise_json(SQL, [], 'Visao Geral de cliente');
    return retorno;
}

exports.get_historico_tarefa = (IdAtendimento) => {

    let SQL = `select andamento.*,
                      departamento.descricao as depto_descricao,
                      usuario.nome as nome_usuario
                 from andamento
                 left join departamento on departamento.id_departamento = andamento.id_departamento
                 left join usuario on usuario.id_usuario = andamento.id_usuario_andamento
                where andamento.id_atendimento = ${IdAtendimento}
                order by andamento.id_andamento desc`;

    let retorno = db.exec_promise_json(SQL, [], 'Historico de tarefa');
    return retorno;
}

exports.get_tarefas_atendendo = (IdUsuario) => {

    let SQL =
        `SELECT
        	at.id_atendimento,
        	an.id_andamento,
        	an.data_inicio,
        	c.nome AS nome_cliente,
        	an.id_responsavel,
        	coalesce(an.observacao, at.observacao) as obs_andamento,
        	at.observacao as obs_atendimento,
        	t.descricao AS tipo_atendimento,
        	f.descricao as fonte_atendimento,
        	at.assunto,
        	at.status,
        	an.id_departamento,
        	at.id_tipo_atendimento,
        	at.prioridade,
        	at.id_cliente,
            at.observacao,
            u.nome as nome_contato
        FROM
        	andamento an
        	inner join atendimento at on at.id_atendimento = an.id_atendimento
        	left join cliente c on c.id_cliente = at.id_cliente
        	left join tipo_atendimento t on t.id_tipo_atendimento = at.id_tipo_atendimento
            left join fonte_atendimento f on f.id_fonte_atendimento = at.id_fonte
            left join usuario u ON u.id_usuario = at.id_usuario
        WHERE
           an.id_responsavel = ${IdUsuario}
           and an.data_fim is null
           and at.final is null`;

    let retorno = db.exec_promise_json(SQL, [], 'Tarefas atendendo');
    return retorno;
}

exports.get_tarefas_sem_atendimento = (IdUsuario) => {

    let SQL =
        `SELECT
            at.id_atendimento,
        	an.id_andamento,
        	an.data_inicio,
        	c.nome AS nome_cliente,
        	an.id_responsavel,
        	coalesce(an.observacao, at.observacao) as obs_andamento,
        	at.observacao as obs_atendimento,
        	t.descricao AS tipo_atendimento,
        	f.descricao as fonte_atendimento,
        	at.assunto,
        	at.status,
        	at.prioridade,
        	at.id_tipo_atendimento,
        	an.id_departamento,
            at.id_cliente,
            at.observacao,
            u.nome as nome_contato
        FROM
        	atendimento at
        	LEFT JOIN andamento an ON at.id_atendimento = an.id_atendimento
        	LEFT JOIN cliente c ON c.id_cliente = at.id_cliente
        	LEFT JOIN tipo_atendimento t ON t.id_tipo_atendimento = at.id_tipo_atendimento
            LEFT JOIN fonte_atendimento f ON f.id_fonte_atendimento = at.id_fonte
            LEFT JOIN usuario u ON u.id_usuario = at.id_usuario
        WHERE
        	an.data_fim IS NULL
        	AND at.final IS NULL
        	AND an.id_responsavel is null
        	AND at.status <> 'Concluído'
        	AND (
        		an.id_departamento in (select id_departamento from departamento_usuario where id_usuario = ${IdUsuario} ) or
        		an.id_andamento is null
        	)
        	AND (
        		an.id_usuario_destino is null or
        		an.id_usuario_destino = ${IdUsuario}
        	)`;

    let retorno = db.exec_promise_json(SQL, [], 'Tarefas sem atendimento');
    return retorno;
}

exports.insert = async (req, res) => {

    try {
        let l_data_inicio = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');

        let tipos = await tiposAtendimentoService.get_by_id(req.body.tipo);
        dados_tipo = JSON.parse(tipos);

        var user = {
            inicio: l_data_inicio,
            id_usuario: req.session.codigo_usuario,
            id_cliente: req.body.cliente,
            id_fonte: req.body.sistema,
            id_tipo_atendimento: req.body.tipo,
            observacao: req.body.observacao,
            assunto: req.body.assunto,
            prioridade: req.body.prioridade,
            status: 'Não Iniciado',
            conclusao: ''
        }

        var andamento = {
            id_atendimento: '',
            data_inicio: l_data_inicio,
            observacao: user.observacao,
            id_departamento: dados_tipo[0].id_departamento,
            id_usuario_andamento: req.session.codigo_usuario,
        }

        let SQL_INSERT = 'insert into atendimento set ?';
        let result_insert = await db.exec_promise(SQL_INSERT, user);
        let id_inserido = result_insert.insertId;
        let andamento_inserido = await andamentosService.insert(andamento, id_inserido);

        return {
            status: 200,
            mensagem: 'Salvo com sucesso.'
        }

    } catch (error) {
        console.log(error);
        return {
            status: 400,
            mensagem: error
        }
    }
}

exports.edit = async (req, res) => {

    try {

        var user = {
            id_atendimento: req.params.id,
            assunto: req.body.assunto,
            id_cliente: req.body.cliente,
            id_fonte: req.body.sistema,
            id_tipo_atendimento: req.body.tipo,
            prioridade: req.body.prioridade,
            observacao: req.body.observacao
        }

        let SQL_UPDATE = `update atendimento set ? where id_atendimento = ${user.id_atendimento}`;
        let result_update = await db.exec_promise(SQL_UPDATE, user);

        return {
            status: 200,
            mensagem: 'Salvo com sucesso.'
        }

    } catch (error) {
        console.log(error);
        return {
            status: 400,
            mensagem: error
        }
    }

}

exports.update_status_tarefa = (IdAtendimento, Status) => {

    let SQL = `update atendimento set status = ${Status} where id_atendimento = ${IdAtendimento}`;
    db.exec_promise(SQL);
    return {status: 200, mensagem: 'Atualizado com sucesso.'}

}