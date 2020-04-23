const
    db = require('../../config/database'),
    moment = require('moment');


exports.get_contract_by_id = (idContrato) => {
    let SQL = `select contrato.*, cliente.nome from contrato
                 left join cliente on cliente.id_cliente = contrato.id_cliente
                where id_contrato = ${idContrato}`;
    let retorno = db.exec_promise_json(SQL, [], 'Contrato');
    return retorno;
}

exports.get_contracts_overview = (idCliente) => {

    let SQL =
        `select ativo, data_fim from contrato where id_cliente = ${idCliente} order by id_contrato desc limit 1 `;

    let retorno = db.exec_promise_json(SQL, [], 'Visao Geral de contrato');
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

    let retorno = db.exec_promise_json(SQL, [], 'Contratos');
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
        let result_insert = await db.exec_promise(SQL_INSERT, user, 'Insert contrato');
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

        db.console_results(user)

        let SQL_UPDATE = `update contrato set ? where id_contrato = ${user.id_contrato}`;
        let result_update = await db.exec_promise(SQL_UPDATE, user, 'Update contrato');

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
        let result_delete = await db.exec_promise(SQL_DELETE, [], 'Delete contrato');

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