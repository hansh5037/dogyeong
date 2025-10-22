import './common.js';
import './kv.js';
import './carousel.js';

window.component = window.component || {};
window.component.initialize = (function () {
	const init = function () {
		window.component.kv.init();
		window.component.common.init();
		window.component.carousel.init();
	};
	
	return {
		init: init
	}
})();

window.addEventListener('DOMContentLoaded', () => {
	window.component.initialize.init();
});