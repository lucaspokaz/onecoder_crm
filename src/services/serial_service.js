const database = require('../../config/database');
const { encrypt } = require('../utils/sistema');

exports.get_all_by_cnpj = (cnpj, ano) => {
	let SQL = `select s.*, c.cnpj, c.dt_registro
               from cliente c
               left join cliente_serial s on s.id_cliente = c.id_cliente
							where c.cnpj = '${cnpj}'
							  and s.ano = ${ano} `;
	let retorno = database.exec_promise_json(SQL, []);
	return retorno;
}

exports.get_all_by_cliente = (id_cliente) => {
	let SQL = `select s.*, c.cnpj, c.dt_registro
               from cliente c
               left join cliente_serial s on s.id_cliente = c.id_cliente
							where c.id_cliente = ${id_cliente}
							order by ano desc, mes desc`;
	let retorno = database.exec_promise_json(SQL, [], 'Seriais');
	return retorno;
}

exports.insert = async (data) => {

	try {

		const conteudo_sistema = data.cnpj + ';' +
														 data.fantasia + ';' +
														 data.ano + ';' +
														 data.mes + ';' +
														 data.uf + ';' +
														 data.cidade + ';' +
														 data.conteudo + ';';

		dados = {
      id_cliente: parseInt(data.id_cliente),
      mes: data.mes,
      ano: parseInt(data.ano),
			serial: null,
			serial: conteudo_sistema,
      serial_web: conteudo_sistema,
      elysius_basico: data.elysius_basico ? 1 : 0,
      elysius_nfce: data.elysius_nfce ? 1 : 0,
      elysius_nfe: data.elysius_nfe ? 1 : 0,
      elysius_os: data.elysius_os ? 1 : 0,
      elysius_gestor_mobile: data.elysius_gestor_mobile ? 1 : 0,
      elysius_food: data.elysius_food ? 1 : 0,
      elysius_reports: data.elysius_reports ? 1 : 0,
      elysius_backup: data.elysius_backup ? 1 : 0,
      nfacil_nfce: data.nfacil_nfce ? 1 : 0,
      nfacil_nfe: data.nfacil_nfe ? 1 : 0,
      nfacil_reports: data.nfacil_reports ? 1 : 0,
      nfacil_backup: data.nfacil_backup ? 1 : 0,
		}

		let SQL_INSERT = 'insert into cliente_serial set ?';
		let result_insert = await database.exec_promise(SQL_INSERT, dados, 'Insert serial');
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

exports.delete = async (id_cliente, ano, mes) => {

	try {
		let SQL_DELETE = `delete from cliente_serial where id_cliente = ${id_cliente} and ano = ${ano} and mes = ${mes}`;
		let result_delete = await database.exec_promise(SQL_DELETE, [], 'Delete serial');

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