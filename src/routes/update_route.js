const express = require('express');
const router = express.Router();
const controller = require('../controllers/update_controller');
let   fileupload = require('express-fileupload');

// views
router.get('/elysius', controller.get_versions_elysius);
router.get('/elysius/deploy', controller.load);

// json
router.get('/elysius/arquivos/json', controller.get_files_versions_elysius);
router.get('/elysius/especiais/json', controller.get_files_especials_elysius);

// post
router.post('/', controller.create_replace);
router.post('/elysius/arquivos', controller.upload);

module.exports = router;