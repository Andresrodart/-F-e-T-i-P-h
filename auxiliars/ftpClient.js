var Client = require('ftp');
var fs = require('fs');
var c = new Client();
c.on('ready', function() {
	c.list(function(err, list) {
    	if (err) throw err;
    	console.dir(list);
		c.get(list[0].name, function(err, stream) {
			if (err) throw err;
			stream.once('close', function() { c.end(); });
			stream.pipe(fs.createWriteStream(list[0].name));
		});
	});
});

// c.on('ready', function() {
// 	c.get('foo.txt', function(err, stream) {
//     	if (err) throw err;
//       	stream.once('close', function() { c.end(); });
//       	stream.pipe(fs.createWriteStream('1/DSCN8410.JPG'));
//     });
// });
c.on('error', e => console.error(e));

// connect to localhost:21 as anonymous
c.connect({
	host: "localhost",
	port: 5050,
	user:"Andy",
	password: "password"
});