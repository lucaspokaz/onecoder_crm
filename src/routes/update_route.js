const express = require('express');
const router = express.Router();
const controller = require('../controllers/update_controller');
const auth = require('../../config/auth');

// views
router.get('/elysius', controller.get_versions_elysius);
router.get('/elysius/deploy', controller.load);

router.get('/siembra', controller.get_versions_siembra);
router.get('/siembra/deploy', controller.load_siembra);

// json
router.get('/elysius/arquivos/json', controller.get_files_versions_elysius);
router.get('/elysius/especiais/json', controller.get_files_especials_elysius);

router.get('/siembra/arquivos/json', controller.get_files_versions_siembra);
router.get('/siembra/especiais/json', controller.get_files_especials_siembra);

// post
router.post('/elysius', controller.create_replace);
router.post('/elysius/historico', auth.isValid, controller.create_history);
router.post('/elysius/arquivos', controller.upload);

router.post('/siembra', controller.create_replace);
router.post('/siembra/historico', auth.isValid, controller.create_history);
router.post('/siembra/arquivos', controller.upload);

module.exports = router;