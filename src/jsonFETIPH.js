/*				Dependencies				*/
const {compareHash, getHash} = require('./common_functions');
const httpServer = require("./json_http_handler");
const EventEmitter = require('events');
const FTPapi = require('ftp-srv');
const fs = require('fs');

class jsonFETIPH extends EventEmitter{
	constructor(options){
		super();
		this.credentials = {};
		this.FTPserver = new FTPapi(options.ftp_conf);
		this.HTTPserrver = new httpServer(options.http_admin_tool);
		this.FTPserver.on('login', ({connection, username, password}, resolve, reject) => { 
			if(result) compareHash(this.credentials.users[username].pass, password, (isCorrect) => {
				if(isCorrect) resolve({root: './DB'});
				reject("Log in pls");
			});
		});
		
		this.FTPserver.on ( 'client-error', (connection, context, error) =>{
		  console.log ( 'connection: ',    connection );
		  console.log ( 'context: ',       context );
		  console.log ( 'error: ',         error );
		});
	}
	initCredentials(){
		fs.readFile('../local/credentials.json', (err, data) => {
			if (err) console.log(err);
			this.credentials = JSON.parse(data);
		});
	}
	start(){
		this.FTPserver.listen()
		.then( () => { 
			this.emit('up', this.FTPserver.options.url);
			this.initCredentials();
			this.httpServer.start();
		})
		.catch(err => {
			this.emit('error', err);
		});
	}
}

module.exports = jsonFETIPH;