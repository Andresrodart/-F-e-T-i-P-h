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
	constructor(mongoHandler, options = {}){
		this.options = Object.assign({
			port: 3000,
			host: 'localhost',
			secret: 'silly secret'
		}, options);
		this.db = mongoHandler;
		this.credentials = {};
		
		app.use(session({
			secret: this.options.secret,
			resave: false,
			saveUninitialized: true,
			cookie: { secure: false }
		}));
		app.get('/isAdminNew', (req, res) => {		
			if(this.db) this.db.collection('users').countDocuments({isAdmin:true}, (err, result) => {
				if(err) throw err;
				res.json(result);
			});
			else res.json(Object.keys(this.credentials.admins).length); 
		});
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
		if(!this.db) fs.readFile('./local/credentials.json', (err, data) => {
				if (err) console.log(err);
				this.credentials = JSON.parse(data);
		});
	}
	registerCredential(type, user, pass, res){
		if(this.db) bcrypt.hash(pass, 10, (err, hash) => {
			if (err) throw err;
			this.db.collection('users').insertOne({name:user, pass:hash, isAdmin:(type === 'admin')}, (err, result) => {
				if(err) res.json(false);
				res.json(true); 
			});
		}); 
		else{
			bcrypt.hash(pass, 10, (err, hash) => {
				if (err) throw err;
				if(type === 'admin') this.credentials.admins[user] = { "user": user, "pass": hash};
				else this.credentials.users[user] = { "user": user, "pass": hash};
				fs.writeFile('./local/credentials.json', JSON.stringify(this.credentials, null, 4), err => {
					if(err) res.json(false);
					res.json(true);
				});
			});
		}
	}
	checkCredential(type, user, pass, res, req){
		if(this.db) this.db.collection('users').findOne({name:user, isAdmin:true}, (err, result) => {
			if(err) throw err;
			if(result) this.compareHash(result.pass, pass, (isCorrect) => {
				if(isCorrect && (req.session.user = user)) res.redirect('/workstation');
				else res.json(false);
			});
		});
		else if(type === 'admin' && this.credentials.admins[user])
			this.compareHash(this.credentials.admins[user].pass, pass, (isCorrect) => {
				if(isCorrect && (req.session.user = user)) res.redirect('/workstation');
				else res.json(false);
		});
	}
	compareHash(hash, pass, callback){
		bcrypt.compare(pass, hash, (err, isCorrect) => {
			if (err) throw err;
			callback(isCorrect);
		});
	}
	start(){
		app.listen(this.options.port, this.options.host, () => console.log(`Go to admin GUI at: http://${this.options.host}:${this.options.port}`));
		if(!this.db) this.initCredentials();
	}
}

module.exports = http_handler;