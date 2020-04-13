const path = require('path');
const fs = require('fs');
const files = fs.readdirSync('./');
console.log(files);//path.join(__dirname, '../../Fetiph/DB')); //.normalize('./DB'));
for (let index = 0; index < files.length; index++) {
	console.log('---', files[index]);
}