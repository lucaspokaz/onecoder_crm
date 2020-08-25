const database = require('../../config/database');
const moment = require('moment');

exports.get_versions = async (sistema) => {
	let SQL = `SELECT * FROM mensagem where tipo= lower('${sistema}') order by data desc, id_mensagem desc`;
	let retorno = database.exec_promise_json(SQL, [], 'Versões');
	return retorno;
}

exports.get_by_name = async (sistema, arquivo) => {
	let SQL = `SELECT * FROM update_files where lower(sistema) = lower('${sistema}') and lower(arquivo) = lower('${arquivo}') `;
	let retorno = database.exec_promise_json(SQL, [], 'Versões');
	return retorno;
}

exports.delete_by_name = async (sistema, arquivo) => {
	let SQL = `DELETE FROM update_files where lower(sistema) = lower('${sistema}') and lower(arquivo) = lower('${arquivo}') `;
	let retorno = database.exec_promise_json(SQL, [], 'Delete Versões');
	return retorno;
}

exports.get_update_files = async (sistema) => {
	let SQL = `SELECT * FROM update_files where sistema = '${sistema}' order by data_atualizacao desc`;
	let retorno = database.exec_promise_json(SQL, [], 'update_files');
	return retorno;
}

exports.get_update_files_especials = async (sistema) => {
	let SQL = `SELECT * FROM update_files where sistema = '${sistema}' and especial = 1 order by data_atualizacao desc`;
	let retorno = database.exec_promise_json(SQL, [], 'update_files');
	return retorno;
}

exports.insert_update_file = async (sistema, nome, versao) => {
	try {
		await this.delete_by_name(sistema, nome);

		let especial = nome === 'update.exe' ? 1 : 0;

		let user = {
			sistema: sistema,
			arquivo: nome,
			versao: versao,
			data_atualizacao: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
			especial: especial,
		}

		let SQL_INSERT = 'insert into update_files set ?';
		let result_insert = await database.exec_promise(SQL_INSERT, user);

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

exports.insert_history = async (ip, computador, arquivo, sistema) => {
	try {
		let user = {
			ip,
			computador,
			arquivo,
			sistema,
			data_atualizacao: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
		}

		let SQL_INSERT = 'insert into update_hist set ?';
		let result_insert = await database.exec_promise(SQL_INSERT, user);

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