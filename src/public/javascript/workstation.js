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
var views = {
	overview:{
		exist: false,
		options: ['access_log', 'transaction_log'],
		create: create_overview
	},
	users: {
		exist: false,
		options: ['add_user'],
		create: create_users
	}
};
var currentWorkArea = 'overview';
function init_page() {
	change_area('overview');
}
/**
 * Change the area we are looking eg. Overview
 * @param {string} area 
 */
function change_area(area){
	if(!views[area].exist) views[area].create();
	if(currentWorkArea !== area){
		document.getElementById('li-' + currentWorkArea).classList.remove('is-active');
		document.getElementById('li-' + area).classList.add('is-active');
		fade(document.getElementById(currentWorkArea + '_option_panel'));
		fade(getOptionArea(currentWorkArea));
		fade(document.getElementById('page_tittle'))
		.then(()=> {
			document.getElementById('page_tittle').innerHTML = area.charAt(0).toUpperCase() + area.slice(1);
			unfade(document.getElementById(area + '_option_panel'));
			unfade(document.getElementById('page_tittle'));
			unfade(getOptionArea(area));
		});
		currentWorkArea = area;
	}
}

function getOptionArea(area){
	let selector = document.getElementById(area + '_option_panel').querySelector('.is-active');
	return document.getElementById(selector.id + '_area');
}

function registerUser(user, room, password){
	data = JSON.stringify({
		user: user,
		room: room,
		pass: password
	});
	genericOptions.body = data;
	genericPost('/postUser', genericOptions, (answer) => console.log(answer));
}

function changeOption(newOption) {
	
}

function getAccessLog(){
	document.getElementById('workarea-container').querySelector('h1.title').value = newOption.innerHTML;
}

function create_users(){
	let list = createElement({
		type: 'ul',
		childs:[
			createElement({
				type:'li', 
				classes:['is-active'], 
				id: 'create_user', 
				inner_html: 'create user',
				on_click: changeOption
			})
		]
	});
	document.getElementById('option-panel').appendChild(createElement({
		type: 'div',
		id: 'users_option_panel',
		classes: ['is-hidden'],
		childs:[list]}
	));
	views.users.exist = true;
}

function create_overview(){
	let list = createElement({
		type: 'ul',
		childs:[
			createElement({
				type:'li', 
				classes:['is-active'], 
				id: 'access_log', 
				inner_html: 'access log',
				on_click: changeOption
			}),
			createElement({
				type:'li', 
				id: 'transaction_log', 
				inner_html: 'transaction log',
				on_click: changeOption
			})
		]
	}); 	
	document.getElementById('option-panel').appendChild(createElement({
		type: 'div',
		id: 'overview_option_panel',
		childs:[list]}
	));
	views.overview.exist = true;
}