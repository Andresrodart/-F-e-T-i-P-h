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
var access_page = 0;
var transaction_page = 0;

function init_page() {
	change_area('overview');
	get_access_log();
}
/**
 * Change the area we are looking eg. Overview
 * @param {string} area 
 */
function change_area(area){
	if(!views[area].exist) views[area].create();
	if(currentWorkArea !== area){
		document.getElementById('li-' + currentWorkArea).classList.remove('is-active'); document.getElementById('li-' + area).classList.add('is-active');
		fade(document.getElementById(currentWorkArea + '_option_panel')); fade(get_work_area(currentWorkArea));
		fade(document.getElementById('page_tittle'))
		.then(()=> {
			document.getElementById('page_tittle').innerHTML = area.charAt(0).toUpperCase() + area.slice(1);
			unfade(document.getElementById(area + '_option_panel'));
			unfade(document.getElementById('page_tittle'));
			unfade(get_work_area(area));
		});
		currentWorkArea = area;
	}
}

function get_work_area(area){
	let selector = document.getElementById(area + '_option_panel').querySelector('.is-active');
	return document.getElementById(selector.id + '_area');
}

function change_option() {
	if(this.id + '_area' !== get_work_area(currentWorkArea).id)
		fade(get_work_area(currentWorkArea)).then(() => {
			unfade(document.getElementById(this.id + '_area'));
			document.getElementById(currentWorkArea + '_option_panel').querySelector('.is-active').classList.remove('is-active'); 
			this.classList.add('is-active');
		});
}

function registerUser(user, room, password){
	let data = JSON.stringify({
		user: user,
		room: room,
		pass: password
	});
	let notification = {
		type: 'div',
		classes: ['notification'],
		childs: [createElement({
			type: 'button',
			classes: ['delete'],
			on_click: delete_notification
		})],
	};
	genericOptions.method = 'POST';
	genericOptions.body = data;
	genericPost('/postUser', genericOptions, answer => {
		if(answer && !answer.empty){
			user = ''; room = ''; password = '';
			notification.classes.push('is-success');
			notification.inner_html = 'user was successfully registered';
			document.getElementById('notification_user').appendChild(createElement(notification));
		}
		else{
			notification.classes.push('is-danger');
			notification.inner_html = (answer.empty)?'fields cant be empty':'a problem was found on server side :C';
			document.getElementById('notification_user').appendChild(createElement(notification));
		}
	});
}

function get_access_log(){
	let table = document.getElementById('access_log_table');
	let count = 1;
	genericGet('/access_log/' + access_page++, response => {
		if(response) response.forEach(element => {
			let row = table.insertRow();
			let num = row.insertCell(0), date = row.insertCell(1), user = row.insertCell(2), ip = row.insertCell(3), type = row.insertCell(4);
			num.innerHTML = (access_page - 1)* 10  + (count++);
			date.innerHTML = element.date;
			user.innerHTML = element.user;
			ip.innerHTML = element.ip;
			type.innerHTML = element.type;	
		});else access_page--;
	});
}

function get_transaction_log(){
	let table = document.getElementById('transaction_log_table');
	let count = 1;
	genericGet('/transaction_log/' + transaction_page++, response => {
		if(response) response.forEach(element => {
			let row = table.insertRow();
			let num = row.insertCell(0), date = row.insertCell(1), user = row.insertCell(2), ip = row.insertCell(3), file = row.insertCell(4);
			num.innerHTML = (access_page - 1)* 10  + (count++);
			date.innerHTML = element.date;
			user.innerHTML = element.user;
			ip.innerHTML = element.ip;
			file.innerHTML = element.file;	
		});else transaction_page--;
	});
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
				on_click: change_option
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
				on_click: change_option
			}),
			createElement({
				type:'li', 
				id: 'transaction_log', 
				inner_html: 'transaction log',
				on_click: change_option
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

function delete_notification() {
	document.getElementById('notification_user').removeChild(this.parentNode);
}