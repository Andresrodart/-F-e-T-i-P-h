const session = require('express-session');
const express = require('express');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');
const app = express();


app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => res.start('index.html'));

class http_handler{
	constructor(mongoHandler = null, options = {}){
		this.options = Object.assign({
			port: 3000,
			host: 'localhost',
			secret: 'silly secret'
		}, options);
		this.db = mongoHandler;
		this.credentials = {};

		this.initCredentials();

		app.use(session({
			secret: this.options.secret,
			resave: false,
			saveUninitialized: true,
			cookie: { secure: false }
		}));

		app.get('/isAdminNew', (req, res) => res.json(Object.keys(this.credentials.admins).length));
		app.get('/workstation', (req, res) => {
			if (!req.session.user) res.redirect('/');
			else res.sendFile(__dirname + '/workstation.html');
		});
		app.post('/checkAdmin', (req, res) => this.checkCredential('admin', req.body.user, req.body.pass, res, req));
		app.post('/firstAdmin', (req, res) => this.registerCredential('admin', req.body.user, req.body.pass, res));

		app.use((req, res) => {
			console.log(req.url);
			res.status(404).send("Sorry can't find that!");
		});
		app.use((err, req, res, next) => {
			console.error(err.stack);
			res.status(500).send('Something broke, hurry GO BACK!');
		});
	}

	initCredentials(){
		if(this.db) /*to Do */;
		else fs.readFile('./local/credentials.json', (err, data) => {
				if (err) console.log(err);
				this.credentials = JSON.parse(data);
		});
	}
	registerCredential(type, user, pass, res){
		if(this.db) /*to Do */;
		else{
			bcrypt.hash(pass, 10, (err, hash) => {
				if (err) throw err;
				let data = { "user": user, "pass": hash};
				if(type === 'admin') this.credentials.admins[user] = data;
				fs.writeFile('./local/credentials.json', JSON.stringify(this.credentials, null, 4), err => {
					if(err) res.json(false);
					res.json(true);
				});
			});
		}
	}
	checkCredential(type, user, pass, res, req){
		if(this.db) /*to Do */;
		else{
			let hash = '';
			if(type === 'admin' && this.credentials.admins[user])
			hash = this.credentials.admins[user].pass;
			bcrypt.compare(pass, hash, (err, result) => {
				if (err) throw err;
				if(result && (req.session.user = user))
					return res.redirect('/workstation');
				else return res.json(false);
			});
		}
	}
	start(){
		app.listen(this.options.port, this.options.host, () => console.log(`Go to admin GUI at: http://${this.options.host}:${this.options.port}`));
	}
}

module.exports = http_handler;