var nodemailer = require('nodemailer');
var remetente = require('../../config/configuration').remetente;

exports.send = (para, assunto, texto) => {

    let conteudo = {
        from: 'Onecoder CRM <crm@onecoderti.com.br>',
        to: para,
        subject: assunto,
        text: texto,
    }

    remetente.sendMail(conteudo, function(error){
        if (error) {
            console.log('Conteudo: ' + conteudo);
            console.log(error);
        } else {
            console.log('Email enviado com sucesso.');
        }
    });

};
