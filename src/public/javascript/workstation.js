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

function registerUser(user, room, password){
	data = JSON.stringify({
		user: user,
		room: room,
		pass: password
	});
	genericOptions.body = data;
	genericPost('/postUser', genericOptions, (answer) => console.log(answer));
}

function changeWorkArea(nextArea) {
	fade(document.getElementById(currentWorkArea), document.getElementById(nextArea));
	fade(document.getElementById(currentWorkArea + '-options'), document.getElementById(nextArea + '-options'));
	document.getElementById('li-' + currentWorkArea).classList.remove('is-active');
	document.getElementById('li-' + nextArea).classList.add('is-active');
	currentWorkArea = nextArea;
	document.getElementById('workarea-container').querySelector('h1.title').innerHTML = document.getElementById(currentWorkArea + '-options').querySelector('ul li.is-active a').innerHTML;
}

function changeOption(newOption) {
	document.getElementById(currentWorkArea + '-options').querySelector('ul li.is-active').classList.remove('is-active');
	document.getElementById('workarea-container').querySelector('h1.title').value = newOption.innerHTML;
	newOption.classList.add('is-active');
	//fade(document.getElementById(newOption.innerHTML), document.getElementById(currentWorkArea).querySelector('div:not(.is-hidden):not(.column)'));
}