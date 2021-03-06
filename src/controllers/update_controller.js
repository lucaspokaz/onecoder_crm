const updatesService = require('../services/update_service');
const moment = require('moment-timezone');
const utils = require('../utils/formatter');

exports.get_versions_elysius = async (req, res, next) => {

	let retorno = await updatesService.get_versions('elysius');
	let dados = await JSON.parse(retorno);

	res.render('updates/elysius', {
		data: dados,
		moment: require('moment')
	});

};

exports.get_versions_siembra = async (req, res, next) => {

	let retorno = await updatesService.get_versions('siembra');
	let dados = await JSON.parse(retorno);

	res.render('updates/siembra', {
		data: dados,
		moment: require('moment')
	});

};

exports.get_versions_nfacil = async (req, res, next) => {

	let retorno = await updatesService.get_versions('nfacil');
	let dados = await JSON.parse(retorno);

	res.render('updates/nfacil', {
		data: dados,
		moment: require('moment')
	});

};

exports.load = async (req, res, next) => {

	// await new Promise(r => setTimeout(r, 2000));
	let retorno = await updatesService.get_update_files('elysius');
	dados = await JSON.parse(retorno);

	res.render('updates/elysius_deploy', {
		session: req.session,
		menu: 'lista_updates_elysius',
		formatter: require('../utils/formatter'),
		data: dados,
		moment: require('moment')
	});

};

exports.load_siembra = async (req, res, next) => {

	// await new Promise(r => setTimeout(r, 2000));
	let retorno = await updatesService.get_update_files('siembra');
	dados = await JSON.parse(retorno);

	res.render('updates/siembra_deploy', {
		session: req.session,
		menu: 'lista_updates_siembra',
		formatter: require('../utils/formatter'),
		data: dados,
		moment: require('moment')
	});

};

exports.load_nfacil = async (req, res, next) => {

	// await new Promise(r => setTimeout(r, 2000));
	let retorno = await updatesService.get_update_files('nfacil');
	dados = await JSON.parse(retorno);

	res.render('updates/nfacil_deploy', {
		session: req.session,
		menu: 'lista_updates_nfacil',
		formatter: require('../utils/formatter'),
		data: dados,
		moment: require('moment')
	});

};

exports.get_files_versions_elysius = async (req, res, next) => {
	let retorno = await updatesService.get_update_files('elysius');
	let dados = await JSON.parse(retorno);
	console.log(utils.data_atual());
	try {
		res.status(200).send(dados)
	} catch (error) {
		res.status(500).send('Erro ao consultar os dados.')
	}
};

exports.get_files_versions_siembra = async (req, res, next) => {
	let retorno = await updatesService.get_update_files('siembra');
	let dados = await JSON.parse(retorno);
	console.log(utils.data_atual());
	try {
		res.status(200).send(dados)
	} catch (error) {
		res.status(500).send('Erro ao consultar os dados.')
	}
};

exports.get_files_versions_nfacil = async (req, res, next) => {
	let retorno = await updatesService.get_update_files('nfacil');
	let dados = await JSON.parse(retorno);
	console.log(utils.data_atual());
	try {
		res.status(200).send(dados)
	} catch (error) {
		res.status(500).send('Erro ao consultar os dados.')
	}
};

exports.get_files_especials_elysius = async (req, res, next) => {
	let retorno = await updatesService.get_update_files_especials('elysius');
	let dados = await JSON.parse(retorno);
	try {
		res.status(200).send(dados)
	} catch (error) {
		res.status(500).send('Erro ao consultar os dados.')
	}
};

exports.get_files_especials_siembra = async (req, res, next) => {
	let retorno = await updatesService.get_update_files_especials('siembra');
	let dados = await JSON.parse(retorno);
	try {
		res.status(200).send(dados)
	} catch (error) {
		res.status(500).send('Erro ao consultar os dados.')
	}
};

exports.get_files_especials_nfacil = async (req, res, next) => {
	let retorno = await updatesService.get_update_files_especials('nfacil');
	let dados = await JSON.parse(retorno);
	try {
		res.status(200).send(dados)
	} catch (error) {
		res.status(500).send('Erro ao consultar os dados.')
	}
};

exports.create_replace = async (req, res, next) => {

	try {
		let retorno = await updatesService.insert_update_file(
			req.body.sistema,
			req.body.nome,
			req.body.versao
		);

		res.status(200).send(retorno);
	} catch (error) {
		res.status(500).send('Erro ao inserir os dados.')
	}

};

exports.create_history = async (req, res, next) => {

	try {
		let retorno = await updatesService.insert_history(
			req.body.ip,
			req.body.computador,
			req.body.arquivo,
			req.body.sistema,
			req.body.cnpj,
		);

		res.status(200).send(retorno);
	} catch (error) {
		res.status(500).send('Erro ao inserir os dados.')
	}

};

exports.upload_elysius = async (req, res) => {

	try {

		if (!req.files) {
			res.send({ status: false, message: 'Erro ao atualizar' });
		} else {

			//Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
			let file = req.files.file;
			let dest_file = '../../public_html/downloads/elysius/' + file.name;

			//Use the mv() method to place the file in upload directory (i.e. "uploads")
			await file.mv(dest_file);

			//send response
			res.send({
				status: true, message: 'Atualizado com sucesso',
				data: { name: file.name, mimetype: file.mimetype, size: file.size }
			});
		}
	} catch (err) {
		res.status(500).send(err);
	}

};

exports.upload_siembra = async (req, res) => {

	try {

		if (!req.files) {
			res.send({ status: false, message: 'Erro ao atualizar' });
		} else {

			//Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
			let file = req.files.file;
			let dest_file = '../../public_html/downloads/siembra/' + file.name;

			//Use the mv() method to place the file in upload directory (i.e. "uploads")
			await file.mv(dest_file);

			//send response
			res.send({
				status: true, message: 'Atualizado com sucesso',
				data: { name: file.name, mimetype: file.mimetype, size: file.size }
			});
		}
	} catch (err) {
		res.status(500).send(err);
	}

};

exports.upload_nfacil = async (req, res) => {

	try {

		if (!req.files) {
			res.send({ status: false, message: 'Erro ao atualizar' });
		} else {

			//Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
			let file = req.files.file;
			let dest_file = '../../public_html/downloads/nfacil/' + file.name;

			//Use the mv() method to place the file in upload directory (i.e. "uploads")
			await file.mv(dest_file);

			//send response
			res.send({
				status: true, message: 'Atualizado com sucesso',
				data: { name: file.name, mimetype: file.mimetype, size: file.size }
			});
		}
	} catch (err) {
		res.status(500).send(err);
	}

};