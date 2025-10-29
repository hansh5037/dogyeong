import './common.resize.js';
import './common.fixed.js';
import './common.cursor.js';
import './gnb.js';
import './kv.js';
import './carousel.js';

window.component = window.component || {};
window.component.initialize = (function () {
	const init = function () {
		window.component.commonResize.init();
		window.component.commonFixed.init();
		window.component.commonCursor.init();
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