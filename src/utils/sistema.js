const crypto = require('crypto');
const ENC_KEY = 'bf3c199c2470cb477d907b1e0917c17b'; // set random encryption key
const IV = '5183666c72eec9e4'; // set random initialisation vector

exports.conteudo_sistema = (checkboxes) => {
  let resposta = '';

  // Elysius Básico
  // Elysius Gestor Mobile
  // Elysius Food
  // Elysius Reports
  // Elysius OS
  // Elysius Backup
  // Elysius NFC-e
  // Elysius NF-e

  if (checkboxes.elysius_basico === 'true') {
    resposta = resposta + 'A'
  }
  if (checkboxes.elysius_gestor_mobile === 'true') {
    resposta = resposta + 'B'
  }
  if (checkboxes.elysius_food === 'true') {
    resposta = resposta + 'C'
  }
  if (checkboxes.elysius_reports === 'true') {
    resposta = resposta + 'D'
  }
  if (checkboxes.elysius_os === 'true') {
    resposta = resposta + 'E'
  }
  if (checkboxes.elysius_backup === 'true') {
    resposta = resposta + 'F'
  }
  if (checkboxes.elysius_nfce === 'true') {
    resposta = resposta + 'G'
  }
  if (checkboxes.elysius_nfe === 'true') {
    resposta = resposta + 'H'
  }

  // NFácil NFC-e
  // NFácil NF-e
  // NFácil Reports
  // NFácil Backup

  if (checkboxes.nfacil_nfce === 'true') {
    resposta = resposta + 'I'
  }
  if (checkboxes.nfacil_nfe === 'true') {
    resposta = resposta + 'J'
  }
  if (checkboxes.nfacil_reports === 'true') {
    resposta = resposta + 'K'
  }
  if (checkboxes.nfacil_backup === 'true') {
    resposta = resposta + 'L'
  }

  return resposta
}

exports.encrypt = ((val) => {
  let cipher = crypto.createCipheriv('aes-256-cbc', ENC_KEY, IV);
  let encrypted = cipher.update(val, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
});

exports.decrypt = ((encrypted) => {
  let decipher = crypto.createDecipheriv('aes-256-cbc', ENC_KEY, IV);
  let decrypted = decipher.update(encrypted, 'base64', 'utf8');
  return (decrypted + decipher.final('utf8'));
});