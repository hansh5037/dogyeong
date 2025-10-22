window.component = window.component || {};
window.component.carousel = (function () {
	let els = {};

	const init = function () {
		els.section = document.querySelector('component-carousel');

		if (!!els.section) {
			setElemets();
			BindEvents();
		}
	};

	const setElemets = function () {};
	const BindEvents = function () {};
	const eventHandler = {};
	const eventsList = {};
	const accessibility = {};
	return {
		init: init
	}
})();
