const clientesService = require('../services/cliente_service');
const clientesReponsaveisService = require('../services/cliente_responsavel_service');
const tarefasService = require('../services/tarefa_service');
const contratosService = require('../services/contrato_service');
const loginService = require('../services/login_service');
const config = require('../../config/configuration');
const mail = require('../utils/mail');
const { data_atual } = require('../utils/formatter');

exports.list = async (req, res, next) => {

	let results = await clientesService.get_clients();
	let dados = JSON.parse(results);

	res.render('clientes/index', {
		session: req.session,
		menu: 'lista_cliente',
		data: dados,
		moment: require('moment'),
		formatter: require('../utils/formatter')
	});
};

exports.list_registrados = async (req, res, next) => {

	let results = await clientesService.get_clients_registereds();
	let dados = JSON.parse(results);

	res.render('clientes/registrados', {
		session: req.session,
		menu: 'lista_cliente_registrados',
		data: dados,
		moment: require('moment'),
		formatter: require('../utils/formatter')
	});
};

exports.load = async (req, res, next) => {

	if ((req.params.id) && (req.params.id > 0)) {

		let cliente = await clientesService.get_client_by_id(req.params.id);
		let dados_cliente = JSON.parse(cliente);

		let geral = await tarefasService.get_tasks_overview_by_client(req.params.id);
		let dados_geral = JSON.parse(geral);

		let contratos = await contratosService.get_contracts_overview(req.params.id);
		let dados_geral_contratos = JSON.parse(contratos);

		let usuarios = await loginService.get_users();
		let dados_usuario = JSON.parse(usuarios);

		let responsaveis = await clientesService.get_client_owners(req.params.id);
		let dados_responsaveis = JSON.parse(responsaveis);

		res.render('clientes/editar', {
			session: req.session,
			menu: 'lista_cliente',
			data: dados_cliente[0],
			data_geral: dados_geral[0],
			data_contratos: dados_geral_contratos[0],
			data_responsaveis: dados_responsaveis,
			data_usuarios: dados_usuario,
			moment: require('moment'),
			formatter: require('../utils/formatter')
		})

	} else {

		res.render('clientes/criar', {
			session: req.session,
			menu: 'cria_cliente',
			data: [],
			moment: require('moment'),
			formatter: require('../utils/formatter')
		})

	}
};

exports.create = async (req, res, next) => {

	let cnpj_formatado = req.body.cnpj;
	cnpj_formatado = cnpj_formatado.split('.').join('');
	cnpj_formatado = cnpj_formatado.split('/').join('');
	cnpj_formatado = cnpj_formatado.split('-').join('');

	let fone1_formatado = req.body.fone1;
	fone1_formatado = fone1_formatado.split('.').join('');
	fone1_formatado = fone1_formatado.split('/').join('');
	fone1_formatado = fone1_formatado.split('-').join('');

	let fone2_formatado = req.body.fone2;
	fone2_formatado = fone2_formatado.split('.').join('');
	fone2_formatado = fone2_formatado.split('/').join('');
	fone2_formatado = fone2_formatado.split('-').join('');

	var cliente = {
		id_cliente: req.params.id,
		nome: req.body.nome,
		cnpj: cnpj_formatado,
		ativo: req.body.ativo,
		email: req.body.email,
		contato: req.body.contato,
		fantasia: req.body.fantasia,
		razao: req.body.razao,
		cep: req.body.cep,
		uf: req.body.uf,
		cidade: req.body.cidade,
		bairro: req.body.bairro,
		logradouro: req.body.logradouro,
		numero: req.body.numero,
		fone1: fone1_formatado,
		fone2: fone2_formatado,
		ibge: req.body.ibge,
		observacoes: '',
		complemento: req.body.complemento
	}

	let inserted = await clientesService.insert(cliente);

	if (inserted.status == 200) {

		req.flash('success', `Salvo com sucesso.`);
		res.redirect('/clientes/editar/' + inserted.insertedId);

	} else {

		req.flash('error', inserted.statusMessage);
		res.locals.message = req.flash();

		res.render('clientes/criar', {
			session: req.session,
			menu: 'cria_cliente',
			data: req.body,
			moment: require('moment'),
			formatter: require('../utils/formatter')
		})
	}
};

