const database = require('../../config/database');
const moment = require('moment');
moment.locale('pt-br');

const tarefasService = require('./tarefa_service');
const loginService = require('./login_service');

exports.get_progress_by_id = async (IdAndamento) => {

    let SQL = `select * from andamento
                where id_andamento = ${IdAndamento} `;

    return await database.exec_promise(SQL);
}

exports.get_progress_last15 = async (IdUsuario) => {

    let SQL = `select andamento.id_andamento,
                      andamento.id_atendimento,
                      andamento.data_inicio,
                      andamento.observacao,
                      usuario.nome,
                      atendimento.assunto,
                      UPPER(SUBSTRING(usuario.nome FROM 1 FOR 2)) as nome_curto
                 from andamento
                 left join usuario
                      on usuario.id_usuario = andamento.id_usuario_andamento
                 left join atendimento
                      on atendimento.id_atendimento = andamento.id_atendimento
                where andamento.data_inicio  > (NOW() - INTERVAL 15 DAY)
                  and andamento.id_usuario_andamento <> ${IdUsuario}
                  and atendimento.id_cliente in (select id_cliente from cliente_responsavel where id_usuario = ${IdUsuario})
                order by data_inicio desc`;

    let retorno = database.exec_promise_json(SQL, [], 'Tarefa');

    return retorno;
}

exports.insert = (andamento, id_tarefa) => {
    let SQL = 'insert into andamento set ?';
    andamento['id_atendimento'] = id_tarefa;
    database.exec_promise(SQL, andamento, 'Inserção de andamento');
}

exports.edit_progress_owner = async (IdUsuario, IdAndamento) => {

    let SQL = `update andamento set id_responsavel = ${IdUsuario} where id_andamento = ${IdAndamento}`;

    try {
        await database.exec_promise(SQL, [], 'Update andamento responsável');
        return {status: 200, mensagem: 'Andamento atualizado com sucesso.'}
    } catch (error) {
        return {status: 400, mensagem: error}
    }
}

exports.edit_progress_return = async (IdAndamento, IdAtendimento, IdDepartamento, IdUsuario) => {

    try {
        let SQL = `update andamento set data_fim = now() where id_andamento = ${IdAndamento}`;
        await database.exec_promise(SQL);

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

exports.send_task = async (IdAndamento, IdAtendimento, IdDepartamento, IdUsuario, Observacao) => {

    try {
        let SQL = `update andamento set data_fim = now() where id_andamento = ${IdAndamento}`;
        await database.exec_promise(SQL, [], 'Update andamento conclusão');

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

exports.finish_task = async (IdAndamento, IdAtendimento, IdDepartamento, IdUsuario) => {

    try {

        // pegar nome do usuario
        let usuarios = await loginService.get_usuario(IdUsuario);
        let usuario = JSON.parse(usuarios);

        // atualizando andamento atual
        let SQL = `update andamento set data_fim = now() where id_andamento = ${IdAndamento}`;
        await database.exec_promise(SQL);

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
        await tarefasService.edit_task_status_with_comment(
            IdAtendimento,
            'Concluído',
            'Concluído pelo ' + usuario.nome
        );

        return {status: 200, mensagem: 'Tarefa concluída com sucesso.'}
    } catch (error) {
        return {status: 400, mensagem: error}
    }
}