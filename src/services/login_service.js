const db = require('../../config/database');

exports.getUsuarioAutenticado = async (login, senha) => {

    let SQL = ` select id_usuario, nome, email from usuario where email = '${login}' and senha = '${senha}' `;

    let results = await db.exec_promise(SQL, [], 'Autenticação');

    return JSON.stringify(results);
}

exports.get_usuario = async (IdUsuario) => {

    let SQL = ` select id_usuario, nome, email from usuario where id_usuario = ${IdUsuario} `;
    let results = await db.exec_promise(SQL, [], 'Usuario');
    return JSON.stringify(results[0]);

}

exports.get_emails_notificao = async (IdUsuario, IdDepto) => {

    let SQL = ` select
                    distinct email, usuario.nome, notificar_andamento
                  from
                    departamento_usuario
                  left join
                    usuario on usuario.id_usuario = departamento_usuario.id_usuario
                    or usuario.id_usuario = ${IdUsuario}
                 where
                    departamento_usuario.id_departamento = ${IdDepto} `;

    let results = await db.exec_promise(SQL, [], 'Emails Notificação');
    return JSON.stringify(results);

}
