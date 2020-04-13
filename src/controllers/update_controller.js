const updatesService = require('../services/update_service');

exports.get_versions = async (req, res, next) => {

    let results = await updatesService.get_versions();
    dados = JSON.parse(results);

    res.render('updates/elysius', {
        data: dados,
        moment: require('moment')
    });

};