window.component = window.component || {};
window.component.carousel = (function () {
	let els = {};

	const init = function () {
		els.section = document.querySelector('.component-carousel');

		if (!!els.section) {
			setElements();
			BindEvents();
		}
	};

	const setElements = function () {};
	const BindEvents = function () {};
	const eventHandler = {};
	const eventsList = {};
	const accessibility = {};
	return {
		init: init
	}
})();
