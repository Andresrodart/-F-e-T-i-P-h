const session = require('express-session');
const express = require('express');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');
const app = express();


app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => res.start('index.html'));
app.get('/workstation', (req, res) => res.sendFile('workstation.html'));

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
		
		app.get('/isAdminNew', (req, res) => res.json(Object.keys(this.credentials.admins).length));
		app.post('/firstAdmin', (req, res) => this.registerCredential('admin', req.body.user, req.body.pass, res));
		app.post('/checkAdmin', (req, res) => this.checkCredential('admin', req.body.user, req.body.pass, res));

		app.use(session({
			secret: this.options.secret,
			resave: false,
			saveUninitialized: true,
			cookie: { secure: true }
		}));
		app.use((req, res, next) => {
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
				console.log(this.credentials);
				fs.writeFile('./local/credentials.json', JSON.stringify(this.credentials, null, 4), err => {
					if(err) res.json(fasle);
					res.json(true);
				});
			});
		}
	}
	checkCredential(type, user, pass, res){
		if(this.db) /*to Do */;
		else{
			let hash = '';
			if(type === 'admin') hash = this.credentials.admins[user].pass;
			bcrypt.compare(pass, hash, (err, result) => {
				if (err) throw err;
				req.session.userId = user._id;
				req.session.mail = user.email;
				return res.redirect('/home');
			});
		}
	}
	start(){
		app.listen(this.options.port, this.options.host, () => console.log(`Go to admin GUI at: http://${this.options.host}:${this.options.port}`));
	}
}

module.exports = http_handler;