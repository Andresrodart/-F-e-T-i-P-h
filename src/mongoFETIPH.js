/*				Dependencies				*/
const {compareHash, getHash} = require('./common_functions');
const MongoClient = require('mongodb').MongoClient;
const httpServer = require("./mongo_http_handler");
const EventEmitter = require('events');
const FTPapi = require('ftp-srv');
/*				  Variables					*/

class mongoFETIPH extends EventEmitter{
	constructor(options){
		super();
		this.options = options;
		this.FTPserver = new FTPapi(options.ftp_conf);
		this.httpServer = new httpServer(options.http_admin_tool);
		this.FTPserver.on('login', ({connection, username, password}, resolve, reject) => { 
			//connection.ip, username, password
			this.db.collection('users').findOne({name:username, isAdmin:false})
			.then(result => {
				if(result) compareHash(result.pass, password, (isCorrect) => {
					if(isCorrect) resolve({root: './DB'});
					else reject("Log in pls");
				});
				else reject("Log in pls");
			})
			.catch(err => {throw err.stack;});
		});
		
		this.FTPserver.on ( 'client-error', (connection, context, error) =>{
			//console.log ( 'connection: ',    connection );
			//console.log ( 'context: ',       context );
			//console.log ( 'error: ',         error );
		});
	}
	start(){
		MongoClient.connect(this.options.mongo_conf.mongo_uri, { useUnifiedTopology: true })
		.then(client => {
			this.db = client.db('FETIPH');
			return this.FTPserver.listen();
		})
		.then(() => { 
			this.emit('up', this.FTPserver.options.url);
			this.httpServer.start(this.db);
		})
		.catch(err => {throw err.stack;});
	}
}

module.exports = mongoFETIPH;
