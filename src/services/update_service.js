const database = require('../../config/database');

exports.get_versions = async () => {
    let SQL = `SELECT * FROM mensagem where tipo= 'elysius' order by data desc, id_mensagem desc`;
    let retorno = database.exec_promise_json(SQL, [], 'Versões');
    return retorno;
}