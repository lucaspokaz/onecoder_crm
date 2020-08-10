const database = require('../../config/database');
const moment = require('moment');
const formatter = require('../utils/formatter');

exports.get_all_by_cnpj = (cnpj, ano) => {
	let SQL = `select s.*, c.cnpj
               from cliente c
               left join cliente_serial s on s.id_cliente = c.id_cliente
							where c.cnpj = '${cnpj}'
							  and s.ano = ${ano} `;
	let retorno = database.exec_promise_json(SQL, []);
	return retorno;
}