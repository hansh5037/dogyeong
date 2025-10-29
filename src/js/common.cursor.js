window.component = window.component || {};
window.component.commonCursor = (function () {
	let els = {};

	const init = function () {
		els.section = document.querySelector('.cursor');

		if (!!els.section) {
			BindEvents();
		}
	};

	const BindEvents = function (event) {
		eventHandler.mouseMove();
	};

	const eventHandler = {
		mouseMove: function () {
			document.addEventListener("pointermove", function (event) {
				if (event.pointerType == 'mouse') {
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
