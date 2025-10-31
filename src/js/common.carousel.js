window.component = window.component || {};
window.component.commonCarousel = (function () {
	const CAROUSEL = {
		create: function (opts = {}) {
			let els = {},
				activeIndex = 0,
				drag = {
					isDown: false,
					startX: 0,
					deltaX: 0,
					startPosition: 0
				};

			const options = {
				container: opts.container ?? null,
				onInit: opts.onInit ?? null,
				onSlideChange: opts.onSlideChange ?? null
			};

			const init = function () {
				els.section = options.container;

				if (!!els.section) {
					setElements();
					if (!!els.carouselPagination) eventList.setPagination();
					bindEvents();
					eventList.setInitialUi();

					if (typeof options.onInit === 'function') options.onInit();
				}
			};

			const setElements = function () {
				els.carouselWrap = els.section.querySelector('.js-carousel-wrap');
				els.carouselSlides = els.section.querySelectorAll('.js-carousel-slide');
				els.carouselNavigation = els.section.querySelector('.js-carousel-navigation');
				els.carouselNextArrow = els.section.querySelector('.js-carousel-next');
				els.carouselPrevArrow = els.section.querySelector('.js-carousel-prev');
				els.carouselPagination = els.section.querySelector('.js-carousel-pagination');
				els.carouselPaginationBullet = null;
			};

			const bindEvents = function () {
				eventHandler.on();
			};

			const eventHandler = {
				onNextClick: null,
				onPrevClick: null,
				onPagClick: null,

				on: function () {
					// click
					if (!!els.carouselNextArrow) {
						this.onNextClick = function (event) {
							eventList.onArrowClick(event);
						};
						els.carouselNextArrow.addEventListener('click', this.onNextClick);
					}
					if (!!els.carouselPrevArrow) {
						this.onPrevClick = function (event) {
							eventList.onArrowClick(event);
						};
						els.carouselPrevArrow.addEventListener('click', this.onPrevClick);
					}
					if (!!els.carouselPagination) {
						this.onPagClick = function (event) {
							eventList.onBulletClick(event);
						};
						els.carouselPagination.addEventListener('click', this.onPagClick);
					}

					// drag 
					els.carouselWrap.addEventListener('pointerdown', eventList.dragStart);
					window.addEventListener('pointermove', eventList.dragMove);
					window.addEventListener('pointerup', eventList.dragEnd);
					window.addEventListener('pointercancel', eventList.dragEnd);
				},
				off: function () {
					if (els.carouselNextArrow && this.onNextClick) {
						els.carouselNextArrow.removeEventListener('click', this.onNextClick);
						this.onNextClick = null;
					}
					if (els.carouselPrevArrow && this.onPrevClick) {
						els.carouselPrevArrow.removeEventListener('click', this.onPrevClick);
						this.onPrevClick = null;
					}
					if (els.carouselPagination && this.onPagClick) {
						els.carouselPagination.removeEventListener('click', this.onPagClick);
						this.onPagClick = null;
					}

					// drag
					if (els.carouselWrap) {
						els.carouselWrap.removeEventListener('pointerdown', eventList.dragStart);
					}
					window.removeEventListener('pointermove', eventList.dragMove);
					window.removeEventListener('pointerup', eventList.dragEnd);
					window.removeEventListener('pointercancel', eventList.dragEnd);
				}
			};


			const eventList = {
				slideChange: function () {
					if (!!els.carouselPagination) eventList.toggleActiveClass(els.carouselPaginationBullet);
					if (!!els.carouselNavigation) eventList.updateDisabledArrow();

					eventList.toggleActiveClass(els.carouselSlides);
					eventList.moveToTransform();

					if (typeof options.onSlideChange === 'function') options.onSlideChange(activeIndex);
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

					eventList.slideChange();
				},
				onBulletClick: function (event) {
					const isBullet = event.target.closest('.component-carousel__bullet');
					const clickBulletIndex = [...els.carouselPaginationBullet].findIndex(function (index) {
						return index === isBullet;
					});

					if (!isBullet) return;
					activeIndex = clickBulletIndex;

					eventList.slideChange();
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
				toggleActiveClass: function (list) {
					for (let i = 0; i < list.length; i++) {
						list[i].classList.toggle('is-active', i === activeIndex);
					}
				},

				dragStart: function (event) {
					drag.isDown = true;
					drag.startX = event.clientX;

					const wrapperLeft = els.carouselWrap.getBoundingClientRect().left;
					const activeLeft = els.carouselSlides[activeIndex].getBoundingClientRect().left;
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
							eventList.slideChange();
						}
					}

					eventList.moveToTransform();
					drag.deltaX = 0;
				},

				setInitialUi: function () {
					if (!els.carouselSlides || els.carouselSlides.length === 0) return;
					this.toggleActiveClass(els.carouselSlides);
					if (els.carouselPagination) this.toggleActiveClass(els.carouselPaginationBullet || []);
					if (els.carouselNavigation) this.updateDisabledArrow();
					this.moveToTransform();
				},
				setPagination: function () {
					for (let i = 0; i < els.carouselSlides.length; i++) {
						const bulletButton = document.createElement('button');
						bulletButton.type = 'button';
						bulletButton.className = `component-carousel__bullet${i === 0 ? ' is-active' : ''}`;

						els.carouselPagination.append(bulletButton);
					}
					els.carouselPaginationBullet = els.carouselPagination.querySelectorAll(
						'.component-carousel__bullet');
				},
			};

			const destroy = function () {
				eventHandler.off();
				els.carouselWrap.style.transform = '';
				for (let i = 0; i < els.carouselSlides.length; i++) {
					els.carouselSlides[i].classList.remove('is-active');
				}
				if (els.carouselPagination) {
					for (let i = 0; i < els.carouselPaginationBullet.length; i++) {
						els.carouselPaginationBullet[i].classList.remove('is-active');
					}
				}
				if (els.carouselNavigation) {
					els.carouselNextArrow.removeAttribute('disabled');
					els.carouselPrevArrow.removeAttribute('disabled');
				}
				if (els.carouselPagination) els.carouselPagination.innerHTML = '';
				activeIndex = 0;
				els.carouselPaginationBullet = null;
				drag.isDown = false;
				drag.deltaX = 0;
				drag.pointerId = null;
				els = {};
			};

			return {
				init: init,
				destroy: destroy
			};
		}
	}
	return CAROUSEL;
})();