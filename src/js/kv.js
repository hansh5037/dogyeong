window.component = window.component || {};
window.component.kv = (function () {
	let els = {};

	const init = function () {
		els.section = document.querySelector('.component-kv');

		if (!!els.section) {
			setElemets();
			bindEvents();
		}
	};

	const setElemets = function () {
		els.fixedTrack = els.section.querySelector('.common-fixed-track');
		els.fixedInner = els.section.querySelector('.common-fixed-inner');
		els.headlineTop = els.section.querySelector('.js-headline-top');
		els.headlineBottom = els.section.querySelector('.js-headline-bottom');
	};

	const bindEvents = function () {
		eventsList.setFixedScroll();
		eventHandler.scroll();
	};

	const eventHandler = {
		scroll: function () {
			window.addEventListener('scroll', function () {
				const p = eventsList.getScroll();
				console.log(Math.round(p * 100))
			});
		}
	};

	const eventsList = {
		setFixedScroll: function () {
			els.fixedTrack.style.height = (window.innerHeight * 3) + 'px';
			
		},
		getScroll: function () {
			const elsRect = els.fixedTrack.getBoundingClientRect();
			const viewPort   = (window.visualViewport?.height) || window.innerHeight;
			const elsHeight    = elsRect.height;
			const t = (viewPort - elsRect.top) / elsHeight;

			return Math.max(0, Math.min(1, t));
		}
	};

	return {
		init: init
	}
})();
