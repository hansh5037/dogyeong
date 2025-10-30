window.component = window.component || {};
window.component.commonResize = (function () {
	let els = {};

	const init = function () {
		els.section = document.querySelector('.contents');
	};

	const resizeHandler = function (onRealResize) {
		let lastW = window.innerWidth;
		let lastH = (window.visualViewport?.height ?? window.innerHeight);
		window.addEventListener('resize', function () {
			let w = window.innerWidth;
			let h = (window.visualViewport?.height ?? window.innerHeight);

			const widthChanged = w !== lastW;
			const deltaH = Math.abs(h - lastH);
			const relative = deltaH / Math.max(1, lastH);
			if (!widthChanged && relative < 0.06) {
				lastH = h;
				return;
			}

			lastW = w;
			lastH = h;
			onRealResize && onRealResize(w, h);
		});
	};


	return {
		init: init,
		resizeHandler: resizeHandler
	}
})();