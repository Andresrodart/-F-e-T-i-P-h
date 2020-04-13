var genericOptions = {
	method: 'POST', 		// *GET, POST, PUT, DELETE, etc.
	mode: 'cors',			// no-cors, *cors, same-origin
	cache: 'no-cache', 		// *default, no-cache, reload, force-cache, only-if-cached
	credentials: 'same-origin', // include, *same-origin, omit
	headers: {
	  'Content-Type': 'application/json'
	},
	redirect: 'follow', // manual, *follow, error
	referrerPolicy: 'no-referrer', // no-referrer, *client
	body: null
};

function checkCredentials(user, pass){
	data = JSON.stringify({
		user: user,
		pass: pass
	});
	genericOptions.body = data;
	genericPost('/checkAdmin', genericOptions, (answer) => {
		if(!answer) document.getElementById('bad_login').classList.remove('is-hidden');
	});
}

function registerAdmin(){
	data = JSON.stringify({
		user: document.getElementById('newAdmin').value,
		pass: document.getElementById('newAdminPassword').value
	});
	genericOptions.body = data;
	genericPost('/firstAdmin', genericOptions, (answer) => console.log(answer));
}

function login(){
	genericGet('isAdminNew', answer => {
		let next = (answer)? 'name' : 'setAdmin';
		fade(document.getElementById('login')).then(() => unfade(document.getElementById(next)));
	});
}