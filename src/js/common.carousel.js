window.component = window.component || {};
window.component.commonCarousel = (function () {

	function Carousel(opts = {}) {
		this.els = {};
		this.activeIndex = 0;
		this.drag = {
			isDown: false,
			startX: 0,
			deltaX: 0,
			startPosition: 0
		};
		this.options = {
			container: opts.container ?? null,
			loop: opts.loop ?? false,
			onInit: opts.onInit ?? null,
			onSlideChange: opts.onSlideChange ?? null
		};
	};

	const fn = Carousel.prototype;

	fn.init = function () {
		this.els.section = this.options.container;

		if (!this.els.section) return;
		this.setElements();
		this.setProperty();
		this.bindEvents();

		if (typeof this.options.onInit === 'function') {
			this.options.onInit();
		}
	};

	fn.setElements = function () {
		this.els.carouselWrap = this.els.section.querySelector('.js-carousel-wrap');
		this.els.carouselSlides = this.els.section.querySelectorAll('.js-carousel-slide');
		this.els.carouselNavigation = this.els.section.querySelector('.js-carousel-navigation');
		this.els.carouselNextArrow = this.els.section.querySelector('.js-carousel-next');
		this.els.carouselPrevArrow = this.els.section.querySelector('.js-carousel-prev');
		this.els.carouselPagination = this.els.section.querySelector('.js-carousel-pagination');
		this.els.carouselPaginationBullet = null;
	};

	fn.setProperty = function () {
		this.els.slideArray = [...this.els.carouselSlides];
		this.els.lastIndex = this.els.carouselSlides.length - 1;
		this.els.slideRect = this.els.carouselSlides[this.activeIndex].getBoundingClientRect();
		this.els.slideWidth = this.els.slideRect.width;
	};

	fn.bindEvents = function () {
		if (this.els.carouselPagination) {
			this.carouselEventList.setPagination.call(this);
		}
		if (this.options.loop) {
			this.carouselEventList.setLoopSlide.call(this);
		}
		this.carouselEventList.slideChange.call(this);
		this.eventHandler.on.call(this);
	};

	fn.eventHandler = {
		on: function () {
			if (this.handler) return;
			// bind
			this.handler = {
				arrowClick: this.clickEventList.onArrowClick.bind(this),
				bulletClick: this.clickEventList.onBulletClick.bind(this),
				dragStart: this.dragEventList.onDragStart.bind(this),
				dragMove: this.dragEventList.onDragMove.bind(this),
				dragEnd: this.dragEventList.onDragEnd.bind(this)
			}

			// click
			this.els.carouselNextArrow?.addEventListener('click', this.handler.arrowClick);
			this.els.carouselPrevArrow?.addEventListener('click', this.handler.arrowClick);
			this.els.carouselPagination?.addEventListener('click', this.handler.bulletClick);

			// drag 
			this.els.carouselWrap.addEventListener('pointerdown', this.handler.dragStart), {passive:false};
			window.addEventListener('pointermove', this.handler.dragMove);
			window.addEventListener('pointerup', this.handler.dragEnd);
			window.addEventListener('pointercancel', this.handler.dragEnd);
		},
		off: function () {
			if (!this.handler) return;
			// click
			this.els.carouselNextArrow?.removeEventListener('click', this.handler.arrowClick);
			this.els.carouselPrevArrow?.removeEventListener('click', this.handler.arrowClick);
			this.els.carouselPagination?.removeEventListener('click', this.handler.bulletClick);

			// drag
			this.els.carouselWrap.removeEventListener('pointerdown', this.handler.dragStart);
			window.removeEventListener('pointermove', this.handler.dragMove);
			window.removeEventListener('pointerup', this.handler.dragEnd);
			window.removeEventListener('pointercancel', this.handler.dragEnd);

			this.handler = null
		}
	};

	fn.carouselEventList = {
		setPagination: function () {
			for (let i = 0; i < this.els.carouselSlides.length; i++) {
				const bulletButtonWrap = document.createElement('li');
				const bulletButton = document.createElement('button');
				bulletButton.type = 'button';
				bulletButton.className = `js-carousel-bullet${i === 0 ? ' is-active' : ''}`;
				bulletButton.setAttribute('aria-label', i + 1 + '/' + this.els.carouselSlides.length);

				this.els.carouselPagination.append(bulletButtonWrap);
				bulletButtonWrap.append(bulletButton);
			}
			this.els.carouselPaginationBullet = this.els.carouselPagination.querySelectorAll('.js-carousel-bullet');
		},
		moveToTransform: function () {
			let wrapperRect = this.els.carouselWrap.getBoundingClientRect().left;
			let activeSlideRect = this.els.carouselSlides[this.activeIndex].getBoundingClientRect().left;
			let rect = activeSlideRect - wrapperRect;

			this.els.carouselWrap.style.transform = `translateX(-${rect}px)`;
			return rect;
		},
		toggleActiveClass: function (list) {
			for (let i = 0; i < list.length; i++) {
				list[i].classList.toggle('is-active', i === this.activeIndex);
			};
		},
		slideChange: function () {

			if (this.els.carouselPagination) {
				this.carouselEventList.toggleActiveClass.call(this, this.els.carouselPaginationBullet);
				this.accessibility.activeCurrentBullet.call(this);
			}
			if (this.els.carouselNavigation && !this.options.loop) {
				this.accessibility.updateDisabledArrow.call(this);
			}

			this.carouselEventList.toggleActiveClass.call(this, this.els.carouselSlides);
			this.carouselEventList.moveToTransform.call(this);
			this.accessibility.activeSlideAcc.call(this);

			if (typeof this.options.onSlideChange === 'function') {
				this.options.onSlideChange(this.activeIndex);
			}
		},
		setLoopSlide: function () {
			const slideArray = this.els.slideArray,
				lastIndex = this.els.lastIndex,
				carouselWrap = this.els.carouselWrap;

			const clones = [
				slideArray[lastIndex].cloneNode(true),
				slideArray[lastIndex - 1].cloneNode(true),
				slideArray[0].cloneNode(true),
				slideArray[1].cloneNode(true)
			];

			clones.forEach(clone => {
				clone.setAttribute('aria-hidden', true);
				clone.setAttribute('tabindex', '-1');
			});

			carouselWrap.prepend(clones[0], clones[1]);
			carouselWrap.append(clones[2], clones[3]);

			this.els.loopClonePrev = clones[1];
			this.els.loopCloneNext = clones[2];
		},
		moveToClone: function (type) {
			const wrap = this.els.carouselWrap;
			const target = type === 'next' ? this.els.loopCloneNext : this.els.loopClonePrev;
			
			const wrapperRect = wrap.getBoundingClientRect().left;
			const targetRect = target.getBoundingClientRect().left;
			const diff = targetRect - wrapperRect;
			
			wrap.style.transform = `translateX(-${diff}px)`;
		}
	};

	fn.clickEventList = {
		onArrowClick: function (event) {
			const isNext = event.currentTarget === this.els.carouselNextArrow;
			const isPrev = event.currentTarget === this.els.carouselPrevArrow;

			let nextIndex = this.activeIndex;

			if (isNext) {
				nextIndex += 1;
			} else if (isPrev) {
				nextIndex -= 1;
			}

			const last = this.els.lastIndex;
			const firstToLast = nextIndex < 0;
			const lastToFirst = nextIndex > last;

			if (this.options.loop) {

				if (firstToLast || lastToFirst) {
					const prevTransition = this.els.carouselWrap.style.transition;

					this.els.carouselWrap.style.transition = '';
					this.carouselEventList.moveToClone.call(this, firstToLast? 'prev' : 'next');
					setTimeout(() => {
						this.els.carouselWrap.style.transition = 'none';
						this.activeIndex = lastToFirst ? 0 : last;
						this.carouselEventList.slideChange.call(this);

						this.els.carouselWrap.offsetHeight;
						this.els.carouselWrap.style.transition = prevTransition;
					}, 600);

					this.drag.deltaX = 0;
					return;
				};

			} else if (nextIndex < 0 || nextIndex > last) return;

			this.activeIndex = nextIndex;
			this.carouselEventList.slideChange.call(this);
		},
		onBulletClick: function (event) {
			const clickedBullet = event.target.closest('.js-carousel-bullet');
			const clickBulletIndex = [...this.els.carouselPaginationBullet].indexOf(clickedBullet);

			if (!clickedBullet || clickBulletIndex < 0) return;
			this.activeIndex = clickBulletIndex;

			this.carouselEventList.slideChange.call(this);
		}
	};

	fn.dragEventList = {
		onDragStart: function (event) {
			this.drag.isDown = true;
			this.drag.startX = event.clientX;
			this.drag.startPosition = this.carouselEventList.moveToTransform.call(this);

			event.preventDefault();
		},
		onDragMove: function (event) {
			if (!this.drag.isDown) return;
			const dragX = event.clientX - this.drag.startX;

			this.drag.deltaX = dragX;

			const currentOffset = this.drag.startPosition - dragX;
			this.els.carouselWrap.style.transform = `translateX(-${currentOffset}px)`;
		},
		onDragEnd: function () {
			if (!this.drag.isDown) return;
			this.drag.isDown = false;

			const microSlideRatio = 30 / 100;
			const threshold = this.els.slideWidth * microSlideRatio;

			if (Math.abs(this.drag.deltaX) >= threshold) {
				const dir = this.drag.deltaX < 0 ? 1 : -1; // 왼쪽 드래그 → 다음(+1)
				let next = this.activeIndex + dir;
				const last = this.els.lastIndex;
				const lastToFirst = dir === 1 && this.activeIndex === last;
				const firstToLast = dir === -1 && this.activeIndex === 0;

				if (this.options.loop) {

					if (firstToLast || lastToFirst) {
						const prevTransition = this.els.carouselWrap.style.transition;

						this.els.carouselWrap.style.transition = '';
						this.carouselEventList.moveToClone.call(this, firstToLast? 'prev' : 'next');
						setTimeout(() => {
							this.els.carouselWrap.style.transition = 'none';
							this.activeIndex = lastToFirst ? 0 : last;
							this.carouselEventList.slideChange.call(this);

							this.els.carouselWrap.offsetHeight;
							this.els.carouselWrap.style.transition = prevTransition;
						}, 600);

						this.drag.deltaX = 0;
						return;
					};

				} else if (next < 0 || next > last) {
					this.carouselEventList.moveToTransform.call(this);
					this.drag.deltaX = 0;
					return;
				}

				if (next !== this.activeIndex) {
					this.activeIndex = next;
					this.carouselEventList.slideChange.call(this);
				}
			}

			this.carouselEventList.moveToTransform.call(this);
			this.drag.deltaX = 0;
		}
	};

	fn.accessibility = {
		updateDisabledArrow: function () {
			const activeFirstSlide = 0 === this.activeIndex;
			const activeLastSlide = this.els.lastIndex === this.activeIndex;

			this.els.carouselPrevArrow.setAttribute('aria-disabled', activeFirstSlide ? 'true' : 'false');
			this.els.carouselNextArrow.setAttribute('aria-disabled', activeLastSlide ? 'true' : 'false');
		},
		activeCurrentBullet: function () {
			for (let i = 0; i < this.els.carouselPaginationBullet.length; i++) {
				this.els.carouselPaginationBullet[i].setAttribute('aria-selected', i === this.activeIndex ? 'true' : 'false');
			};
		},
		activeSlideAcc: function () {
			for (let i = 0; i < this.els.carouselSlides.length; i++) {
				this.els.carouselSlides[i].setAttribute('aria-hidden', i === this.activeIndex ? 'false' : 'true');
				this.els.carouselSlides[i].setAttribute('tabindex', i === this.activeIndex ? '0' : '-1');
			};
		}
	};

	fn.destroy = function () {
		this.eventHandler.off.call(this)
		this.els.carouselWrap.style.transform = '';
		for (let i = 0; i < this.els.carouselSlides.length; i++) {
			this.els.carouselSlides[i].classList.remove('is-active');
		};
		if (this.els.carouselPagination) {
			for (let i = 0; i < this.els.carouselPaginationBullet.length; i++) {
				this.els.carouselPaginationBullet[i].classList.remove('is-active');
			}
		};
		if (this.els.carouselNavigation) {
			this.els.carouselNextArrow.removeAttribute('aria-disabled');
			this.els.carouselPrevArrow.removeAttribute('aria-disabled');
		};
		if (this.els.carouselPagination) this.els.carouselPagination.innerHTML = '';
		this.activeIndex = 0;
		this.els.carouselPaginationBullet = null;
		this.drag.isDown = false;
		this.drag.deltaX = 0;
	};

	return Carousel;
})();