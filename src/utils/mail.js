var nodemailer = require('nodemailer');

var remetente = nodemailer.createTransport({
    host: 'mail.onecoder.com.br',
    port: 587,
    secure: false,
    auth:{
        user: 'crm@onecoder.com.br',
        pass: 'i3Mrqs(y@6~,'
    }
});

exports.send = (para, assunto, texto) => {

    let conteudo = {
        from: 'Onecoder CRM <crm@onecoder.com.br>',
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
