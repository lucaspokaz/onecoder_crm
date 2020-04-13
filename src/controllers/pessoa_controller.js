exports.listAll = (req, res, next) => {
    res.status(200).send('Requisição recebida com sucesso! LIST');
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