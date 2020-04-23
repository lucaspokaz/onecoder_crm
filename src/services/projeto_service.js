const db = require('../../config/database');
const moment = require('moment');
const formatter = require('../utils/formatter');

exports.get_all = () => {

    let SQL = `select projeto.*, cliente.nome as nome_cliente from projeto
                 left join cliente on cliente.id_cliente = projeto.id_cliente
                order by id_projeto asc`;
    let retorno = db.exec_promise_json(SQL, [], 'Projetos');
    return retorno;
}

exports.get_ativos = () => {

    let SQL = `select * from projeto where ativo = 1 order by descricao asc`;
    let retorno = db.exec_promise_json(SQL, [], 'Projetos');
    return retorno;
}

exports.get_by_id = async (IdProjeto) => {

    let SQL = `select * from projeto
                where id_projeto = ${IdProjeto} `;

    let retorno = db.exec_promise_json(SQL, [], 'Projeto');
    return retorno;
}

exports.insert = async (req, res) => {

    try {
        let data_inicio_formatada = formatter.validarDataNull(req.body.data_inicio);
        let data_fim_formatada = formatter.validarDataNull(req.body.data_fim);

        var user = {
            descricao: req.body.descricao,
            inicio: data_inicio_formatada,
            fim: data_fim_formatada,
            ativo: req.body.ativo,
            id_cliente: req.body.cliente
        }

        let SQL_INSERT = 'insert into projeto set ?';
        let result_insert = await db.exec_promise(SQL_INSERT, user);
        let id_inserido = result_insert.insertId;

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
        let data_inicio_formatada = formatter.validarDataNull(req.body.data_inicio);
        let data_fim_formatada = formatter.validarDataNull(req.body.data_fim);

        var user = {
            id_projeto: req.params.id,
            descricao: req.body.descricao,
            inicio: data_inicio_formatada,
            fim: data_fim_formatada,
            ativo: req.body.ativo,
            id_cliente: req.body.cliente
        }

        let SQL_UPDATE = `update projeto set ? where id_projeto = ${user.id_projeto}`;
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