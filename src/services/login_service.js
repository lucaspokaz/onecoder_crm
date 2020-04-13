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