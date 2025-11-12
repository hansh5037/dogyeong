window.component = window.component || {};
window.component.overview = (function () {
	let els = {},
		CAROUSEL = window.component.commonCarousel;
	
	const init = function () {
		els.section = document.querySelector('.component-overview');

		if (!els.section) return
		setElements();
		bindEvents();
	};

	const setElements = function () {
		els.carouselContainer = els.section.querySelector('.js-carousel');
		els.slideNum = els.section.querySelector('.js-slide-num');
		els.slideHeadline = els.section.querySelector('.js-slide-headline');
		els.slide = els.section.querySelectorAll('.js-carousel-slide');
	};

	const bindEvents = function () {
		eventList.setCarousel();
	};

	const eventHandler = {};

	const eventList = {
		setCarousel: function () {
			const myCarousel = new CAROUSEL({
				container: els.carouselContainer,
				onInit: function () {
					console.log('Carousel ready!')
				},
				onSlideChange: function (index) {
					const slideTitle = els.slide[index].querySelector(
						'.js-slide-title > .blind').innerText;
					const slideNum = slideTitle.substring(0, 4);
					const slideHeadline = slideTitle.substring(6);

					const nobullets = els.section.querySelectorAll('.js-carousel-bullet:not(.is-active)');
					nobullets.forEach(nobullet => {
						nobullet.textContent = '';
					});
					setTimeout(() => {
						const bullets = els.section.querySelectorAll('.js-carousel-bullet');
						if (bullets[index].classList.contains('is-active')) {
							bullets[index].innerText = slideNum;
						}
						els.slideNum.innerText = slideNum;
						els.slideHeadline.innerText = slideHeadline;
					}, 500);
				}
			});
			myCarousel.init();
		}
	};

	return {
		init: init
	};

})();