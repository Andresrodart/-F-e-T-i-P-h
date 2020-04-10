/*				Dependencies				*/
const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');
/*				  Variables					*/
const conf = JSON.parse(fs.readFileSync('conf.json'));

async function recursively_insert_resources(dirent, path, collection){
	if(dirent.isDirectory()){
		await collection.insertOne(
		{
			_id: path + dirent.name,
			name: dirent.name,
			isRoom: true,
			canAccess:[]
		});
		const files = fs.readdirSync(path + dirent.name, { withFileTypes: true });
		for (let index = 0; index < files.length; index++){
		 	const info = await recursively_insert_resources(files[index], path + dirent.name + '/', collection);
		 	console.log(info);
		}
		//files.forEach(async element => await recursively_insert_resources(element, path + dirent.name + '/', collection).then(info => console.log(info)));
		return path + dirent.name + ' has been inserted in the DB';
	}
	else{
		await collection.insertOne({
			_id: path + dirent.name,
			name: dirent.name,
			isRoom: false,
			canAccess:[]
		});
		return path + dirent.name + ' has been inserted in the DB';
	}
}

MongoClient.connect(conf.mongo_conf.mongo_uri, { useUnifiedTopology: true })
.then(async client => {
	let collection = client.db('FETIPH').collection('resources');
	const files = fs.readdirSync(conf.main_folder, {withFileTypes: true});
	for (let index = 0; index < files.length; index++) {
		const info = await recursively_insert_resources(files[index], conf.main_folder, collection);
		console.log(info);
	}
	client.close();
})
.catch(err => {throw err.stack;});