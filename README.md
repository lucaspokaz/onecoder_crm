# Onecoder CRM

![licence mit](https://img.shields.io/badge/license-MIT-yellow)

> :rocket: Sistema para controle de informações de clientes, contratos, projetos, fluxo de demandas e tarefas, etc.

## Recursos utilizados no desenvolvimento:
- NodeJs;
- Express;
- EJS;
- Mysql;
- JSON;
- PostMan;
- Nodemon;

## License
© [Onecoder](https://onecoder.com.br/) - [Lucas Magalhães](https://github.com/lucaspokaz/)

# Onecoder CRM

A intenção deste sistema é controlar as informações básicas de clientes, contratos, report de bugs, melhorias de sistemas, etc.

## Recursos utilizados no desenvolvimento:

- NodeJs;
- Express ~ v.4.17.1;
- EJS;
- Mysql;
- JSON;
- PostMan;
- Nodemon;

## Imagens do Sistema

> ![dashboard](https://github.com/lucaspokaz/onecoder_crm/blob/master/images/dashboard.png)
> ![clientes](https://github.com/lucaspokaz/onecoder_crm/blob/master/images/clientes.png)
> ![quadro_tarefas](https://github.com/lucaspokaz/onecoder_crm/blob/master/images/quadro_tarefas.png)

## Instruções

Antes de instalar as dependências no projeto, você precisa já ter instalado na sua máquina:

* **NodeJs**: Caso não tenha, basta realizar o download [Aqui](https://nodejs.org/en/)
* **Mysql**: Caso também não tenha, basta realizar o download [Aqui](https://www.mysql.com/downloads/)

Para começar, você deve simplesmente clonar o repositório do projeto na sua máquina e instalar as dependências.

Abra o PowerShell (utilizando o Windows), ou o Terminal (utilizando MacOS ou Linux) e digite a path do seu projeto

```
cd "C:\Users\NomeDoComputador\Documents\..."
```

Depois, quando estiver na pasta do projeto, basta digitar no cmd a seguinte instrução:

```
npm install
```

Ao digitar a instrução acima, automaticamente ele irá baixar todas as dependências listadas no arquivo package.json:

* `node_modules` - que contêm os packages do npm que precisará para o projeto.

Instale, de maneira global o Nodemon:

```
npm install nodemon -g
```

Bom, agora na mesma tela do Terminal, basta iniciar o server para o projeto ser executado localmente.

```
nodemon start
```

Agora, abre a página da aplicação em `http://localhost:{porta_server}`. E pronto a aplicação será executada de maneira local na sua máquina.

Fiquem à vontade em usar ou ajudar no desenvolvimento!! :)
