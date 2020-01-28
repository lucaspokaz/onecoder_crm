const express = require('express');
const router = express.Router();
const auth = require('../../config/auth');

router.get('/', auth.loggedIn, function (req, res, next) {
    res.render('index', {
        menu: '',
        session: req.session
    });
});

module.exports = router;