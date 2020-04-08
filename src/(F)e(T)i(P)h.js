const EventEmitter = require('events');
const FTPapi = require('ftp-srv');
const bcrypt = require('bcrypt');

class FETIPH extends EventEmitter{
	constructor(mongoHandler,  options = {} ){
		super();
		this.db = mongoHandler;
		this.FTPserver = new FTPapi(options);
		this.FTPserver.on('login', ({connection, username, password}, resolve, reject) => { 
			console.log(db);
			if(this.db) this.db.collection('users').findOne({name:username, isAdmin:true}, (err, result) => {
				if(err) throw err;
				console.log(result);
				if(result) this.compareHash(result.pass, pass, (isCorrect) => {
					if(isCorrect) resolve({root: './DB'});
					reject("Log in pls");
				});
			});
		});
		
		this.FTPserver.on ( 'client-error', (connection, context, error) =>{
		  console.log ( 'connection: ',    connection );
		  console.log ( 'context: ',       context );
		  console.log ( 'error: ',         error );
		});
	}
	
	compareHash(hash, pass, callback){
		bcrypt.compare(pass, hash, (err, isCorrect) => {
			if (err) throw err;
			callback(isCorrect);
		});
	}

	start(){
		this.FTPserver.listen()
			.then( () => { 
				this.emit('up', this.FTPserver.options.url);
			})
			.catch(err => {
				this.emit('error', err);
			});
	}

}


module.exports = FETIPH;
