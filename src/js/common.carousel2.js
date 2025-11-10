window.component = window.component || {};
window.component.commonCarousel = window.component.commonCarousel || {};
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
			onInit: opts.onInit ?? null,
			onSlideChange: opts.onSlideChange ?? null
		};
		console.log('1',this)
	};

	const fn = Carousel.prototype;

    fn.init = function () {
		console.log('2',this)
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
		console.log('3',this)
    	this.els.carouselWrap = this.els.section.querySelector('.js-carousel-wrap');
    	this.els.carouselSlides = this.els.section.querySelectorAll('.js-carousel-slide');
    	this.els.carouselNavigation = this.els.section.querySelector('.js-carousel-navigation');
    	this.els.carouselNextArrow = this.els.section.querySelector('.js-carousel-next');
    	this.els.carouselPrevArrow = this.els.section.querySelector('.js-carousel-prev');
    	this.els.carouselPagination = this.els.section.querySelector('.js-carousel-pagination');
    	this.els.carouselPaginationBullet = null;
    };

    fn.setProperty = function () {
		console.log('4',this)
    	this.els.lastIndex = this.els.carouselSlides.length - 1;
    	this.els.slideRect = this.els.carouselSlides[this.activeIndex].getBoundingClientRect();
    	this.els.slideWidth = this.els.slideRect.width;
    };

    fn.bindEvents = function () {
		console.log('5',this)
    	if (this.els.carouselPagination) {
    		this.carouselEventList.setPagination.call(this);
    	}
    	this.carouselEventList.slideChange.call(this);
    	this.eventHandler.on.call(this);
    };

    fn.eventHandler = {
    	on: function () {
    		// click
    		if (this.els.carouselNextArrow) {
    			this.els.carouselNextArrow.addEventListener('click', function arrowNext () {
					this.clickEventList.onArrowClick.call(this)
				});
    		}
    		if (this.els.carouselPrevArrow) {
    			this.els.carouselPrevArrow.addEventListener('click', function arrowPrev () {
					this.clickEventList.onArrowClick.call(this)
				});
    		}
    		if (this.els.carouselPagination) {
    			this.els.carouselPagination.addEventListener('click', function page () {
					this.clickEventList.onBulletClick.call(this)
				});
    		}

    		// drag 
    		this.els.carouselWrap.addEventListener('pointerdown', dragEventList.dragStart, {passive: false});
    		window.addEventListener('pointermove', dragEventList.dragMove);
    		window.addEventListener('pointerup', dragEventList.dragEnd);
    		window.addEventListener('pointercancel', dragEventList.dragEnd);
    	},
    	off: function () {
    		// click
    		if (this.els.carouselNextArrow) {
    			this.els.carouselNextArrow.removeEventListener('click', function arrowNext () {
					this.clickEventList.onArrowClick.call(this)
				});
    		}
    		if (this.els.carouselPrevArrow) {
    			this.els.carouselPrevArrow.removeEventListener('click', function arrowPrev () {
					this.clickEventList.onArrowClick.call(this)
				});
    		}
    		if (this.els.carouselPagination) {
    			this.els.carouselPagination.removeEventListener('click', function page () {
					this.clickEventList.onBulletClick.call(this)
				});
    		}

    		// drag
    		this.els.carouselWrap.removeEventListener('pointerdown', dragEventList.dragStart);
    		window.removeEventListener('pointermove', dragEventList.dragMove);
    		window.removeEventListener('pointerup', dragEventList.dragEnd);
    		window.removeEventListener('pointercancel', dragEventList.dragEnd);
    	}
    };

    fn.carouselEventList = {
    	setPagination: function () {
    		for (let i = 0; i < this.els.carouselSlides.length; i++) {
    			const bulletButtonWrap = document.createElement('li');
    			const bulletButton = document.createElement('button');
    			bulletButton.type = 'button';
    			bulletButton.className = `js-carousel-bullet${i === 0 ? ' is-active' : ''}`;
    			bulletButton.setAttribute('aria-label', i+1 +'/'+this.els.carouselSlides.length);

    			this.els.carouselPagination.append(bulletButtonWrap);
    			bulletButtonWrap.append(bulletButton);
    		}
    		this.els.carouselPaginationBullet = this.els.carouselPagination.querySelectorAll('.js-carousel-bullet');
    	},
    	moveToTransform: function () {
    		let wrapperRect = this.els.carouselWrap.getBoundingClientRect().left;
    		let activeSlideRect = this.els.carouselSlides[activeIndex].getBoundingClientRect().left;
    		let rect = activeSlideRect - wrapperRect;

    		this.els.carouselWrap.style.transform = `translateX(-${rect}px)`;
    		return rect;
    	},
    	toggleActiveClass: function (list) {
    		for (let i = 0; i < list.length; i++) {
    			list[i].classList.toggle('is-active', i === activeIndex);
    		};
    	},
    	slideChange: function () {
    		if (this.els.carouselPagination) {
    			carouselEventList.toggleActiveClass(this.els.carouselPaginationBullet);
    			accessibility.activeCurrentBullet();
    		}
    		if (this.els.carouselNavigation) {
    			accessibility.updateDisabledArrow();
    		}

    		carouselEventList.toggleActiveClass(this.els.carouselSlides);
    		carouselEventList.moveToTransform();
    		accessibility.activeSlideAcc();

    		if (typeof options.onSlideChange === 'function') {
    			options.onSlideChange(activeIndex);
    		}
    	}
    };

    fn.clickEventList = {
    	onArrowClick: function (event) {
    		const isNext = event.currentTarget === this.els.carouselNextArrow;
    		const isPrev = event.currentTarget === this.els.carouselPrevArrow;

    		let nextIndex = activeIndex;
    		if (isNext) {
    			nextIndex += 1;
    		} else if (isPrev) {
    			nextIndex -= 1;
    		}

    		if (nextIndex < 0 || nextIndex > this.els.lastIndex) return;
    		activeIndex = nextIndex;

    		carouselEventList.slideChange();
    	},
    	onBulletClick: function (event) {
    		const clickedBullet = event.target.closest('.js-carousel-bullet');
    		const clickBulletIndex = [...this.els.carouselPaginationBullet].indexOf(clickedBullet);

    		if (!clickedBullet || clickBulletIndex < 0) return;
    		activeIndex = clickBulletIndex;

    		carouselEventList.slideChange();
    	}				
    };

    fn.dragEventList = {
    	dragStart: function (event) {
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
    		this.els.carouselWrap.style.transform = `translateX(-${currentOffset}px)`;
    	},
    	dragEnd: function () {
    		if (!drag.isDown) return;
    		drag.isDown = false;

    		const microSlideRatio = 30 / 100;
    		const threshold = this.els.slideWidth * microSlideRatio;

    		if (Math.abs(drag.deltaX) >= threshold) {
    			let next = activeIndex + (drag.deltaX < 0 ? 1 : -1);

    			if (next <= this.els.lastIndex && next >= 0) {
    				if (next !== activeIndex) {
    					activeIndex = next;
    				};
    				carouselEventList.slideChange();
    			}
    		}
    		carouselEventList.moveToTransform();
    		drag.deltaX = 0;
    	}
    };

    fn.accessibility = {
    	updateDisabledArrow: function () {
    		const activeFirstSlide = 0 === activeIndex;
    		const activeLastSlide = this.els.lastIndex === activeIndex;

    		this.els.carouselPrevArrow.setAttribute('aria-disabled', activeFirstSlide ? 'true' : 'false');
    		this.els.carouselNextArrow.setAttribute('aria-disabled', activeLastSlide ? 'true' : 'false');
    	},
    	activeCurrentBullet: function () {
    		for (let i = 0; i < this.els.carouselPaginationBullet.length; i++) {
    			this.els.carouselPaginationBullet[i].setAttribute('aria-selected', i === activeIndex ? 'true' : 'false');
    		};
    	},
    	activeSlideAcc: function () {
    		for (let i = 0; i < this.els.carouselSlides.length; i++) {
    			this.els.carouselSlides[i].setAttribute('aria-hidden', i === activeIndex ? 'false' : 'true');
    			this.els.carouselSlides[i].setAttribute('tabindex', i === activeIndex ? '0' : '-1');
    		};
    	}
    };

    fn.destroy = function () {
    	eventHandler.off();
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
    	activeIndex = 0;
    	this.els.carouselPaginationBullet = null;
    	drag.isDown = false;
    	drag.deltaX = 0;
    };

	return Carousel;
})();
