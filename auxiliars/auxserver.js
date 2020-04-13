const FtpSrv = require('ftp-srv');
const FTPserver = new FtpSrv({ 
	"url": 			"ftp://192.168.1.72:5050",
	"pasv_url":		"192.168.1.72" });

FTPserver.on('RETR', (error, filePath) => {
	if(error) throw error;
	console.log(filePath);
});

FTPserver.on('STOR', (error, fileName) => {
	if(error) throw error;
	console.log(fileName);
});

FTPserver.on('login', ({connection, username, password}, resolve, reject) => { 
	//connection.ip, username, password
	resolve({root: '../DB/2'});
});

FTPserver.listen()
.then(() => {  });