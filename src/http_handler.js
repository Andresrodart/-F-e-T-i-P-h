var exec = require('child_process').exec;
module.exports.start = function ( ){
	exec('npx http-server ./src -a localhost', (err, stdout, stderr) => {
    		if (err) throw err;
    		else console.log(stdout);
	});
};