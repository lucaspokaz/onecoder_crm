const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

module.exports = {
  dest: path.resolve(__dirname, '..', 'uploads'),
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, path.resolve(__dirname, '..', 'uploads'));
    },
    filename: (req, file, callback) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) callback(err);

        const fileName = `${hash.toString('hex')}-${file.originalname}`;
        callback(null, fileName);
      })
    },
  }),
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter: (req, file, callback) => {
    if ((path.extname(file.originalname) !== '.exe') && (path.extname(file.originalname) !== '.dll')) {
      return cb(new Error('Somente .exe ou .dll são permitidos.'))
    }
    callback(null, true);
  }
};