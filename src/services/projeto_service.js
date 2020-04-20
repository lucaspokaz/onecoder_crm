const db = require('../../config/database');

exports.get_all = () => {

    let SQL = `select * from projeto order by descricao asc`;
    let retorno = db.exec_promise_json(SQL, [], 'Projetos');
    return retorno;
}