var EventEmitter = require('events');
const FTPapi = require('ftp-srv');

class FETIPH extends EventEmitter{
	constructor( options = {} ){
		super();
		this.FTPserver = new FTPapi(options);
		
		this.FTPserver.on('login', ({connection, username, password}, resolve, reject) => { 
			if (username === "anonymous") reject("Log in pls");
			console.log(connection.ip);
			resolve({root: './DB'});
		});
		
		this.FTPserver.on ( 'client-error', (connection, context, error) =>{
		  console.log ( 'connection: ',    connection );
		  console.log ( 'context: ',       context );
		  console.log ( 'error: ',         error );
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
