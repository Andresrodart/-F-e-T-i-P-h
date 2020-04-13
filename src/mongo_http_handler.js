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
		app.post('/checkAdmin', (req, res) => this.checkCredential(req.body.user, req.body.pass, res, req));
		app.post('/firstAdmin', (req, res) => {
			this.db.collection('users').findOne({isAdmin:true}).
			then(result => {
				if(result) res.redirect('/');
				else this.registerCredential('admin', req, res); 
			}).catch(err => {throw err;});
		});
		app.post('/postUser', (req, res) => {
			if(req.session.user) this.registerCredential('user', req, res);
			else res.redirect('/');
		});

		app.use((req, res) => {
			res.status(404).send("Sorry can't find that!");
		});
		app.use((err, req, res, next) => {
			console.error(err.stack);
			res.status(500).send('Something broke, hurry GO BACK!');
		});
	}

	registerCredential(type, req, res){
		this.db.collection('users').findOne({name:req.body.user})
		.then(result => {
			if(result) res.json(false);
			else getHash(req.body.pass, hash => {
				this.db.collection('users').insertOne({
					name:req.body.user, 
					pass:hash, 
					isAdmin:(type === 'admin'), 
					room:(req.body.room)? req.body.room:null
				})
				.then(result => res.json(result)) 
				.catch(err => {throw err;});	
			});
		})
		.catch(err => {throw err;});
	}

	checkCredential(user, pass, res, req){
		this.db.collection('users').findOne({name:user, isAdmin:true}, (err, result) => {
			if(err) throw err;
			if(result) compareHash(result.pass, pass, (isCorrect) => {
				if(isCorrect && (req.session.user = user)){
					this.db.collection('access_log').insertOne({
						date: new Date(Date.now()), //.toISOString()
						user: user,
						ip: req.ip,
						type: req.protocol.toUpperCase() 
					}).then(result => res.redirect('/workstation'));
				} 	
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