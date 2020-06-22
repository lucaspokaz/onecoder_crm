const express = require('express');
const router = express.Router();
const auth = require('../../config/auth');
const controller = require('../controllers/tarefa_controller');
const multer = require('multer');
const multerConfig = require('../../config/multer')

router.post('/tarefa/(:id)', multer(multerConfig).single('file'), controller.anexar);
router.delete('/(:key)', controller.remover_anexo);
router.get('/tarefa/(:id)', controller.list_anexos);
router.get('/(:key)', controller.get_by_key);

module.exports = router;