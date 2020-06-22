const nodemailer = require('nodemailer');
const { json } = require('body-parser');
var remetente = require('../../config/configuration').remetente;

exports.send = (para, assunto, texto) => {

    let mailOptions = {
        from: 'Onecoder CRM <crm@onecoderti.com.br>',
        to: para,
        subject: assunto,
        html: texto,
    }

    console.log('Dados de envio: ' + JSON.stringify(mailOptions));

    remetente.sendMail(mailOptions, function(error){
        if (error) {
            console.log(error);
        } else {
            console.log('Email enviado com sucesso.');
        }
    });

};
