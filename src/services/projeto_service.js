const db = require('../../config/database');

exports.get_all = () => {

    let SQL = `select projeto.*, cliente.nome as nome_cliente from projeto
                 left join cliente on cliente.id_cliente = projeto.id_cliente
                order by descricao asc`;
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
        let data_inicio_formatada = moment(req.body.data_inicio, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss');
        let data_fim_formatada = moment(req.body.data_fim, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss');

        var user = {
            id_projeto: req.body.nome,
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

        var user = {
            id_atendimento: req.params.id,
            assunto: req.body.assunto,
            id_cliente: req.body.cliente,
            id_projeto: req.body.projeto,
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