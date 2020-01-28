const service = require('../../services/loginService');

exports.findByLogin = (req, res, next) => {
    let login = req.params.login;
    let senha = req.params.senha;
    let results = await service.getUsuarioAutenticado(login, senha);
    if (results.size > 0) {
        res.status(200).send(`Login efetivado com sucesso.`);
    } else {
        res.status(400).send(`Usuário não encontrado.`);
    }    
};