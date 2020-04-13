/*				Dependencies				*/
const MongoClient = require('mongodb').MongoClient;
const nodePath = require('path');
const fs = require('fs');
/*				  Variables					*/
const conf = JSON.parse(fs.readFileSync('conf.json'));
conf.main_folder = nodePath.normalize(conf.main_folder);

async function recursively_insert_resources(dirent, path, collection, parentDir){
	if(dirent.isDirectory()){
		await collection.insertOne(
		{
			_id: nodePath.join(path, dirent.name),
			name: dirent.name,
			isRoom: (!parentDir)? true:false,
			parent: parentDir,
			cantAccess:[]
		}).catch(err => {});
		const files = fs.readdirSync(nodePath.join(path, dirent.name), { withFileTypes: true });
		for (let index = 0; index < files.length; index++){
		 	const info = await recursively_insert_resources(files[index], nodePath.join(path, dirent.name), collection, nodePath.join(path, dirent.name));
		 	console.log(info);
		}
		//files.forEach(async element => await recursively_insert_resources(element, path + dirent.name + '/', collection).then(info => console.log(info)));
		return nodePath.join(path, dirent.name) + ' has been inserted in the DB';
	}
	else{
		await collection.insertOne({
			_id: nodePath.join(path, dirent.name),
			name: dirent.name,
			isRoom: false,
			parent: parentDir,
			cantAccess:[]
		}).catch(err => {});
		return nodePath.join(path, dirent.name) + ' has been inserted in the DB';
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