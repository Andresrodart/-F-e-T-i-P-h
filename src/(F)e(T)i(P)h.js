const mongoAPI = require('./mongoFETIPH');
const jsonAPI = require('./jsonFETIPH');


function start(conf){
	if(conf.db === "mongo") return new mongoAPI(conf);
	else return jsonAPI(conf);
}
module.exports = start;
