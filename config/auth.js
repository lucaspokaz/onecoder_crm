var configs = require('./configuration');

function loggedIn(req, res, next) {

    if (req.session.esta_logado == true) {
        console.log('ok, estou logado!')
        next();
    } else {
        console.log('ops! não consegui redirecionar para o login')
        console.log(req.session);
        res.redirect('/login');
    }
}

module.exports = {
    loggedIn
}