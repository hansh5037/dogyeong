window.component = window.component || {};
window.component.kv = (function () {
	let els = {};
	let gap = 0.1;

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
		eventHandler.wheel();
	};

	const eventHandler = {
		scroll: function () {
			window.addEventListener('scroll', function () {
				const p = eventsList.getScroll();
				// console.log(p)
			});
		},
		wheel: function() {
			window.addEventListener('wheel',(event) => {
				const p = eventsList.getScroll();
				const inRange = p > 0 && p < 1;
				const wheel = event.wheelDeltaY;

				if (inRange) {
					if(wheel > 0) {
						// console.log('Up!');
						eventsList.headlineBottomAnimation();
						
					} else {
						// console.log('Down!');
						eventsList.headlineTopAnimation();
					}
				} return; 
			});
		}
	};

	const eventsList = {
		setFixedScroll: function () {
			els.fixedTrack.style.height = (window.innerHeight * 5) + 'px';
		},
		getScroll: function () {
			const elsRect = els.fixedTrack.getBoundingClientRect();
			const viewPort = (window.visualViewport?.height) || window.innerHeight;
			const t =  elsRect.top / (viewPort - elsRect.height);

			return Math.max(0, Math.min(1, t));
		},
		getScaleValue: function (repeat = 1, eps = 1e-3) {
			const scroll = eventsList.getScroll();
			const x = (scroll * repeat) % 1;
			let v = (1 - Math.cos(2 * Math.PI * x)) / 2; // 0→1→0 (사인파)

			if (v > 1 - eps) v = 1;
			else if (v < eps) v = 0;

			return v;
		},
		headlineTopAnimation: function() {
			const alphabetTop = els.headlineTop.querySelectorAll('span');
			const alphabetBottom = els.headlineBottom.querySelectorAll('span');
			const scaleValue = eventsList.getScaleValue();

			for (let i = 0; i < alphabetTop.length; i++) {
				let scale = 1 - (scaleValue + gap * i);
				if (scale < 0) scale = 0;
				if (scale > 1) scale = 1;
				alphabetTop[i].style.transform = `scaleY(${scale})`;
			}

			for (let i = 0; i < alphabetBottom.length; i++) {
				let scale = scaleValue + gap * i;
				if (scale < 0) scale = 0;
				if (scale > 1) scale = 1;
				alphabetBottom[i].style.transform = `scaleY(${scale})`;
			}
		},
		headlineBottomAnimation: function() {
			const alphabetTop = els.headlineTop.querySelectorAll('span');
			const alphabetBottom = els.headlineBottom.querySelectorAll('span');
			const scaleValue = eventsList.getScaleValue();

			for (let i = 0; i < alphabetTop.length; i++) {
				let scale = scaleValue + gap * i;
				if (scale < 0) scale = 0;
				if (scale > 1) scale = 1;
				alphabetTop[i].style.transform = `scaleY(${scale})`;
			}

			for (let i = 0; i < alphabetBottom.length; i++) {
				let scale = 1 - (scaleValue + gap * i);
				if (scale < 0) scale = 0;
				if (scale > 1) scale = 1;
				alphabetBottom[i].style.transform = `scaleY(${scale})`;
			}
		}
	};

	return {
		init: init
	}
})();
