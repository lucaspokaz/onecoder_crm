const database = require('../../config/database');
const moment = require('moment-timezone');

exports.get_contract_by_id = (idContrato) => {
    let SQL = `select contrato.*, cliente.nome from contrato
                 left join cliente on cliente.id_cliente = contrato.id_cliente
                where id_contrato = ${idContrato}`;
    let retorno = database.exec_promise_json(SQL, [], 'Contrato');
    return retorno;
}

exports.get_contracts_overview = (idCliente) => {

    let SQL =
        `select ativo, data_fim from contrato where id_cliente = ${idCliente} order by id_contrato desc limit 1 `;

    let retorno = database.exec_promise_json(SQL, [], 'Visao Geral de contrato');
    return retorno;
}

exports.get_contracts_active = () => {

    let SQL = `select
                    contrato.*,
                    cliente.nome,
                    projeto.descricao as desc_projeto,
                    datediff(data_fim, curdate()) as dias_restantes
                from
                    contrato
                left join projeto on projeto.id_projeto = contrato.id_projeto
                left join cliente on cliente.id_cliente = contrato.id_cliente
                where
                    contrato.ativo = 'S'
                order by
                    dias_restantes`;

    let retorno = database.exec_promise_json(SQL, [], 'Contratos');
    return retorno;
}

exports.get_contracts_active_responsavel = (idUsuario) => {

    let SQL = `select
                    contrato.*,
                    cliente.nome,
                    projeto.descricao as desc_projeto,
                    datediff(data_fim, curdate()) as dias_restantes
                from
                    contrato
                left join projeto on projeto.id_projeto = contrato.id_projeto
                left join cliente on cliente.id_cliente = contrato.id_cliente
                where
                    contrato.ativo = 'S'
                    and cliente.id_cliente in (select id_cliente from cliente_responsavel
                                                where id_usuario = ${idUsuario})
                order by
                    dias_restantes`;

    let retorno = database.exec_promise_json(SQL, [], 'Contratos');
    return retorno;
}

exports.insert = async (req, res) => {

    try {

        let data_inicio_formatada = moment(req.body.data_inicio, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss');
        let data_fim_formatada = moment(req.body.data_fim, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss');

        var user = {
            id_cliente: req.body.cliente,
            data_inicio: data_inicio_formatada,
            data_fim: data_fim_formatada,
            observacao: req.body.observacao,
            renovacao: req.body.renovacao,
            id_projeto: req.body.projeto,
            valor: req.body.valor,
            ativo: req.body.ativo
        }

        let SQL_INSERT = 'insert into contrato set ?';
        let result_insert = await database.exec_promise(SQL_INSERT, user, 'Insert contrato');
        let id_inserido = result_insert.insertId;

        return {
            status: 200,
            mensagem: 'Salvo com sucesso.',
            insertedId: result_insert.insertId
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

        let data_inicio_formatada = moment(req.body.data_inicio, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss');
        let data_fim_formatada = moment(req.body.data_fim, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss');

        var user = {
            id_contrato: req.params.id,
            id_cliente: req.body.cliente,
            data_inicio: data_inicio_formatada,
            data_fim: data_fim_formatada,
            observacao: req.body.observacao,
            renovacao: req.body.renovacao,
            id_projeto: req.body.projeto,
            valor: req.body.valor,
            ativo: req.body.ativo
        }

        database.console_results(user)

        let SQL_UPDATE = `update contrato set ? where id_contrato = ${user.id_contrato}`;
        let result_update = await database.exec_promise(SQL_UPDATE, user, 'Update contrato');

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

exports.delete = async (idContrato) => {

    try {

        let SQL_DELETE = `delete from contrato where id_contrato = ${idContrato}`;
        let result_delete = await database.exec_promise(SQL_DELETE, [], 'Delete contrato');

        return {
            status: 200,
            mensagem: 'Removido com sucesso.'
        }

    } catch (error) {
        console.log(error);
        return {
            status: 400,
            mensagem: error
        }
    }

}

exports.renew = async (idContrato) => {

    try {

        let contrato = await this.get_contract_by_id(idContrato)
        let contrato_atual = JSON.parse(contrato)
        let contrato_novo = contrato_atual[0]

        var novo = {
            id_cliente: contrato_novo.id_cliente,
            data_inicio: moment(contrato_novo.data_inicio).add(1, 'year').format('YYYY-MM-DD HH:mm:ss'),
            data_fim: moment(contrato_novo.data_fim).add(1, 'year').format('YYYY-MM-DD HH:mm:ss'),
            observacao: contrato_novo.observacao,
            renovacao: 'S',
            id_projeto: contrato_novo.id_projeto,
            valor: contrato_novo.valor,
            ativo: contrato_novo.ativo
        }

        let SQL_INSERT = 'insert into contrato set ?';
        let result_insert = await database.exec_promise(SQL_INSERT, novo, 'Renovacao contrato novo');

        var antigo = {
            ativo: 'N'
        }

        let SQL_UPDATE = `update contrato set ? where id_contrato = ${idContrato}`;
        let result_update = await database.exec_promise(SQL_UPDATE, antigo, 'Renovacao contrato update');

        return {
            status: 200,
            mensagem: 'Renovado com sucesso.'
        }

    } catch (error) {
        console.log(error);
        return {
            status: 400,
            mensagem: error
        }
    }

}