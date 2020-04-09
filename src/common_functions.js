const bcrypt = require('bcrypt');

function compareHash(hash, pass, callback){
	bcrypt.compare(pass, hash, (err, isCorrect) => {
		if (err) throw err;
		callback(isCorrect);
	});
}

function getHash(pass, callback){
	bcrypt.hash(pass, 10, (err, hash) => {
		if (err) throw err;
		callback(hash);
	}); 
}

module.exports.compareHash = compareHash;
module.exports.getHash = getHash;