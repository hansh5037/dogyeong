window.component = window.component || {};
window.component.common = (function () {
	let els = {};

	const init = function () {
		els.section = document.querySelector('.contents');

		if (!!els.section) {
			setElements();
			BindEvents();
		}
	};

	const setElements = function () {
		els.cursor = els.section.querySelector('.common-cursor');
		
		els.fixedTrack = els.section.querySelector('.common-fixed-track');
		els.fixedInner = els.section.querySelector('.common-fixed-inner');
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

			els.cursor.style.left = x + 'px';
    		els.cursor.style.top  = y + 'px';
		}
	};

	const fixedScrollEvent = {
		set: function(opts = {}) {
			opts.trackHeight = !!!opts.trackHeight ? 1 : opts.trackHeight;

			this.setTrack(opts.trackHeight); 
		},
		setTrack: function (trackHeight) {
			els.fixedTrack.style.height = (window.innerHeight * trackHeight) + 'px';
		},
		getProgress: function () {
			if (!els.fixedTrack) return;
			const elsRect = els.fixedTrack.getBoundingClientRect();
			const viewPort = (window.visualViewport && window.visualViewport.height) ||  window.innerHeight;
			const trackOutside = elsRect.bottom <= viewPort || elsRect.top >= viewPort;

			let progress;
			if (!trackOutside) {
				const t = (viewPort - elsRect.top) / elsRect.height;
				progress = Math.max(0, Math.min(1, t));

				if (progress < 0.19) progress = 0;
				if (progress > 1 - 0.02) progress = 1;
			}

			return { elsRect, viewPort, trackOutside, progress};
		},
		getDirection: function () {
			const s = this.getProgress()
			if (s.trackOutside) return;
			
			if (this.lastP == null) {
				this.lastP = s.progress;
				return;
			}
			const delta = s.progress - this.lastP;
			const dir = (delta > 0) ? 'down' : 'up';
			this.lastP = s.progress;
			
			return dir;
		}
	}
	return {
		init: init,
		fixedScrollEvent: fixedScrollEvent
	}
})();
