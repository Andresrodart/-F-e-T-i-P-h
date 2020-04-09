/*				Dependencies				*/
const startFTPapi = require('./src/(F)e(T)i(P)h');
const fs = require('fs');
/*				  Variables					*/
const conf = JSON.parse(fs.readFileSync('conf.json'));
const FTPserver = startFTPapi(conf);
/*				  Algorithm				 	*/
FTPserver.on('up', url => {
	console.log(`service up in ${url}`);
});
FTPserver.start();