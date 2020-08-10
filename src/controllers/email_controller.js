const clientesService = require('../services/cliente_service');
const clientesReponsaveisService = require('../services/cliente_responsavel_service');
const tarefasService = require('../services/tarefa_service');
const contratosService = require('../services/contrato_service');
const loginService = require('../services/login_service');

exports.enviar = async (req, res, next) => {

  let mailOptions = {
    from: 'Onecoder Tecnologia <contato@onecoder.com.br>',
    to: para,
    subject: assunto,
    html: texto,
  }

  let retorno = await clientesReponsaveisService.delete(req.body.id_cliente_responsavel);

  if (retorno.status == 200) {
    return res.status(200).send(retorno);
  } else {
    return res.status(400).send(retorno);
  }
};