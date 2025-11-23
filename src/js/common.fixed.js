window.component = window.component || {};
window.component.commonFixed = (function () {
	let els = {},
		resize = window.component.commonResize.resizeHandler,
		start = 0,
		end = 0,
		trackRanges = [];

	const init = function () {
		els.section = document.querySelector('.contents');
		els.fixedTrack = els.section.querySelectorAll('.common-fixed-track');

		if (!els.fixedTrack.length) return;
		setElements();
		bindEvents();
	};

	const setElements = function () {
		els.gnb = els.section.querySelector('.gnb');
	};

	const bindEvents = function () {
		eventList.setTrack();
		eventList.calrange();
		eventHandler.resize();
	};

	const eventHandler = {
		resize: function () {
			resize(function () {
				eventList.setTrack();
				eventList.calrange();
			});
		}
	};

	const eventList = {
		lastProgress: null,
		direction: null,
		isActive: false,

		setTrack: function () {
			for (let i = 0; i < els.fixedTrack.length; i++) {
				const trackHeight = Number(els.fixedTrack[i].getAttribute('data-track-height')) || 1;
				els.fixedTrack[i].style.height = (window.innerHeight * trackHeight) + 'px';
			}
		},

		calrange: function () {
			trackRanges = [];
			for (let i = 0; i < els.fixedTrack.length; i++) {
				const section = els.fixedTrack[i];

				const sectionTop = section.offsetTop;
				const sectionHeight = section.offsetHeight;
				const viewportHeight = window.innerHeight;

				let s = sectionTop;
				let e = sectionTop + sectionHeight - viewportHeight;

				if (e <= s) {
					e = s + 1;
				}

				trackRanges[i] = { start: s, end: e };
			}
		},

		getProgress: function () {
		const scrollY = window.scrollY || window.pageYOffset;

		let activeRange = null;

		for (let i = 0; i < trackRanges.length; i++) {
			const range = trackRanges[i];
			if (!range) continue;

			if (scrollY >= range.start && scrollY <= range.end) {
				activeRange = range;
				break;
			}
		}

		if (!activeRange) {
			if (this.isActive) {
				const finalProgress = this.direction === 'up' ? 0 : 100;
				this.isActive = false;
				this.lastProgress = finalProgress;

				return {
					progress: finalProgress,
					direction: this.direction
				};
			}

			this.lastProgress = null;
			this.direction = null;
			return;
		}

		start = activeRange.start;
		end = activeRange.end;

		const raw = ((scrollY - start) / (end - start)) * 100;
		const clamped = Math.max(0, Math.min(100, raw));
		const progress = Math.floor(clamped);

		if (!this.isActive) {
			this.isActive = true;
			this.lastProgress = 0;

			return {
				progress: 0,
				direction: this.direction
			};
		}

		if (this.lastProgress === progress) {
			return;
		}

		if (this.lastProgress != null) {
			const delta = progress - this.lastProgress;
			if (delta > 0) {
				this.direction = 'down';
			} else if (delta < 0) {
				this.direction = 'up';
			}
		}

		this.lastProgress = progress;

			return {
				progress,
				direction: this.direction
			};
		}
	};

	return {
		init: init,
		eventList: eventList
	}
})();