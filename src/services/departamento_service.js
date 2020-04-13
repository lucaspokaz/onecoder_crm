const db = require('../../config/database');

exports.get_all = () => {

    let SQL = `select * from departamento order by descricao asc`;
    let retorno = db.exec_promise_json(SQL, [], 'Departamentos');
    return retorno;
}