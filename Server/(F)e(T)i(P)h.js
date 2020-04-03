const hostname = "127.0.0.1";
const port = "5050";
const FTPapi = require('ftp-srv');
const FTPserver = new FTPapi({ 
	url: "ftp://" + hostname + ":" + port,
	pasv_url: hostname
});


FTPserver.on('login', ({connection, username, password}, resolve, reject) => { 
	if (username === "anonymous") reject("Log in pls");
	console.log(username, password);
	resolve({root: './DB'});
});

FTPserver.on ( 'client-error', (connection, context, error) =>{
  console.log ( 'connection: ',    connection );
  console.log ( 'context: ',       context );
  console.log ( 'error: ',         error );
});


FTPserver.listen()
	.then( () => { console.log(`Server running at http://${hostname}:${port}/`); })
	.catch(err => {console.log("[error]", err);
});
