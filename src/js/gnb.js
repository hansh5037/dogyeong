window.component = window.component || {};
window.component.gnb = (function () {
	let els = {};

	const init = function () {

		setElemets();
		BindEvents();
	};

	const setElemets = function () {
		els.gnb = document.querySelector('.gnb');
		els.gnbButton = els.gnb.querySelectorAll('button');
		els.home = document.querySelector('#home');
		els.carousel = document.querySelector('#carousel');
	};
	const BindEvents = function () {
		eventHandler.scroll();
	};
	const eventHandler = {
		scroll: function () {
			document.addEventListener('scroll', function () {
				eventsList.activeGnbScroll(els.home);
				eventsList.activeGnbScroll(els.carousel);
			})
		}
	};
	const eventsList = {
		activeGnbScroll: function (section) {
			const currentScroll = window.scrollY;
			const rect = section.getBoundingClientRect();
			const top = section.offsetTop;
			const bottom = rect.height + top;

			if (bottom >= currentScroll && currentScroll >= top) {
				let sectionId = section.getAttribute('id');
				for (let i = 0; i < els.gnbButton.length; ++i) {
					els.gnbButton[i].classList.toggle('is-active', els.gnbButton[i].getAttribute('data-value') === sectionId);
				}
			}
		}
	};
	const accessibility = {};
	return {
		init: init
	}
})();
