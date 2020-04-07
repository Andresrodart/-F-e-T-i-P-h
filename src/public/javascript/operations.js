var newInstance = true;
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
function fade(element, element2Unfade) {
    var op = 1;  // initial opacity
    var timer = setInterval(function () {
        if (op <= 0.1){
            clearInterval(timer);
			element.classList.add('is-hidden');
			unfade(element2Unfade);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.1;
    }, 50);
}

function unfade(element) {
	var op = 0.1;  // initial opacity
	element.style.opacity = op;
    element.classList.remove('is-hidden');
    var timer = setInterval(function () {
        if (op >= 1){
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.1;
    }, 10);
}

function login(){
	genericGet('isAdminNew', answer => {
		let next = (answer)? 'name' : 'setAdmin';
		document.getElementById(next).style.opacity = 0.1;
		fade(document.getElementById('login'), document.getElementById(next));
	});
}

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

function genericPost(url, options, callback){
	fetch(url, options)
	.then((response) => {
		if (response.redirected) window.location.href = response.url;
		else return response.json();
		return true;
	})
	.then((data) => {
		if(callback) callback(data);
	});
}

function genericGet(url, callback) {
	fetch(url)
	.then((response) => {
		return response.json();
	})
	.then((data) => {
		callback(data);
	});
}