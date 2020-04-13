const db = require('../../config/database');

exports.get_all = () => {

    let SQL = `select * from fonte_atendimento order by descricao asc`;
    let retorno = db.exec_promise_json(SQL, [], 'Fontes');
    return retorno;
}