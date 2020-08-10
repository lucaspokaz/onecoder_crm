var config = require('./configuration');

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

function isValid(req, res, next) {
	const { chave } = req.body;
	if (chave == config.conexao.password) {
		console.log('ok, validado!')
		next();
	} else {
		console.log('ops! não está válido')
		return res.status(401).send('Sem permissão!');
	}
}

module.exports = {
	loggedIn,
	isValid
}