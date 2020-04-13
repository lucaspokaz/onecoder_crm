const service = require('../services/login_service');
const package_json = require('../../package.json');
const session = require('express-session');

exports.get = async (req, res, next) => {
    if (req.session.esta_logado == true) {
        res.redirect('/index');
    } else {
        res.render('login', {
            menu: 'principal',
            session: req.session
        });
    }
};

exports.logout = async (req, res, next) => {
    req.session.esta_logado = false;
    req.session.codigo_usuario = '';
    req.session.nome_usuario = '';

    req.flash('success', `Usuário desconectado.`);
    res.redirect('/login');
};

exports.post = async (req, res, next) => {

    let results = await service.getUsuarioAutenticado(req.body.login, req.body.password);
    let dados_result = JSON.parse(results);

    if (dados_result.length == 0) {

        req.flash('error', `Usuário e/ou Senha são incompatíveis.`);
        res.redirect('/login');

    } else {
        let user = JSON.parse(results)[0];

        if (!user || user.id_usuario == 0) {

            req.session.versao_sistema = package_json.version;

            req.flash('error', `Usuário e/ou Senha são incompatíveis.`);
            res.render('login');

        } else {
            req.session.esta_logado = true;
            req.session.codigo_usuario = user.id_usuario;
            req.session.nome_usuario = user.nome;
            req.session.versao_sistema = package_json.version;

            res.session = req.session;

            req.flash('success', `Login efetivado com sucesso.`);
            res.redirect('/index');
        }
    }
};