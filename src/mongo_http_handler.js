const {compareHash, getHash} = require('./common_functions');
const session = require('express-session');
const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => res.start('index.html'));

class http_handler{
	constructor(options = {}){
		this.options = Object.assign({
			port: 3000,
			host: 'localhost',
			secret: 'silly secret'
		}, options);
		app.use(session({
			secret: this.options.secret,
			resave: false,
			saveUninitialized: true,
			cookie: { secure: false }
		}));
		app.get('/isAdminNew', (req, res) => {		
			this.db.collection('users').countDocuments({isAdmin:true}, (err, result) => {
				if(err) throw err;
				res.json(result);
			}); 
		});
		app.get('/workstation', (req, res) => {
			if (!req.session.user) res.redirect('/');
			else res.sendFile(__dirname + '/workstation.html');
		});
		app.post('/checkAdmin', (req, res) => this.checkCredential('admin', req.body.user, req.body.pass, res, req));
		app.post('/firstAdmin', (req, res) => this.registerCredential('admin', req.body.user, req.body.pass, res));
		app.post('/postUser', (req, res) => this.registerCredential('user', req.body.user, req.body.pass, res));

		app.use((req, res) => {
			console.log(req.url);
			res.status(404).send("Sorry can't find that!");
		});
		app.use((err, req, res, next) => {
			console.error(err.stack);
			res.status(500).send('Something broke, hurry GO BACK!');
		});
	}

	registerCredential(type, user, pass, res){
		getHash(pass, hash => {
			this.db.collection('users').insertOne({name:user, pass:hash, isAdmin:(type === 'admin')}, (err, result) => {
				if(err) res.json(false);
				res.json(true); 
			});
		});
	}
	checkCredential(type, user, pass, res, req){
		this.db.collection('users').findOne({name:user, isAdmin:true}, (err, result) => {
			if(err) throw err;
			if(result) compareHash(result.pass, pass, (isCorrect) => {
				if(isCorrect && (req.session.user = user)) res.redirect('/workstation');
				else res.json(false);
			});
			else res.json(false);
		});
	}

	start(mongoHandler){
		this.db = mongoHandler;
		app.listen(this.options.port, this.options.host, () => console.log(`Go to admin GUI at: http://${this.options.host}:${this.options.port}`));
	}
}

module.exports = http_handler;