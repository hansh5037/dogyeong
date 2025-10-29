window.component = window.component || {};
window.component.commonCursor = (function () {
	let els = {};

	const init = function () {
		els.section = document.querySelector('.common-cursor');

		if (!!els.section) {
			setElements();
			BindEvents();
		}
	};

	const setElements = function () {
	};

	const BindEvents = function () {
		eventHandler.mouseMove();
	};

	const eventHandler = {
		mouseMove: function () {
			document.addEventListener("mousemove", function (event) {
				if (window.navigator.maxTouchPoints == 0) {
					eventsList.mousePosition(event);
				}
			})
		},
	};

	const eventsList = {
		mousePosition: function (event) {
			let x = event.clientX;
			let y = event.clientY;

			els.section.style.left = x + 'px';
    		els.section.style.top  = y + 'px';
		}
	};

	return {
		init: init,
	}
})();
