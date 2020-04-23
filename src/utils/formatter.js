const leftPad = require('left-pad');
const moment = require('moment');

/* Função que coloca zeros à esqueda */
exports.zero_esquerda = (str, size) => {
    return leftPad(str, size, 0);
}

/* Função que formata CPF */
exports.format_cpf = (v) => {
    if (v == null) {
        return '';
    } else {
        return v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g,"\$1.\$2.\$3\-\$4");
    }
}

/* Função que formata CNPJ */
exports.format_cnpj = (v) => {
    if (v == null) {
        return '';
    } else {
        return v.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g,"\$1.\$2.\$3\/\$4\-\$5")
    }
}

/*Função que padroniza telefone (11) 4184-1241*/
exports.format_fone = (v) => {
    if (v == null) {
        return '';
    } else {
        switch (v.length) {
            case 11: v = '(' + v.substring(0, 2) + ') ' + v.substring(2, 7) + '-' + v.substring(7, 11);
                break;
            case 10: v = '(' + v.substring(0, 2) + ') ' + v.substring(2, 6) + '-' + v.substring(6, 10);
                break;
            case 8: v = '(XX) ' + v.substring(0, 4) + '-' + v.substring(4, 8);
                break;
            default:
                break;
        }
        return v;
    }
}

/*Função que padroniza CEP*/
exports.format_cep = (v) => {
    if (v != null) {
        v = v.replace(/D/g,"")
        v = v.replace(/^(\d{5})(\d)/,"$1-$2")
    } else {
        v = ''
    }
    return v
}

/*Função que padroniza DATA*/
exports.format_data = (v) => {
    v = v.toString().replace(/\D/g,"")
    v = v.toString().replace(/(\d{2})(\d)/,"$1/$2")
    v = v.toString().replace(/(\d{2})(\d)/,"$1/$2")
    return v
}

/*Função que padroniza DATA*/
exports.format_hora = (v) => {
    v = v.replace(/\D/g,"")
    v = v.replace(/(\d{2})(\d)/,"$1:$2")
    return v
}

/*Função que padroniza valor monétario*/
exports.format_money = (v) => {
    return 'R$ ' + (+v).toFixed(2).replace('.', ',')
}

/*Função que randomiza a cor a partir de uma string*/
exports.stringToHslColor = (str, s, l) => {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    var h = hash % 360;
    return 'hsl('+h+', '+s+'%, '+l+'%)';
}

exports.exibirDataNull = (data) => {
    if (data != null && data != "") {
        v = moment(data).format('DD/MM/YYYY')
    } else {
        v = ""
    }
    return v;
}

exports.validarDataNull = (data) => {
    if (data != null && data != "") {
        v = moment(data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss');
    } else {
        v = null
    }
    return v;
}