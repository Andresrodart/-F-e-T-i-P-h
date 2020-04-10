const mongoAPI = require('./mongoFETIPH');
const jsonAPI = require('./jsonFETIPH');


function start(conf){
	if(conf.db === "mongo") return new mongoAPI(conf);
	else return new jsonAPI(conf);
}
module.exports = start;
