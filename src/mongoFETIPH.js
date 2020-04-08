/*				Dependencies				*/
const FTPapi = require('./src/(F)e(T)i(P)h');
const httpServer = require("./src/http_handler");
const MongoClient = require('mongodb').MongoClient;
/*				  Variables					*/
function start(conf) {
	MongoClient.connect('mongodb://'+ conf.mongo_conf.mongo_host + ':' + conf.mongo_conf.mongo_port, (err, client) => {
		if(err) throw err;
		const db = client.db(conf.mongo_conf.mongo_db);
		console.log(`service up connected to mongo`);
		new httpServer(db, conf.mongo_conf.http_admin_tool).start();
		new FTPapi(sb, conf.ftp_conf);
	});
}
module.exports = start();
