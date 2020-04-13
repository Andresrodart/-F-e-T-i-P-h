/*				Dependencies				*/
const {compareHash, getHash} = require('./common_functions');
const MongoClient = require('mongodb').MongoClient;
const httpServer = require("./mongo_http_handler");
const {FtpSrv, FileSystem} = require('ftp-srv');
const EventEmitter = require('events');
const nodePath = require('path');
const fs = require('fs');
/*				   Classes					*/
// class MyFileSystem extends FileSystem {
// 	constructor(connection, db, { root, cwd } = {}){
// 		super(connection, root, cwd);
// 		this.db = db;
// 	}

// 	list(path = '.') {
// 		return this.db.collection('resources').findOne({
// 			_id: nodePath.join	
// 		})
// 		const files = fs.readdirSync(path);
// 		for (let index = 0; index < files.length; index++){
// 			console.log(info);
// 	   }
// 		return Promise.resolve(['inbox', 'sent', 'trash']);
// 	}
// }

class mongoFETIPH extends EventEmitter{
	constructor(options){
		super();
		this.options = options;
		this.FTPserver = new FtpSrv(options.ftp_conf);
		this.httpServer = new httpServer(options.http_admin_tool);

		this.FTPserver.on('login', ({connection, username, password}, resolve, reject) => { 
			//connection.ip, username, password
			connection.on('RETR', (error, filePath) => {
				if(error) throw error;
				//console.log(filePath);
			});
	
			connection.on('STOR', (error, fileName) => {
				if(error) throw error;
				//console.log(fileName);
			});
			this.db.collection('users').findOne({name:username})
			.then(result => {
				if(result) compareHash(result.pass, password, (isCorrect) => {
					if(isCorrect) this.newConnection(resolve, result, connection);
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
	newConnection(resolve, user, connection){
		console.log(nodePath.join(__dirname, this.options.main_folder, user.room))
		this.db.collection('access_log').insertOne({
			date: new Date(Date.now()), //.toISOString()
			user: user.name,
			ip: connection.ip,
			type: 'FTP'
		}).then( result => resolve({fs: new FileSystem(connection, {
			root: nodePath.join(this.options.main_folder, user.room), 
		})}));
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
