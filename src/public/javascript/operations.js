/**
 * Make a document smoothly appear adding class 'is-hidden'  
 * @param {Document.element} element HTML element to disappear
 * @param {function():any} callback callback function after disappearing element
 */
function fade(element) {
	return new Promise((resolve, reject) => {
		var op = 1;  // initial opacity
		var timer = setInterval(() => {
			if (op <= 0.1){
				clearInterval(timer);
				element.classList.add('is-hidden');
				resolve();
			}
			element.style.opacity = op;
			element.style.filter = 'alpha(opacity=' + op * 100 + ")";
			op -= op * 0.1;
		}, 50);
	});
}
/**
 * Make a document smoothly appear removing class 'is-hidden'  
 * @param {Document.element} element HTML element to disappear
 */
function unfade(element) {
	var op = 0.1;  // initial opacity
	element.style.opacity = op;
    element.classList.remove('is-hidden');
    var timer = setInterval(function () {
        if (op >= 1) clearInterval(timer);
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.1;
    }, 10);
}
/**
 * Make a generic post via fetch
 * @param {String} url url to where to send POST
 * @param {{Object}} options options to send POST
 * @param {function({Object}):any} callback callback function
 */
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
/**
 * Make a generic get via fetch
 * @param {String} url url to where to send GET
 * @param {function({Object}):any} callback callback function
 */
function genericGet(url, callback) {
	fetch(url)
	.then((response) => {
		return response.json();
	})
	.then((data) => {
		callback(data);
	});
}

/**
 * Returns a recently created element
 * @param {Object} structure - structure of new HTML element.
 * @param {string} structure.id - An id name
 * @param {String} structure.type - An element type ('div', 'ul', ect.)
 * @param {string[]} structure.classes - An array of CSS class names
 * @param {Element[]} structure.childs - An arry of elements to append
 * @param {string} structure.inner_html - String to add at innerHTML
 * @param {function} structure.on_click - String to add at innerHTML
 * @returns {Element}
**/
function createElement(structure){//type, classes, id, childs, inner_html, on_click){
	let element = document.createElement(structure.type);
	if(structure.id) element.id = structure.id;
	if(structure.classes) structure.classes.forEach(value => element.classList.add(value));
	if(structure.childs) structure.childs.forEach(value => element.appendChild(value));
	if(structure.inner_html) element.innerHTML = structure.inner_html;
	return element;
}