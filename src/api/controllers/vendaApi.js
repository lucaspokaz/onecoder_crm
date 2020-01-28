const service = require('../../services/vendasService');

exports.listAll = async (req, res, next) => {
    let results = await service.getVendas();
    res.status(200).send(JSON.stringify(results));
};

exports.findById = (req, res, next) => {
    let id = req.params.id;
    res.status(200).send(`Requisição recebida com sucesso! ${id} EDIT`);
};

exports.post = (req, res, next) => {
    res.status(201).send('Requisição recebida com sucesso! POST');
};

exports.put = (req, res, next) => {
    let id = req.params.id;
    res.status(201).send(`Requisição recebida com sucesso! ${id} EDIT`);
};

exports.delete = (req, res, next) => {
    let id = req.params.id;
    res.status(200).send(`Requisição recebida com sucesso! ${id} DELETE`);
};