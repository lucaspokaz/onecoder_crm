const db = require('../../config/database');
const moment = require('moment');

exports.get_andamento_by_id = async (IdAndamento) => {

    let SQL = `select * from andamento
                where id_andamento = ${IdAndamento} `;

    return await db.exec_promise(SQL);
}

exports.insert = (andamento, id_tarefa) => {
    let SQL = 'insert into andamento set ?';
    andamento['id_atendimento'] = id_tarefa;
    db.exec_promise(SQL, andamento);
}

exports.update_andamento_atendimento = async (IdUsuario, IdAndamento) => {

    let SQL = `update andamento set id_responsavel = ${IdUsuario} where id_andamento = ${IdAndamento}`;

    try {
        await db.exec_promise(SQL);
        return {status: 200, mensagem: 'Andamento atualizado com sucesso.'}
    } catch (error) {
        return {status: 400, mensagem: error}
    }
}

exports.update_andamento_retorno = async (IdAndamento, IdAtendimento, IdDepartamento, IdUsuario) => {

    try {
        let SQL = `update andamento set data_fim = now() where id_andamento = ${IdAndamento}`;
        await db.exec_promise(SQL);

        let andamento = {
            id_atendimento: IdAtendimento,
            data_inicio: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
            observacao: 'Retornado para fila de atendimento.',
            id_departamento: IdDepartamento,
            id_usuario_andamento: IdUsuario
        }

        await this.insert(andamento, IdAtendimento);
        return {status: 200, mensagem: 'Tarefa retornada para fila.'}
    } catch (error) {
        return {status: 400, mensagem: error}
    }
}

exports.enviar_tarefa = async (IdAndamento, IdAtendimento, IdDepartamento, IdUsuario, Observacao) => {

    try {
        let SQL = `update andamento set data_fim = now() where id_andamento = ${IdAndamento}`;
        await db.exec_promise(SQL);

        let andamento = {
            id_atendimento: IdAtendimento,
            data_inicio: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
            observacao: Observacao,
            id_departamento: IdDepartamento,
            id_usuario_andamento: IdUsuario
        }

        await this.insert(andamento, IdAtendimento);
        return {status: 200, mensagem: 'Tarefa enviada com sucesso.'}
    } catch (error) {
        return {status: 400, mensagem: error}
    }
}