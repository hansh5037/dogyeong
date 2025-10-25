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
		els.gnb = els.section.querySelector('.gnb');
		
		els.fixedTrack = els.section.querySelector('.common-fixed-track');
		els.fixedInner = els.fixedTrack.querySelector('.common-fixed-inner');
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
			const viewPort = window.innerHeight;
			const viewPortTop = window.scrollY + els.gnb.offsetHeight;
			const viewPortBottom = window.scrollY + viewPort;
			
			const elsTop = els.fixedTrack.offsetTop;
			const elsBottom = els.fixedTrack.offsetTop + els.fixedTrack.offsetHeight;
			
			const start = viewPortTop < elsTop;
			const end = viewPortBottom > elsBottom;

			const trackInside = !start && !end;

			let progress;
			if (trackInside) {
				const usableVh = viewPort - ((els.gnb && els.gnb.offsetHeight) || 0);
				const trackH = elsBottom - elsTop;
				const denom = Math.max(1, trackH - usableVh);
				const t = (viewPortTop - elsTop) / denom;

				progress = Math.max(0, Math.min(1, t));
				if (end) progress = 1; 
			}

			return {viewPort, trackInside, progress};
		},
		getDirection: function () {
			const s = this.getProgress()
			if (!s.trackInside) return;
			
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
