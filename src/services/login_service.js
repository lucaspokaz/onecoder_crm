const database = require('../../config/database');

exports.getUsuarioAutenticado = async (login, senha) => {

  let SQL = ` select id_usuario, nome, email from usuario where email = '${login}' and senha = '${senha}' `;

  let results = await database.exec_promise(SQL, [], 'Autenticação');

  return JSON.stringify(results);
}

exports.get_usuario = async (IdUsuario) => {

  let SQL = ` select id_usuario, nome, email from usuario where id_usuario = ${IdUsuario} `;
  let results = await database.exec_promise(SQL, [], 'Usuario');
  return JSON.stringify(results[0]);

}

exports.get_users = async (IdUsuario) => {

  let SQL = ` select id_usuario, nome, email from usuario `;
  let results = await database.exec_promise(SQL, [], 'Usuarios');
  return JSON.stringify(results);

}

exports.get_emails_notificacao = async (IdUsuario, IdDepto) => {

  let SQL = ` select
                    distinct email, usuario.nome, notificar_andamento
                  from
                    departamento_usuario
                  left join
                    usuario on usuario.id_usuario = departamento_usuario.id_usuario
                    or usuario.id_usuario = ${IdUsuario}
                 where
                    departamento_usuario.id_departamento = ${IdDepto} `;

  let results = await database.exec_promise(SQL, [], 'Emails Notificação');
  return JSON.stringify(results);

}
