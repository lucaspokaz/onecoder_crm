const database = require('../../config/database');

exports.get_clients_responsibles = (idUsuario) => {

    let SQL = '';

    if (idUsuario in [1, 3]) {
        SQL = `select * from cliente
                order by nome asc`;
    } else {
        SQL = `select * from cliente
                where id_cliente in (select id_cliente from cliente_responsavel where id_usuario = ${idUsuario})
                order by nome asc`;
    }

    let retorno = database.exec_promise_json(SQL, [], 'Clientes responsaveis');
    return retorno;
}

exports.insert = async (req, res) => {

    try {
        var user = {
            id_cliente: req.body.id_cliente,
            id_usuario: req.body.id_usuario
        }

        let SQL_INSERT = 'insert into cliente_responsavel set ?';
        let result_insert = await database.exec_promise(SQL_INSERT, user, 'Insert responsavel');
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

exports.delete = async (idClienteResponsavel) => {

    try {
        console.log(idClienteResponsavel);
        let SQL_DELETE = `delete from cliente_responsavel where id_cliente_reponsavel = ${idClienteResponsavel}`;
        await database.exec_promise(SQL_DELETE, [], 'Delete responsavel');
        // let id_removido = result_insert.insertId;

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