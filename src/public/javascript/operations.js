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