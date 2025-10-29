window.component = window.component || {};
window.component.carousel = (function () {
	let els = {};

	const init = function () {
		els.section = document.querySelector('.component-carousel');

		if (!!els.section) {
			setElements();
			bindEvents();
		}
	};

	const setElements = function () {};
	const bindEvents = function () {};
	const eventHandler = {};
	const eventsList = {};
	const accessibility = {};
	return {
		init: init
	}
})();
