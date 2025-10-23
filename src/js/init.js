import './common.js';
import './gnb.js';
import './kv.js';
import './carousel.js';

window.component = window.component || {};
window.component.initialize = (function () {
	const init = function () {
		window.component.common.init();
		window.component.gnb.init();
		window.component.kv.init();
		window.component.carousel.init();
	};
	
	return {
		init: init
	}
})();

window.addEventListener('DOMContentLoaded', () => {
	window.component.initialize.init();
});