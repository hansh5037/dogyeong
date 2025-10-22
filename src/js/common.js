window.component = window.component || {};
window.component.common = (function () {
	let els = {};

	const init = function () {
		els.section = document.querySelector('.contents');

		if (!!els.section) {
			setElemets();
			BindEvents();
		}
	};

	const setElemets = function () {
        els.cursor = els.section.querySelector('.common-cursor')
    };
	const BindEvents = function () {
        eventHandler.mouseMove();
    };
	const eventHandler = {
        mouseMove: function () {
            document.addEventListener("mousemove", function (event) {
                console.log(event.clientX, event.clientY)
                let x = event.clientX;
                let y = event.clientY;

                els.cursor.style.cssText = "left:"+x+"px;"+"top:"+y+"px;"
            })
        }
    };
	const eventsList = {};
	return {
		init: init
	}
})();
