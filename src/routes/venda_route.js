const express = require('express');
const router = express.Router();
const controller = require('../controllers/vendaController')
const auth = require('../../config/auth');

router.get('/', auth.loggedIn, controller.listAll);
router.get('/:id', auth.loggedIn, controller.findById);
router.post('/', auth.loggedIn, controller.post);
router.put('/:id', auth.loggedIn, controller.put);
router.delete('/:id', auth.loggedIn, controller.delete);

module.exports = router;