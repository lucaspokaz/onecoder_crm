const database = require('../../config/database');
const serialService = require('../services/serial_service');

exports.get_id = (idCliente) => {
	let SQL = `select * from cliente where id_cliente = ${idCliente}`;
	let retorno = database.exec_promise(SQL, [], 'Cliente');
	return retorno;
}

exports.get_client_by_id = (idCliente) => {
	let SQL = `select * from cliente where id_cliente = ${idCliente}`;
	let retorno = database.exec_promise_json(SQL, [], 'Cliente');
	return retorno;
}


exports.get_client_by_cnpj = (cnpj) => {
	let SQL = `select * from cliente where cnpj = '${cnpj}'`;
	let retorno = database.exec_promise_json(SQL, [], 'Cliente');
	return retorno;
}

exports.get_clients = () => {

	let SQL = ` select * from cliente
	              where ativo <> 3
                order by nome asc`;

	let retorno = database.exec_promise_json(SQL, [], 'Clientes');
	return retorno;
}

exports.get_clients_by_tipo = (tipo) => {

	let SQL = ` select * from cliente
	              where ativo = ${tipo}
                order by nome asc`;

	let retorno = database.exec_promise_json(SQL, [], 'Clientes');
	return retorno;
}

exports.get_clients_registereds = () => {

	let SQL = ` select * from cliente
	             where ativo = 3
                order by nome asc`;

	let retorno = database.exec_promise_json(SQL, [], 'Clientes');
	return retorno;
}

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

exports.get_client_owners = (idCliente) => {

	let SQL = `select
                    d.*,
                    u.nome as usuario
                from cliente_responsavel d
                 left join usuario u
                    on d.id_usuario = u.id_usuario
                where
                    d.id_cliente = ${idCliente}
                order by u.nome asc`;

	let retorno = database.exec_promise_json(SQL, [], 'Responsaveis');
	return retorno;
}

exports.insert = async (cliente) => {

	try {
		let SQL_INSERT = 'insert into cliente set ?';
		let result_insert = await database.exec_promise(SQL_INSERT, cliente, 'Insert cliente');
		let id_inserido = result_insert.insertId;

		let data_atual = new Date();

		const conteudo_sistema = cliente.cnpj + ';' +
			cliente.fantasia + ';' +
			data_atual.getFullYear() + ';' +
			data_atual.getMonth() + ';' +
			cliente.uf + ';' +
			cliente.cidade + ';' +
			'AIJ' + ';';

		dados = {
			id_cliente: id_inserido,
			mes: data_atual.getMonth(),
			ano: data_atual.getFullYear(),
			cnpj: cliente.cnpj,
			fantasia: cliente.fantasia,
			uf: cliente.uf,
			cidade: cliente.cidade,
			conteudo_sistema: conteudo_sistema,
			serial: conteudo_sistema,
			serial_web: conteudo_sistema,
			elysius_basico: 1,
			elysius_nfce: 0,
			elysius_nfe: 0,
			elysius_os: 0,
			elysius_gestor_mobile: 0,
			elysius_food: 0,
			elysius_reports: 0,
			elysius_backup: 0,
			nfacil_nfce: 1,
			nfacil_nfe: 1,
			nfacil_reports: 0,
			nfacil_backup: 0,
		}

		await serialService.insert(dados);

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
		let result_update = await database.exec_promise(SQL_UPDATE, user, 'Update cliente');

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