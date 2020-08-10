const service = require('../services/serial_service');
const config = require('../../config/configuration');

exports.list_by_cnpj = async (req, res, next) => {

  const { cnpj, ano, chave } = req.body;

  if (chave == config.conexao.password) {
    if ((cnpj) && (ano)) {
      let retorno = await service.get_all_by_cnpj(cnpj, ano);
      return res.status(200).send(retorno);
    } else {
      return res.status(400).send('Erro na consulta');
    }
  } else {
    return res.status(401).send('Erro na consulta');
  }

};