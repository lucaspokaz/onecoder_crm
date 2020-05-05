const database = require('../../config/database');

exports.get_all = () => {

    let SQL = `select * from departamento order by descricao asc`;
    let retorno = database.exec_promise_json(SQL, [], 'Departamentos');
    return retorno;
}