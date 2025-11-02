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

				if (els.section) {
					setElements();
					bindEvents();

					if (typeof options.onInit === 'function') {
						options.onInit();
					}
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
				if (els.carouselPagination) {
					carouselEventList.setPagination();
				}
				carouselEventList.slideChange();
				eventHandler.on();
			};

			const eventHandler = {
				onNextClick: null,
				onPrevClick: null,
				onPagClick: null,

				on: function () {
					// click
					if (els.carouselNextArrow) {
						this.onNextClick = function (event) {
							carouselEventList.onArrowClick(event);
						};
						els.carouselNextArrow.addEventListener('click', this.onNextClick);
					}
					if (els.carouselPrevArrow) {
						this.onPrevClick = function (event) {
							carouselEventList.onArrowClick(event);
						};
						els.carouselPrevArrow.addEventListener('click', this.onPrevClick);
					}
					if (els.carouselPagination) {
						this.onPagClick = function (event) {
							carouselEventList.onBulletClick(event);
						};
						els.carouselPagination.addEventListener('click', this.onPagClick);
					}

					// drag 
                    els.carouselWrap.addEventListener('pointerdown', dragEventList.dragStart, {passive: false});
					window.addEventListener('pointermove', dragEventList.dragMove);
					window.addEventListener('pointerup', dragEventList.dragEnd);
					window.addEventListener('pointercancel', dragEventList.dragEnd);
				},
				off: function () {
					if (els.carouselNextArrow) {
						els.carouselNextArrow.removeEventListener('click', this.onNextClick);
						this.onNextClick = null;
					}
					if (els.carouselPrevArrow) {
						els.carouselPrevArrow.removeEventListener('click', this.onPrevClick);
						this.onPrevClick = null;
					}
					if (els.carouselPagination) {
						els.carouselPagination.removeEventListener('click', this.onPagClick);
						this.onPagClick = null;
					}

					// drag
                    els.carouselWrap.removeEventListener('pointerdown', dragEventList.dragStart);
					window.removeEventListener('pointermove', dragEventList.dragMove);
					window.removeEventListener('pointerup', dragEventList.dragEnd);
					window.removeEventListener('pointercancel', dragEventList.dragEnd);
				}
			};

			const carouselEventList = {
				setPagination: function () {
					for (let i = 0; i < els.carouselSlides.length; i++) {
						const bulletButtonWrap = document.createElement('li');
						const bulletButton = document.createElement('button');
						bulletButton.type = 'button';
						bulletButton.className = `component-carousel__bullet${i === 0 ? ' is-active' : ''}`;
						bulletButton.setAttribute('aria-label', i+1 +'/'+els.carouselSlides.length);
						
						els.carouselPagination.append(bulletButtonWrap);
						bulletButtonWrap.append(bulletButton);
					}
					els.carouselPaginationBullet = els.carouselPagination.querySelectorAll('.component-carousel__bullet');
				},
				slideChange: function () {
					if (els.carouselPagination) {
						carouselEventList.toggleActiveClass(els.carouselPaginationBullet);
						accessibility.activeCurrentBullet();
					}
					if (els.carouselNavigation) {
						accessibility.updateDisabledArrow();
					}

					carouselEventList.toggleActiveClass(els.carouselSlides);
					carouselEventList.moveToTransform();
					accessibility.activeSlideAcc();

					if (typeof options.onSlideChange === 'function') {
						options.onSlideChange(activeIndex);
					}
				},
				onArrowClick: function (event) {
					const isNext = event.target === els.carouselNextArrow;
					const isPrev = event.target === els.carouselPrevArrow;
					const lastIndex = els.carouselSlides.length - 1;

					let nextIndex = activeIndex;
					if (isNext) {
						nextIndex += 1;
					} else if (isPrev) {
						nextIndex -= 1;
					}

					if (nextIndex < 0 || nextIndex > lastIndex) return;
					activeIndex = nextIndex;

					carouselEventList.slideChange();
				},
				onBulletClick: function (event) {
					const clickedBullet = event.target.closest('.component-carousel__bullet');
					const clickBulletIndex = Array.prototype.indexOf.call(
						els.carouselPaginationBullet,
						clickedBullet
					);

					if (!clickedBullet || clickBulletIndex < 0) return;
					activeIndex = clickBulletIndex;

					carouselEventList.slideChange();
				},
				moveToTransform: function () {
					let wrapperRect = els.carouselWrap.getBoundingClientRect().left;
					let activeSlideRect = els.carouselSlides[activeIndex]
						.getBoundingClientRect().left;
					let rect = activeSlideRect - wrapperRect;

					els.carouselWrap.style.transform = `translateX(-${rect}px)`;
					return rect;
				},
				toggleActiveClass: function (list) {
					for (let i = 0; i < list.length; i++) {
						list[i].classList.toggle('is-active', i === activeIndex);
					};
				}
			};

			const dragEventList = {
				dragStart: function (event) {
					if (!event.isPrimary) return;
					drag.isDown = true;
					drag.startX = event.clientX;
					drag.startPosition = carouselEventList.moveToTransform();

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
							carouselEventList.slideChange();
						};
					};

					carouselEventList.moveToTransform();
					drag.deltaX = 0;
				}
			};

			const accessibility = {
				updateDisabledArrow: function () {
					const activeFirstSlide = 0 === activeIndex;
					const activeLastSlide = els.carouselSlides.length - 1 === activeIndex;

					els.carouselPrevArrow.setAttribute('aria-disabled', activeFirstSlide ? 'true' : 'false');
					els.carouselNextArrow.setAttribute('aria-disabled', activeLastSlide ? 'true' : 'false');
				},
				activeCurrentBullet: function () {
					for (let i = 0; i < els.carouselPaginationBullet.length; i++) {
						els.carouselPaginationBullet[i].setAttribute('aria-selected', i === activeIndex ? 'true' : 'false');
					};
				},
				activeSlideAcc: function () {
					for (let i = 0; i < els.carouselSlides.length; i++) {
						els.carouselSlides[i].setAttribute('aria-hidden', i === activeIndex ? 'false' : 'true');
						els.carouselSlides[i].setAttribute('tabindex', i === activeIndex ? '0' : '-1');
					};
				}
			};

			const destroy = function () {
				eventHandler.off();
				els.carouselWrap.style.transform = '';
				for (let i = 0; i < els.carouselSlides.length; i++) {
					els.carouselSlides[i].classList.remove('is-active');
				};
				if (els.carouselPagination) {
					for (let i = 0; i < els.carouselPaginationBullet.length; i++) {
						els.carouselPaginationBullet[i].classList.remove('is-active');
					}
				};
				if (els.carouselNavigation) {
					els.carouselNextArrow.removeAttribute('disabled');
					els.carouselPrevArrow.removeAttribute('disabled');
				};
				if (els.carouselPagination) els.carouselPagination.innerHTML = '';
				activeIndex = 0;
				els.carouselPaginationBullet = null;
				drag.isDown = false;
				drag.deltaX = 0;
			};

			return {
				init: init,
				destroy: destroy
			};
		}
	}
	return CAROUSEL;
})();