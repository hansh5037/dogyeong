window.component = window.component || {};
window.component.carousel = (function () {
	let els = {},
		activeIndex = 0,
		drag = {
			isDown: false,
			startX: 0,
			deltaX: 0,
			startPosition: 0,
			direction: null
		};

	const init = function () {
		els.section = document.querySelector('.js-carousel');

		if (!!els.section) {
			setElements();
			bindEvents();
		}
	};

	const setElements = function () {
		els.carouselWrap = els.section.querySelector('.js-carousel-wrap');
		els.carouselSlides = els.section.querySelectorAll('.js-carousel-slide');
		els.carouselNavigation = els.section.querySelector('.js-carousel-navigation');
		els.carouselArrows = els.section.querySelectorAll('.js-carousel-arrow');
		els.carouselNextArrow = els.section.querySelector('.js-carousel-next');
		els.carouselPrevArrow = els.section.querySelector('.js-carousel-prev');
		els.carouselPagination = els.section.querySelector('.js-carousel-pagination');
		els.carouselPaginationBullet = null;
	};

	const bindEvents = function () {
		if (!!els.carouselPagination) {
			eventList.setPagination();
		}
		eventHandler.click();
		eventHandler.drag();
	};

	const eventHandler = {
		click: function () {
			if (!!els.carouselNavigation) {
				els.carouselArrows.forEach(carouselArrow => {
					carouselArrow.addEventListener('click', function (event) {
						eventList.slideChange(event);
					});
				});
			}
			if (!!els.carouselPagination) {
				els.carouselPagination.addEventListener('click', function (event) {
					eventList.slideChange(event);
				});
			}
		},
		drag: function () {
			els.carouselWrap.addEventListener('pointerdown', eventList.dragStart, { passive: false });
			window.addEventListener('pointermove', eventList.dragMove, { passive: false });
			window.addEventListener('pointerup', eventList.dragEnd);
			window.addEventListener('pointercancel', eventList.dragEnd);
		}
	};

	const eventList = {
		slideChange: function (event) {
			if (!!els.carouselPagination) eventList.onBulletClick(event);
			if (!!els.carouselNavigation) eventList.onArrowClick(event);
			if (!!els.carouselPagination) eventList.toggleActiveClass(els.carouselPaginationBullet);
			if (!!els.carouselNavigation) eventList.updateDisabledArrow();

			eventList.toggleActiveClass(els.carouselSlides);
			eventList.moveToTransform();
		},
		onArrowClick: function (event) {
			const isNext = event.target === els.carouselNextArrow;
			const isPrev = event.target === els.carouselPrevArrow;
			const lastIndex = els.carouselSlides.length - 1;
			
			let nextIndex = activeIndex;
			if (isNext) nextIndex += 1;
			else if (isPrev) nextIndex -= 1;

			if (nextIndex < 0 || nextIndex > lastIndex) return;
			activeIndex = nextIndex;
		},
		onBulletClick: function (event) {
			const isBullet = event.target.closest('.component-carousel__bullet');
			const clickBulletIndex = [...els.carouselPaginationBullet].findIndex(function (index) {
				return index === isBullet;
			});

			if (!isBullet) return;
			activeIndex = clickBulletIndex;
		},
		moveToTransform: function () {
			let wrapperRect = els.carouselWrap.getBoundingClientRect().left;
			let activeSlideRect = els.carouselSlides[activeIndex].getBoundingClientRect().left;
			let rect = activeSlideRect - wrapperRect;

			els.carouselWrap.style.transform = `translateX(-${rect}px)`
		},
		updateDisabledArrow: function () {
			const activeFirstSlide = 0 === activeIndex;
			const activeLastSlide = els.carouselSlides.length - 1 === activeIndex;

			els.carouselPrevArrow.toggleAttribute('disabled', !!activeFirstSlide);
			els.carouselNextArrow.toggleAttribute('disabled', !!activeLastSlide);
		},
		setPagination: function () {
			for (let i = 0; i < els.carouselSlides.length; i++) {
				const bulletButton = document.createElement('button');
				bulletButton.type = 'button';
				bulletButton.className = `component-carousel__bullet${i === 0 ? ' is-active' : ''}`;

				els.carouselPagination.append(bulletButton);
			}
			els.carouselPaginationBullet = els.carouselPagination.querySelectorAll('.component-carousel__bullet');
		},
		toggleActiveClass: function (list) {
			for (let i = 0; i < list.length; i++) {
				list[i].classList.toggle('is-active', i === activeIndex);
			}
		},
		dragStart: function (event) {
			drag.isDown = true;
			drag.startX = event.clientX;

			const wrapperLeft = els.carouselWrap.getBoundingClientRect().left;
			const activeLeft  = els.carouselSlides[activeIndex].getBoundingClientRect().left;
			drag.startPosition = activeLeft - wrapperLeft;

			if (els.carouselWrap.setPointerCapture && event.pointerId != null) {
				els.carouselWrap.setPointerCapture(event.pointerId);
			}
			event.preventDefault();
		},
		dragMove: function (event) {
			if (!drag.isDown) return;
			const dragX = event.clientX - drag.startX;

			drag.deltaX = dragX;

			const currentOffset = drag.startPosition - dragX;
			els.carouselWrap.style.transform = `translateX(-${currentOffset}px)`;
		},
		dragEnd: function () {
			if (!drag.isDown) return;
			drag.isDown = false;

			const microSwipPx = 40;
			const microSlideRatio = 0.2;
			const slideWidth = els.carouselSlides[activeIndex].getBoundingClientRect().width;
			const threshold = Math.max(microSwipPx, slideWidth * microSlideRatio);

			if (Math.abs(drag.deltaX) >= threshold) {
				const last = els.carouselSlides.length - 1;
				let next = activeIndex + (drag.deltaX < 0 ? 1 : -1);
				next = Math.max(0, Math.min(last, next));
				if (next !== activeIndex) {
					activeIndex = next;
					eventList.toggleActiveClass(els.carouselSlides);
					if (!!els.carouselPagination) eventList.toggleActiveClass(els.carouselPaginationBullet);
					if (!!els.carouselNavigation) eventList.updateDisabledArrow();
				}
			}

			eventList.moveToTransform();
			drag.deltaX = 0;
		}
	};

	return {
		init: init
	};

})();
