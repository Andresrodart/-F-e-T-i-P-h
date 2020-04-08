/*				Dependencies				*/
const FTPapi = require('./src/(F)e(T)i(P)h');
const httpServer = require("./src/http_handler");
const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');
/*				  Variables					*/
const conf = JSON.parse(fs.readFileSync('conf.json'));
const FTPserver = new FTPapi(conf.ftp_conf);
/*				  Algorithm				 	*/

if(conf.db === "mongo") MongoClient.connect('mongodb://'+ conf.mongo_conf.mongo_host + ':' + conf.mongo_conf.mongo_port, (err, client) => {
	if(err) throw err;
	const db = client.db(conf.mongo_conf.mongo_db);
	console.log(`service up connected to mongo`);
	new httpServer(db, conf.mongo_conf.http_admin_tool).start();
}); else new httpServer(options = conf.mongo_conf.http_admin_tool).start();


FTPserver.on('up', url => {
	console.log(`service up in ${url}`);
});

FTPserver.start();