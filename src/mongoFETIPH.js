/*				Dependencies				*/
const {compareHash, getHash} = require('./common_functions');
const MongoClient = require('mongodb').MongoClient;
const httpServer = require("./mongo_http_handler");
const {FtpSrv, FileSystem} = require('ftp-srv');
const EventEmitter = require('events');
const nodePath = require('path');
const _ = require('lodash');
const fs = require('fs');
/*				   Classes					*/
class FETIPHFileSystem extends FileSystem {
 	constructor(connection, db, user,{ root, cwd } = {}){
 		super(connection, {root, cwd});
		this.db = db;
		this.user = user;
 	}

 	list(path = '.') {
		const {fsPath} = this._resolvePath(path);
 	 	const files = fs.readdirSync(fsPath);
		return	this.db.collection('resources').find({
			name:{$in:files}, parent:fsPath, cantAccess:{$nin:[this.connection.ip, this.user.name]}
		}).toArray().then( docs => {
			const stats = [];
			for (let i = 0; i < docs.length; i++){
				let stat = fs.statSync(nodePath.normalize(docs[i]._id))
				_.set(stat, 'name', docs[i].name);
				stats.push(stat);
			}
			return Promise.resolve(stats);
		}).catch(err => console.error(err));
 	}
}

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
				this.db.collection('transaction_log').insertOne({
					date: new Date(Date.now()), //.toISOString()
					user: username,
					ip: connection.ip,
					type: 'Download',
					file: filePath
				}).then( result => null)
				.catch(err => null);
			});
	
			connection.on('STOR', (error, fileName) => {
				if(error) throw error;
				this.db.collection('transaction_log').insertOne({
					date: new Date(Date.now()), //.toISOString()
					user: username,
					ip: connection.ip,
					type: 'Upload',
					file: fileName
				}).then( result => null)
				.catch(err => null);
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
		this.db.collection('access_log').insertOne({
			date: new Date(Date.now()), //.toISOString()
			user: user.name,
			ip: connection.ip,
			type: 'FTP'
		}).then( result => resolve({fs: new FETIPHFileSystem(connection, this.db, user,{
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
