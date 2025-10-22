window.component = window.component || {};
window.component.kv = (function () {
	let els = {};
	let gap = 0.1;

	const clamp01 = v => Math.max(0, Math.min(1, v));

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
		els.alphabetTop = els.headlineTop.querySelectorAll('span');
		els.alphabetBottom = els.headlineBottom.querySelectorAll('span');
	};

	const bindEvents = function () {
		eventsList.setFixedScroll();
		eventHandler.wheel();
	};

	const eventHandler = {
		wheel: function() {
			window.addEventListener('wheel',(event) => {
				const p = eventsList.getScrollValue();
				const inRange = p > 0 && p < 1;
				const wheel = event.wheelDeltaY;

				if (inRange) {
					if(wheel > 0) {
						// console.log('Up!');
						eventsList.applyHeadlineScale(els.alphabetTop,    p, -1, true,  pLocal => 1 - pLocal);
						eventsList.applyHeadlineScale(els.alphabetBottom, p, -1, true,  pLocal => pLocal);
						
					} else {
						// console.log('Down!');
						eventsList.applyHeadlineScale(els.alphabetTop,    p, +1, false, pLocal => 1 - pLocal);
						eventsList.applyHeadlineScale(els.alphabetBottom, p, +1, false, pLocal => pLocal);
					}
				} return; 
			});
		}
	};

	const eventsList = {
		setFixedScroll: function () {
			els.fixedTrack.style.height = (window.innerHeight * 5) + 'px';
		},
		getScrollValue: function () {
			const elsRect = els.fixedTrack.getBoundingClientRect();
			const viewPort = (window.visualViewport?.height) || window.innerHeight;
			const t =  elsRect.top / (viewPort - elsRect.height);

			return Math.max(0, Math.min(1, t));
		},
		applyHeadlineScale: function(spans, p, dir, scrollUp, computeScale) {
			const len = spans.length;
			for (let k = 0; k < len; k++) {
				const i = scrollUp ? (len - 1 - k) : k;
				const pLocal = p + dir * gap * (k + 1);
				let scale = clamp01(computeScale(pLocal));
				spans[i].style.transform = `scaleY(${scale})`;
			};
		}
	};

	return {
		init: init
	}
})();
