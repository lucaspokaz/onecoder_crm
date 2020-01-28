const db = require('../../config/database');

exports.getUsuarioAutenticado = async (login, senha) => {

    let SQL = ` select id_usuario, nome, email from usuario where email = '${login}' and senha = '${senha}' `;

    let results = await db.exec_promise(SQL, [], 'Autenticação');

    return JSON.stringify(results);
}