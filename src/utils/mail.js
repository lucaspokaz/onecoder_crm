var nodemailer = require('nodemailer');

var remetente = nodemailer.createTransport({
    host: 'mail.onecoderti.com.br',
    port: 587,
    secure: false,
    auth:{
        user: 'crm@onecoderti.com.br',
        pass: 'AK,O3Y%Z4*Tg'
    }
});

exports.send = (para, assunto, texto) => {

    let conteudo = {
        from: 'Onecoder CRM <crm@onecoderti.com.br>',
        to: para,
        subject: assunto,
        text: texto,
    }

    remetente.sendMail(conteudo, function(error){
        if (error) {
            console.log(error);
        } else {
            console.log('Email enviado com sucesso.');
        }
    });

};
