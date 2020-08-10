var config = require('../config/configuration').conexao;

function connect() {
	try {
		var conexao = require('mysql').createConnection({
			host: config.server,
			port: config.porta,
			user: config.usuario,
			password: config.password,
			database: config.database
		});
		console.log('Conexão criada...');
		return conexao;
	} catch (error) {
		console.log('Sem conexão!!');
		console.log(error);
		return error;
	}
}

function disconnect(conexao) {
	conexao.end();
	return null;
}

const exec_promise = (sql, options, observacao) => {
	return new Promise((resolve, reject) => {
		var conn = connect();
		conn.query(sql, options, function (err, rows, fields) {
			disconnect(conn);
			if (err) {
				console.log(err)
				return reject(err);
			} else {
				if (sql.indexOf('update') == -1 && sql.indexOf('insert') == -1 && sql.indexOf('delete') == -1) {
					console_results(observacao, JSON.stringify(rows[0]));
					return resolve(rows);
				} else {
					console_results(observacao, JSON.stringify(rows));
					return resolve(rows);
				}
			}
		})
	});
}

const exec_promise_json = (sql, options, observacao) => {
	return new Promise((resolve, reject) => {
		var conn = connect();
		conn.query(sql, options, function (err, rows, fields) {
			disconnect(conn);
			if (err) {
				console.log(err)
				return reject(err);
			} else {
				if (observacao) {
					console_results(observacao, JSON.stringify(rows));
				}
				return resolve(JSON.stringify(rows));
			}
		})
	})
}

const console_results = (entidade, msg) => {
	if (entidade !== '') {
		console.log(global.console_warning, entidade + ': ' + msg);
	}
};

module.exports = {
	connect,
	disconnect,
	exec_promise,
	exec_promise_json,
	console_results
}