var conexao = {
    server: 'localhost',
    porta: 3306,
    usuario: 'XXXXXX',
    password: 'XXXXXX',
    database: 'XXXXXX'
}

var store_sessions = {
    // Host name for database connection:
    host: conexao.server,
    // Port number for database connection:
    port: conexao.porta,
    // Database user:
    user: conexao.usuario,
    // Password for the above database user:
    password: conexao.password,
    // Database name:
    database: conexao.database,
    // Whether or not to automatically check for and clear expired sessions:
    clearExpired: true,
    // How frequently expired sessions will be cleared; milliseconds:
    checkExpirationInterval: 900000,
    // The maximum age of a valid session; milliseconds:
    expiration: 86400000,
    // Whether or not to create the sessions database table, if one does not already exist:
    createDatabaseTable: true,
    // Number of connections when creating a connection pool:
    connectionLimit: 1,
    // Whether or not to end the database connection when the store is closed.
    // The default value of this option depends on whether or not a connection was passed to the constructor.
    // If a connection object is passed to the constructor, the default value for this option is false.
    endConnectionOnClose: true,
    charset: 'utf8mb4_bin',
    schema: {
        tableName: 'sessao_web',
        columnNames: {
            session_id: 'id_sessao_web',
            expires: 'expires',
            data: 'data'
        }
    }
};

var my_session = {
    codigo_usuario: '',
    nome_usuario: ''
}

module.exports = {
    conexao,
    store_sessions,
    my_session
}