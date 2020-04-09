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

var currentWorkArea = 'Overview';

function registerUser(user, password){
	data = JSON.stringify({
		user: user,
		pass: password
	});
	genericOptions.body = data;
	genericPost('/postUser', genericOptions, (answer) => console.log(answer));
}

function changeWorkArea(neextArea) {
	fade(document.getElementById(currentWorkArea), document.getElementById(neextArea));
	fade(document.getElementById(currentWorkArea + '-options'), document.getElementById(neextArea + '-options'));
	document.getElementById('li-' + currentWorkArea).classList.remove('is-active');
	document.getElementById('li-' + neextArea).classList.add('is-active');
	currentWorkArea = neextArea;
}

function changeOption(newOption) {
	document.getElementById(currentWorkArea + '-options').querySelector('ul li.is-active').classList.remove('is-active');
	newOption.classList.add('is-active');
	//fade(document.getElementById(newOption), document.getElementById(currentWorkArea).querySelector('div:not(.is-hidden):not(.column)'));
}