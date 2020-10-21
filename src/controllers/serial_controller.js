const service = require('../services/serial_service');
const clienteService = require('../services/cliente_service');
const config = require('../../config/configuration');
const { conteudo_sistema } = require('../utils/sistema');

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

exports.create_edit = async (req, res, next) => {

  const data = req.body;

  let retorno = null;

  const cliente = await clienteService.get_id(data.id_cliente);
  data.cnpj = cliente[0].cnpj;
  data.fantasia = cliente[0].fantasia;
  data.uf = cliente[0].uf;
  data.cidade = cliente[0].cidade;
  data.conteudo = conteudo_sistema(data);

  for (let index = parseInt(data.mes_inicial); index <= parseInt(data.mes_final); index++) {
    retorno = await service.delete(data.id_cliente, data.ano, index);
  }

  for (let index = parseInt(data.mes_inicial); index <= parseInt(data.mes_final); index++) {
    console.log('indice', data);
    data.mes = index;
    retorno = await service.insert(data);
  }

  if (retorno.status == 200) {
    return res.status(200).send(retorno);
  } else {
    return res.status(400).send(retorno);
  }

};
