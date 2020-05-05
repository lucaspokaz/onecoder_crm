const database = require('../../config/database');

exports.get_all = () => {

    let SQL = `select * from tipo_atendimento order by descricao asc`;
    let retorno = database.exec_promise_json(SQL, [], 'Tipos de atendimento');
    return retorno;
}

exports.get_by_id = (IdTipoAtendimento) => {

    let SQL = `select * from tipo_atendimento where id_tipo_atendimento = ${IdTipoAtendimento}`;
    let retorno = database.exec_promise_json(SQL, [], 'Tipos de Atendimento');
    return retorno;
}