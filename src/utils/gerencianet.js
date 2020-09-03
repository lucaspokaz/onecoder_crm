var Gerencianet = require('gn-api-sdk-node');
var credentials = require('../../config/configuration').gerencianet_credentials;

var clientId = credentials.client_id;
var clientSecret = credentials.client_secret;

var options = {
  client_id: clientId,
  client_secret: clientSecret,
  sandbox: false,
}

var body = {

  payment: {
    banking_billet: {
      expire_at: '2020-09-30',
      customer: {
        // name: 'Lucas Magalhães',
        // email: 'contato@onecoder.com.br',
        // cpf: '02735399141',
        phone_number: '62991043131',
        juridical_person: {
          corporate_name: 'LONA CONSTRUTORA LTDA',
          cnpj: '04650186000185'
        }
      }
    }
  },

  items: [{
    name: 'ELYSIUS ERP 2020',
    value: 35000,
    amount: 1,
  }],
}

var gerencianet = new Gerencianet(options);

gerencianet
  .oneStep([], body)
  .then(console.log)
  .catch(console.log)
  .done();