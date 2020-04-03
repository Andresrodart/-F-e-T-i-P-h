var Client = require('ftp');
 
var c = new Client();
c.on('ready', function() {
	c.list(function(err, list) {
    	if (err) throw err;
    	console.dir(list);
    	c.end();
    });
});

c.on('error', e => console.error(e));

// connect to localhost:21 as anonymous
c.connect({
	host: "192.168.1.68",
	port: 5050
});