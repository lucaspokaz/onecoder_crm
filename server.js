const express = require('express');
const session = require('express-session');
const mysqlStore = require('express-mysql-session')(session);
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

const
    bodyParser = require('body-parser'),
    port = 30000,
    db = require('./config/database'),
    mysql_store = require('express-mysql-session')(session),
    configs = require('./config/configuration'),
    morgan = require('morgan'),
    package_json = require('./package.json');

var mysqlSessionStore = new mysqlStore(configs.store_sessions);
var app = express();

global.console_warning = '\x1b[33m%s\x1b[0m';

// pasta public com cache
let seteDias = 60 * 1000 * 60 * 24 * 7;
app.use(express.static('public', { maxAge: seteDias }));

app.set('view engine', 'ejs')
app.set('views', __dirname + '/src/views');

// SESSION

// set sessions and cookie parser
app.use(cookieParser());
app.use(session({
    key: 'session_cookie_name',
    secret: 'session_cookie_secret',
    store: mysqlSessionStore,
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }, // 7 dias
    resave: true,    // forces the session to be saved back to the store
    saveUninitialized: true,  // dont save unmodified
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(flash());

app.use(morgan('dev'));

//Global variables
app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success');
    res.locals.error_msg = req.flash('error');
    res.locals.alert_msg = req.flash('alert');
    next();
})

app.use(function(req, res, next) {
    req.session.menu_ativo = '';
    next();
})

// Rotas
const indexRoute = require('./src/routes/index_route');
const loginRoute = require('./src/routes/login_route');
const tarefasRoute = require('./src/routes/tarefa_route');
const clientesRoute = require('./src/routes/cliente_route');
const contratosRoute = require('./src/routes/contrato_route');
const updatesRoute = require('./src/routes/update_route');
const projetosRoute = require('./src/routes/projeto_route');

// Uso das Rotas
app.use('/', loginRoute);
app.use('/login', loginRoute);
app.use('/index', indexRoute);
app.use('/tarefas', tarefasRoute);
app.use('/clientes', clientesRoute);
app.use('/contratos', contratosRoute);
app.use('/updates', updatesRoute);
app.use('/projetos', projetosRoute);

try {
    conn = db.connect();
    db.disconnect(conn);

    // tempo para carregamento de uma tela (antes estava dando ERR_CONTENT_LENGTH_MISMATCH)
    app.timeout = 120000 * 5;
    app.listen(port, function() {
        console.log(`Aplicação disponível em http://localhost:${port}`)
    })
} catch (error) {
    console.log(error);
    return null;
}

app.use((req, res, next) => {
    const erro = new Error('Não encontrado.');
    erro.status = 404;
    res.status(erro.status).render(__dirname + '/public/404');
});

module.exports = app;