exports.edit = async (req, res, next) => {

	let edited = await clientesService.edit(req, res);

	if (edited.status == 200) {

		req.flash('success', `Salvo com sucesso.`);
		res.redirect('/clientes/editar/' + req.params.id);

	} else {

		req.flash('success', `Erro ao salvar.`);

		res.render('clientes/editar/' + req.params.id, {
			session: req.session,
			menu: 'lista_cliente',
			data: req.body,
			moment: require('moment'),
			formatter: require('../utils/formatter')
		})
	}
};

exports.insert_responsavel = async (req, res, next) => {

	let retorno = await clientesReponsaveisService.insert(req, res);

	if (retorno.status == 200) {
		return res.status(200).send(retorno);
	} else {
		return res.status(400).send(retorno);
	}
};

exports.delete_responsavel = async (req, res, next) => {

	let retorno = await clientesReponsaveisService.delete(req.body.id_cliente_responsavel);

	if (retorno.status == 200) {
		return res.status(200).send(retorno);
	} else {
		return res.status(400).send(retorno);
	}
};

exports.get_by_cnpj = async (req, res, next) => {

	console.log(req.body)
	const { cnpj, chave } = req.body;

	if (chave == config.conexao.password) {
		if (cnpj) {

			let retorno = await clientesService.get_client_by_cnpj(cnpj);
			return res.status(200).send(retorno);
		} else {
			return res.status(400).send('Erro na consulta');
		}
	} else {
		return res.status(401).send('Erro na consulta');
	}

};

exports.register = async (req, res, next) => {

	try {
		let cnpj_formatado = req.body.cnpj;
		cnpj_formatado = cnpj_formatado.split('.').join('');
		cnpj_formatado = cnpj_formatado.split('/').join('');
		cnpj_formatado = cnpj_formatado.split('-').join('');

		let fone1_formatado = req.body.fone1;
		fone1_formatado = fone1_formatado.split('.').join('');
		fone1_formatado = fone1_formatado.split('/').join('');
		fone1_formatado = fone1_formatado.split('-').join('');

		let fone2_formatado = req.body.fone2;
		fone2_formatado = fone2_formatado.split('.').join('');
		fone2_formatado = fone2_formatado.split('/').join('');
		fone2_formatado = fone2_formatado.split('-').join('');

		var cliente = {
			nome: req.body.nome,
			cnpj: cnpj_formatado,
			ativo: 3,
			email: req.body.email,
			contato: req.body.contato,
			fantasia: req.body.fantasia,
			razao: req.body.razao,
			cep: req.body.cep,
			uf: req.body.uf,
			cidade: req.body.cidade,
			bairro: req.body.bairro,
			logradouro: req.body.logradouro,
			numero: req.body.numero,
			complemento: req.body.complemento,
			fone1: fone1_formatado,
			fone2: fone2_formatado,
			ibge: req.body.ibge,
			observacoes: 'Criado pela aplicação de registro.',
			dt_registro: await data_atual()
		}

		let retorno = await clientesService.insert(cliente);

		let emails = await loginService.get_emails_notificacao(3, 2); // Lucas / Desenvolvimento
		dados_email = JSON.parse(emails);

		let texto_email =
				'<p>Olá, temos um novo cliente registrado.</p>' +
				'<p>Cliente: <strong>' + cliente.nome + '</strong> </p>' +
				'</br></br>' +
				'<p>Cliente registrado pela plataforma de registro.' + ' </p>' +
				'</br></br>' +
				'<p>Atenciosamente,</p>' +
				'<p>Equipe Onecoder</p>' +
				'</br>' +
				'-' +
				'<p>Esse é um e-mail automático. Por favor, não responda.</p>';

		for (let item in dados_email) {
				mail.send(
						dados_email[item].email,
						'[CRM] Novo cliente: ' + cliente.nome,
						texto_email
				);
		}

		res.status(200).send(retorno);

	} catch (error) {
		console.log(error)
		res.status(500).send('Erro ao inserir os dados.');
	}
};