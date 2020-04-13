const db = require('../../config/database');
const moment = require('moment');

const tarefasService = require('./tarefa_service');
const loginService = require('./login_service');

exports.get_andamento_by_id = async (IdAndamento) => {

    let SQL = `select * from andamento
                where id_andamento = ${IdAndamento} `;

    return await db.exec_promise(SQL);
}

exports.get_ultimos_andamentos = async (IdUsuario) => {

    let SQL = `select id_andamento, id_atendimento, data_inicio, observacao, usuario.nome
                 from andamento
                 left join usuario
                      on usuario.id_usuario = andamento.id_usuario_andamento
                where andamento.data_inicio  > (NOW() - INTERVAL 30 DAY)
                  and andamento.id_usuario_andamento <> ${IdUsuario} `;

    return await db.exec_promise(SQL);
}

exports.insert = (andamento, id_tarefa) => {
    let SQL = 'insert into andamento set ?';
    andamento['id_atendimento'] = id_tarefa;
    db.exec_promise(SQL, andamento, 'Inserção de andamento');
}

exports.update_andamento_atendimento = async (IdUsuario, IdAndamento) => {

    let SQL = `update andamento set id_responsavel = ${IdUsuario} where id_andamento = ${IdAndamento}`;

    try {
        await db.exec_promise(SQL, [], 'Update andamento responsável');
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
        await db.exec_promise(SQL, [], 'Update andamento conclusão');

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

exports.concluir_tarefa = async (IdAndamento, IdAtendimento, IdDepartamento, IdUsuario) => {

    try {

        // pegar nome do usuario
        let usuarios = await loginService.get_usuario(IdUsuario);
        let usuario = JSON.parse(usuarios);

        // atualizando andamento atual
        let SQL = `update andamento set data_fim = now() where id_andamento = ${IdAndamento}`;
        await db.exec_promise(SQL);

        // novo andamento
        let andamento = {
            id_atendimento: IdAtendimento,
            data_inicio: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
            observacao: 'Concluído pelo ' + usuario.nome,
            id_departamento: IdDepartamento,
            id_usuario_andamento: IdUsuario
        }
        await this.insert(
            andamento,
            IdAtendimento
        );

        // conclui tarefa
        await tarefasService.conclui_status_tarefa(
            IdAtendimento,
            'Concluído',
            'Concluído pelo ' + usuario.nome
        );

        return {status: 200, mensagem: 'Tarefa concluída com sucesso.'}
    } catch (error) {
        return {status: 400, mensagem: error}
    }
}