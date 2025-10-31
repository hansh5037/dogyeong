window.component = window.component || {};
window.component.overview = (function () {
	let els = {},
		CAROUSEL = window.component.commonCarousel;

	const init = function () {
		els.section = document.querySelector('.common-wrap');

		if (!!els.section) {
			setElements();
			bindEvents();
		}
	};

	const setElements = function () {
		els.carouselContainer = els.section.querySelector('.js-carousel');
	};

	const bindEvents = function () {
		eventList.setCarousel();
	};

	const eventHandler = {};

	const eventList = {
		setCarousel: function () {
			const myCarousel = CAROUSEL.create({
				container: els.carouselContainer,
				onInit: function () {
					console.log('Carousel ready!')
				},
				onSlideChange: function (index) {
					console.log(`Now showing slide ${index}`)
				}
			});
			myCarousel.init(); 
		}
	};

	return {
		init: init
	};

})();