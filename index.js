/*				Dependencies				*/
const FTPapi = require('./src/(F)e(T)i(P)h');
const httpServer = require("./src/http_handler");
const mongoose = require('mongoose');
const fs = require('fs');
/*				  Variables					*/
const conf = JSON.parse(fs.readFileSync('conf.json'));
const FTPserver = new FTPapi(conf.ftp_conf);
/*				  Algorithm				 	*/

if(conf.db === "mongo") mongoose.connect('mongodb://localhost/');

FTPserver.on('up', url => {
	console.log(`service up in ${url}`);
	httpServer.start();
});
FTPserver.start();