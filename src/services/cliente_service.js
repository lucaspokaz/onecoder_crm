const db = require('../../config/database');

exports.get_client_by_id = (idCliente) => {

    let SQL = `select * from cliente where id_cliente = ${idCliente}`;
    let retorno = db.exec_promise_json(SQL, [], 'Cliente');
    return retorno;
}

exports.get_clients = () => {

    let SQL = `select id_cliente, nome, cnpj from cliente
                order by nome asc`;

    let retorno = db.exec_promise_json(SQL, [], 'Clientes');
    return retorno;
}

exports.get_clients_responsibles = (idUsuario) => {

    let SQL = '';

    if (idUsuario in [1, 3]) {
        SQL = `select id_cliente, nome, cnpj from cliente
                order by nome asc`;
    } else {
        SQL = `select id_cliente, nome, cnpj from cliente
                where id_cliente in (select id_cliente from cliente_responsavel where id_usuario = ${idUsuario})
                order by nome asc`;
    }

    let retorno = db.exec_promise_json(SQL, [], 'Clientes responsaveis');
    return retorno;
}

exports.get_client_owners = (idCliente) => {

    let SQL = `select
                    d.*,
                    u.nome as usuario from cliente_responsavel d
                 left join usuario u
                    on d.id_usuario = u.id_usuario
                where
                    d.id_cliente = ${idCliente}
                order by u.nome asc`;

    let retorno = db.exec_promise_json(SQL, [], 'Responsaveis');
    return retorno;
}

exports.insert = async (req, res) => {

    try {
        let cnpj_formatado = req.body.cnpj;
        cnpj_formatado = cnpj_formatado.split('.').join('');
        cnpj_formatado = cnpj_formatado.split('/').join('');
        cnpj_formatado = cnpj_formatado.split('-').join('');

        let fone1_formatado = req.body.fone1;
        fone1_formatado = fone1_formatado.split('.').join('');
        fone1_formatado = fone1_formatado.split('/').join('');
        fone1_formatado = fone1_formatado.split('-').join('');

        let fone2_formatado = req.body.fone2;
        fone2_formatado = fone2_formatado.split('.').join('');
        fone2_formatado = fone2_formatado.split('/').join('');
        fone2_formatado = fone2_formatado.split('-').join('');

        var user = {
            id_cliente: req.params.id,
            nome: req.body.nome,
            cnpj: cnpj_formatado,
            ativo: req.body.ativo,
            email: req.body.email,
            contato: req.body.contato,
            fantasia: req.body.fantasia,
            razao: req.body.razao,
            cep: req.body.cep,
            uf: req.body.uf,
            cidade: req.body.cidade,
            bairro: req.body.bairro,
            logradouro: req.body.logradouro,
            numero: req.body.numero,
            fone1: fone1_formatado,
            fone2: fone2_formatado,
            ibge: req.body.ibge,
            observacoes: '',
            complemento: req.body.complemento
        }

        let SQL_INSERT = 'insert into cliente set ?';
        let result_insert = await db.exec_promise(SQL_INSERT, user, 'Insert cliente');
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

        let cnpj_formatado = req.body.cnpj;
        cnpj_formatado = cnpj_formatado.split('.').join('');
        cnpj_formatado = cnpj_formatado.split('/').join('');
        cnpj_formatado = cnpj_formatado.split('-').join('');

        let fone1_formatado = req.body.fone1;
        fone1_formatado = fone1_formatado.split('.').join('');
        fone1_formatado = fone1_formatado.split('/').join('');
        fone1_formatado = fone1_formatado.split('-').join('');

        let fone2_formatado = req.body.fone2;
        fone2_formatado = fone2_formatado.split('.').join('');
        fone2_formatado = fone2_formatado.split('/').join('');
        fone2_formatado = fone2_formatado.split('-').join('');

        var user = {
            id_cliente: req.params.id,
            nome: req.body.nome,
            cnpj: cnpj_formatado,
            ativo: req.body.ativo,
            email: req.body.email,
            contato: req.body.contato,
            fantasia: req.body.fantasia,
            razao: req.body.razao,
            cep: req.body.cep,
            uf: req.body.uf,
            cidade: req.body.cidade,
            bairro: req.body.bairro,
            logradouro: req.body.logradouro,
            numero: req.body.numero,
            fone1: fone1_formatado,
            fone2: fone2_formatado,
            ibge: req.body.ibge,
            observacoes: '',
            complemento: req.body.complemento
        }

        let SQL_UPDATE = `update cliente set ? where id_cliente = ${user.id_cliente}`;
        let result_update = await db.exec_promise(SQL_UPDATE, user, 'Update cliente');

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