// src/js/common.resize.js
window.component = window.component || {};
window.component.commonResize = /* @__PURE__ */ (function() {
  let els = {};
  const init = function() {
    els.section = document.querySelector(".contents");
  };
  const resizeHandler = function(onRealResize) {
    let lastW = window.innerWidth;
    let lastH = window.visualViewport?.height ?? window.innerHeight;
    window.addEventListener("resize", function() {
      let w = window.innerWidth;
      let h = window.visualViewport?.height ?? window.innerHeight;
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
    init,
    resizeHandler
  };
})();

// src/js/common.fixed.js
window.component = window.component || {};
window.component.commonFixed = (function() {
  let els = {};
  let resize = window.component.commonResize.resizeHandler;
  const init = function() {
    els.section = document.querySelector(".contents");
    els.fixedTrack = els.section.querySelectorAll(".common-fixed-track");
    if (!!els.fixedTrack) {
      setElements();
      bindEvents();
    }
  };
  const setElements = function() {
    els.gnb = els.section.querySelector(".gnb");
  };
  const bindEvents = function() {
    eventslist.setTrack();
    eventHandler.resize();
  };
  const eventHandler = {
    resize: function() {
      resize(function() {
        eventslist.setTrack();
      });
    }
  };
  const eventslist = {
    setTrack: function() {
      for (let i = 0; i < els.fixedTrack.length; i++) {
        const trackHeight = Number(els.fixedTrack[i].getAttribute("data-track-height")) || 1;
        ;
        els.fixedTrack[i].style.height = window.innerHeight * trackHeight + "px";
      }
    },
    getProgress: function() {
      if (!els.fixedTrack) return;
      const viewPort = window.innerHeight;
      const viewPortTop = window.scrollY + els.gnb.offsetHeight;
      const viewPortBottom = window.scrollY + viewPort;
      for (let i = 0; i < els.fixedTrack.length; i++) {
        const elsTop = els.fixedTrack[i].offsetTop;
        const elsBottom = els.fixedTrack[i].offsetTop + els.fixedTrack[i].offsetHeight;
        const start = viewPortTop < elsTop;
        const end = viewPortBottom >= elsBottom;
        const trackInside = !start && !end;
        const usableVh = viewPort - (els.gnb && els.gnb.offsetHeight || 0);
        const trackH = elsBottom - elsTop;
        const denom = Math.max(1, trackH - usableVh);
        const t = (viewPortTop - elsTop) / denom;
        let progress = Math.max(0, Math.min(1, t));
        if (viewPortTop >= elsBottom - usableVh) progress = 1;
        return {
          viewPort,
          trackInside,
          progress
        };
      }
    },
    getDirection: function() {
      const s = this.getProgress();
      if (!s.trackInside) return;
      if (this.lastP == null) {
        this.lastP = s.progress;
        return;
      }
      const delta = s.progress - this.lastP;
      const dir = delta > 0 ? "down" : "up";
      this.lastP = s.progress;
      return dir;
    }
  };
  return {
    init,
    eventslist
  };
})();

// src/js/common.cursor.js
window.component = window.component || {};
window.component.commonCursor = /* @__PURE__ */ (function() {
  let els = {};
  const init = function() {
    els.section = document.querySelector(".cursor");
    if (!!els.section) {
      bindEvents();
    }
  };
  const bindEvents = function(event) {
    eventHandler.mouseMove();
  };
  const eventHandler = {
    mouseMove: function() {
      document.addEventListener("pointermove", function(event) {
        if (event.pointerType == "mouse") {
          eventsList.mousePosition(event);
        }
      });
    }
  };
  const eventsList = {
    mousePosition: function(event) {
      let x = event.clientX;
      let y = event.clientY;
      els.section.style.left = x + "px";
      els.section.style.top = y + "px";
    }
  };
  return {
    init
  };
})();

// src/js/common.carousel.js
window.component = window.component || {};
window.component.commonCarousel = (function() {
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
  }
  ;
  const fn = Carousel.prototype;
  fn.init = function() {
    this.els.section = this.options.container;
    if (!this.els.section) return;
    this.setElements();
    this.setProperty();
    this.bindEvents();
    if (typeof this.options.onInit === "function") {
      this.options.onInit();
    }
  };
  fn.setElements = function() {
    this.els.carouselWrap = this.els.section.querySelector(".js-carousel-wrap");
    this.els.carouselSlides = this.els.section.querySelectorAll(".js-carousel-slide");
    this.els.carouselNavigation = this.els.section.querySelector(".js-carousel-navigation");
    this.els.carouselNextArrow = this.els.section.querySelector(".js-carousel-next");
    this.els.carouselPrevArrow = this.els.section.querySelector(".js-carousel-prev");
    this.els.carouselPagination = this.els.section.querySelector(".js-carousel-pagination");
    this.els.carouselPaginationBullet = null;
  };
  fn.setProperty = function() {
    this.els.lastIndex = this.els.carouselSlides.length - 1;
    this.els.slideRect = this.els.carouselSlides[this.activeIndex].getBoundingClientRect();
    this.els.slideWidth = this.els.slideRect.width;
  };
  fn.bindEvents = function() {
    if (this.els.carouselPagination) {
      this.carouselEventList.setPagination.call(this);
    }
    this.carouselEventList.slideChange.call(this);
    this.eventHandler.on.call(this);
  };
  fn.eventHandler = {
    on: function() {
      if (this.handler) return;
      this.handler = {
        arrowClick: this.clickEventList.onArrowClick.bind(this),
        bulletClick: this.clickEventList.onBulletClick.bind(this),
        dragStart: this.dragEventList.onDragStart.bind(this),
        dragMove: this.dragEventList.onDragMove.bind(this),
        dragEnd: this.dragEventList.onDragEnd.bind(this)
      };
      this.els.carouselNextArrow?.addEventListener("click", this.handler.arrowClick);
      this.els.carouselPrevArrow?.addEventListener("click", this.handler.arrowClick);
      this.els.carouselPagination?.addEventListener("click", this.handler.bulletClick);
      this.els.carouselWrap.addEventListener("pointerdown", this.handler.dragStart), { passive: false };
      window.addEventListener("pointermove", this.handler.dragMove);
      window.addEventListener("pointerup", this.handler.dragEnd);
      window.addEventListener("pointercancel", this.handler.dragEnd);
    },
    off: function() {
      if (!this.handler) return;
      this.els.carouselNextArrow?.removeEventListener("click", this.handler.arrowClick);
      this.els.carouselPrevArrow?.removeEventListener("click", this.handler.arrowClick);
      this.els.carouselPagination?.removeEventListener("click", this.handler.bulletClick);
      this.els.carouselWrap.removeEventListener("pointerdown", this.handler.dragStart);
      window.removeEventListener("pointermove", this.handler.dragMove);
      window.removeEventListener("pointerup", this.handler.dragEnd);
      window.removeEventListener("pointercancel", this.handler.dragEnd);
      this.handler = null;
    }
  };
  fn.carouselEventList = {
    setPagination: function() {
      for (let i = 0; i < this.els.carouselSlides.length; i++) {
        const bulletButtonWrap = document.createElement("li");
        const bulletButton = document.createElement("button");
        bulletButton.type = "button";
        bulletButton.className = `js-carousel-bullet${i === 0 ? " is-active" : ""}`;
        bulletButton.setAttribute("aria-label", i + 1 + "/" + this.els.carouselSlides.length);
        this.els.carouselPagination.append(bulletButtonWrap);
        bulletButtonWrap.append(bulletButton);
      }
      this.els.carouselPaginationBullet = this.els.carouselPagination.querySelectorAll(".js-carousel-bullet");
    },
    moveToTransform: function() {
      let wrapperRect = this.els.carouselWrap.getBoundingClientRect().left;
      let activeSlideRect = this.els.carouselSlides[this.activeIndex].getBoundingClientRect().left;
      let rect = activeSlideRect - wrapperRect;
      this.els.carouselWrap.style.transform = `translateX(-${rect}px)`;
      return rect;
    },
    toggleActiveClass: function(list) {
      for (let i = 0; i < list.length; i++) {
        list[i].classList.toggle("is-active", i === this.activeIndex);
      }
      ;
    },
    slideChange: function() {
      if (this.els.carouselPagination) {
        this.carouselEventList.toggleActiveClass.call(this, this.els.carouselPaginationBullet);
        this.accessibility.activeCurrentBullet.call(this);
      }
      if (this.els.carouselNavigation) {
        this.accessibility.updateDisabledArrow.call(this);
      }
      this.carouselEventList.toggleActiveClass.call(this, this.els.carouselSlides);
      this.carouselEventList.moveToTransform.call(this);
      this.accessibility.activeSlideAcc.call(this);
      if (typeof this.options.onSlideChange === "function") {
        this.options.onSlideChange(this.activeIndex);
      }
    }
  };
  fn.clickEventList = {
    onArrowClick: function(event) {
      const isNext = event.currentTarget === this.els.carouselNextArrow;
      const isPrev = event.currentTarget === this.els.carouselPrevArrow;
      let nextIndex = this.activeIndex;
      if (isNext) {
        nextIndex += 1;
      } else if (isPrev) {
        nextIndex -= 1;
      }
      if (nextIndex < 0 || nextIndex > this.els.lastIndex) return;
      this.activeIndex = nextIndex;
      this.carouselEventList.slideChange.call(this);
    },
    onBulletClick: function(event) {
      const clickedBullet = event.target.closest(".js-carousel-bullet");
      const clickBulletIndex = [...this.els.carouselPaginationBullet].indexOf(clickedBullet);
      if (!clickedBullet || clickBulletIndex < 0) return;
      this.activeIndex = clickBulletIndex;
      this.carouselEventList.slideChange.call(this);
    }
  };
  fn.dragEventList = {
    onDragStart: function(event) {
      this.drag.isDown = true;
      this.drag.startX = event.clientX;
      this.drag.startPosition = this.carouselEventList.moveToTransform.call(this);
      event.preventDefault();
    },
    onDragMove: function(event) {
      if (!this.drag.isDown) return;
      const dragX = event.clientX - this.drag.startX;
      this.drag.deltaX = dragX;
      const currentOffset = this.drag.startPosition - dragX;
      this.els.carouselWrap.style.transform = `translateX(-${currentOffset}px)`;
    },
    onDragEnd: function() {
      if (!this.drag.isDown) return;
      this.drag.isDown = false;
      const microSlideRatio = 30 / 100;
      const threshold = this.els.slideWidth * microSlideRatio;
      if (Math.abs(this.drag.deltaX) >= threshold) {
        let next = this.activeIndex + (this.drag.deltaX < 0 ? 1 : -1);
        if (next <= this.els.lastIndex && next >= 0) {
          if (next !== this.activeIndex) {
            this.activeIndex = next;
          }
          ;
          this.carouselEventList.slideChange.call(this);
        }
      }
      this.carouselEventList.moveToTransform.call(this);
      this.drag.deltaX = 0;
    }
  };
  fn.accessibility = {
    updateDisabledArrow: function() {
      const activeFirstSlide = 0 === this.activeIndex;
      const activeLastSlide = this.els.lastIndex === this.activeIndex;
      this.els.carouselPrevArrow.setAttribute("aria-disabled", activeFirstSlide ? "true" : "false");
      this.els.carouselNextArrow.setAttribute("aria-disabled", activeLastSlide ? "true" : "false");
    },
    activeCurrentBullet: function() {
      for (let i = 0; i < this.els.carouselPaginationBullet.length; i++) {
        this.els.carouselPaginationBullet[i].setAttribute("aria-selected", i === this.activeIndex ? "true" : "false");
      }
      ;
    },
    activeSlideAcc: function() {
      for (let i = 0; i < this.els.carouselSlides.length; i++) {
        this.els.carouselSlides[i].setAttribute("aria-hidden", i === this.activeIndex ? "false" : "true");
        this.els.carouselSlides[i].setAttribute("tabindex", i === this.activeIndex ? "0" : "-1");
      }
      ;
    }
  };
  fn.destroy = function() {
    this.eventHandler.off.call(this);
    this.els.carouselWrap.style.transform = "";
    for (let i = 0; i < this.els.carouselSlides.length; i++) {
      this.els.carouselSlides[i].classList.remove("is-active");
    }
    ;
    if (this.els.carouselPagination) {
      for (let i = 0; i < this.els.carouselPaginationBullet.length; i++) {
        this.els.carouselPaginationBullet[i].classList.remove("is-active");
      }
    }
    ;
    if (this.els.carouselNavigation) {
      this.els.carouselNextArrow.removeAttribute("aria-disabled");
      this.els.carouselPrevArrow.removeAttribute("aria-disabled");
    }
    ;
    if (this.els.carouselPagination) this.els.carouselPagination.innerHTML = "";
    this.activeIndex = 0;
    this.els.carouselPaginationBullet = null;
    this.drag.isDown = false;
    this.drag.deltaX = 0;
  };
  return Carousel;
})();

// src/js/gnb.js
window.component = window.component || {};
window.component.gnb = /* @__PURE__ */ (function() {
  let els = {};
  const init = function() {
    setElements();
    bindEvents();
  };
  const setElements = function() {
    els.gnb = document.querySelector(".gnb");
    els.gnbButton = els.gnb.querySelectorAll("button");
    els.home = document.querySelector("#home");
    els.carousel = document.querySelector("#carousel");
  };
  const bindEvents = function() {
    eventHandler.scroll();
  };
  const eventHandler = {
    scroll: function() {
      document.addEventListener("scroll", function() {
        eventsList.activeGnbScroll(els.home);
        eventsList.activeGnbScroll(els.carousel);
      });
    }
  };
  const eventsList = {
    activeGnbScroll: function(section) {
      const currentScroll = window.scrollY;
      const rect = section.getBoundingClientRect();
      const top = section.offsetTop;
      const bottom = rect.height + top;
      if (bottom >= currentScroll && currentScroll >= top) {
        let sectionId = section.getAttribute("id");
        for (let i = 0; i < els.gnbButton.length; ++i) {
          els.gnbButton[i].classList.toggle("is-active", els.gnbButton[i].getAttribute("data-value") === sectionId);
        }
      }
    }
  };
  const accessibility = {};
  return {
    init
  };
})();

// src/js/kv.js
window.component = window.component || {};
window.component.kv = (function() {
  let els = {};
  let gap = 0.1;
  let fixed = window.component.commonFixed.eventslist;
  const clamp01 = (v) => Math.max(0, Math.min(1, v));
  const init = function() {
    els.section = document.querySelector(".component-kv");
    if (!!els.section) {
      setElements();
      bindEvents();
    }
  };
  const setElements = function() {
    els.fixedInner = els.section.querySelector(".common-fixed-inner");
    els.headlineTop = els.section.querySelector(".js-headline-top");
    els.headlineBottom = els.section.querySelector(".js-headline-bottom");
    els.alphabetTop = els.headlineTop.querySelectorAll("span");
    els.alphabetBottom = els.headlineBottom.querySelectorAll("span");
    els.eyebrow = els.section.querySelector(".js-eyebrow");
  };
  const bindEvents = function() {
    eventHandler.scroll();
    eventsList.eyebrowChange();
  };
  const eventHandler = {
    scroll: function() {
      window.addEventListener("scroll", function() {
        const p = fixed.getProgress();
        const dir = fixed.getDirection();
        if (p.trackInside) {
          eventsList.headlineTop(p, dir);
          eventsList.headlineBottom(p, dir);
          eventsList.typoAnimation(p);
        }
      });
    }
  };
  const eventsList = {
    headlineTop: function(p, dir) {
      let prog = 1 - p.progress;
      const spanArray = Array.from(els.alphabetTop);
      const span = dir === "up" ? spanArray.reverse() : spanArray;
      for (let i = 0; i < span.length; i++) {
        const scale = clamp01(prog);
        if (dir === "up") prog += gap;
        if (dir === "down") prog -= gap;
        span[i].style.transform = `scaleY(${scale})`;
      }
    },
    headlineBottom: function(p, dir) {
      let prog = p.progress;
      const spanArray = Array.from(els.alphabetBottom);
      const span = dir === "up" ? spanArray : spanArray.reverse();
      for (let i = span.length - 1; i >= 0; i--) {
        const scale = clamp01(prog);
        if (dir === "up") prog -= gap;
        if (dir === "down") prog += gap;
        span[i].style.transform = `scaleY(${scale})`;
      }
    },
    typoAnimation: function(p) {
    },
    eyebrowChange: function() {
      const eyebrowChangeValue = ["UI/UX", "FrontEnd", "Web"];
      let i = 0;
      els.eyebrow.innerText = eyebrowChangeValue[i];
      setInterval(function() {
        i = (i + 1) % eyebrowChangeValue.length;
        els.eyebrow.innerHTML = eyebrowChangeValue[i];
      }, 1300);
    },
    rotateSvg: function(p) {
      const rotate = Math.round(p.progress * 360);
      els.svg.style.transform = `rotate(${rotate}deg)`;
    }
  };
  return {
    init
  };
})();

// src/js/overview.js
window.component = window.component || {};
window.component.overview = (function() {
  let els = {}, CAROUSEL = window.component.commonCarousel;
  const init = function() {
    els.section = document.querySelector(".component-overview");
    if (!els.section) return;
    setElements();
    bindEvents();
  };
  const setElements = function() {
    els.carouselContainer = els.section.querySelector(".js-carousel");
    els.slideNum = els.section.querySelector(".js-slide-num");
    els.slideHeadline = els.section.querySelector(".js-slide-headline");
    els.slide = els.section.querySelectorAll(".js-carousel-slide");
  };
  const bindEvents = function() {
    eventList.setCarousel();
  };
  const eventHandler = {};
  const eventList = {
    setCarousel: function() {
      const myCarousel = new CAROUSEL({
        container: els.carouselContainer,
        onInit: function() {
          console.log("Carousel ready!");
        },
        onSlideChange: function(index) {
          const slideTitle = els.slide[index].querySelector(
            ".js-slide-title > .blind"
          ).innerText;
          const slideNum = slideTitle.substring(0, 4);
          const slideHeadline = slideTitle.substring(6);
          const nobullets = els.section.querySelectorAll(".js-carousel-bullet:not(.is-active)");
          nobullets.forEach((nobullet) => {
            nobullet.textContent = "";
          });
          setTimeout(() => {
            const bullets = els.section.querySelectorAll(".js-carousel-bullet");
            if (bullets[index].classList.contains("is-active")) {
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
    init
  };
})();

// src/js/hover.js
window.component = window.component || {};
window.component.hover = /* @__PURE__ */ (function() {
  let els = {};
  const init = function() {
    els.section = document.querySelector(".component-hover");
    if (!!els.section) {
      setElements();
      bindEvents();
    }
  };
  const setElements = function() {
    els.buttons = els.section.querySelectorAll(".js-hover-button");
  };
  const bindEvents = function() {
    eventHandler.scroll();
    eventHandler.click();
  };
  const eventHandler = {
    scroll: function() {
      window.addEventListener("scroll", function() {
        eventsList.activeFeature();
      });
    },
    click: function() {
      for (let i = 0; i < els.buttons.length; i++) {
        els.buttons[i].addEventListener("click", function(event) {
          eventsList.clickButton(event);
        });
      }
      ;
    }
  };
  const eventsList = {
    activeFeature: function() {
      const rect = els.section.getBoundingClientRect();
      const y = rect.y;
      const height = rect.height;
      for (let i = 0; i < els.buttons.length; i++) {
        setTimeout(() => {
          els.buttons[i].classList.toggle("is-show", y < height && Math.abs(y) < height);
        }, i * 200);
        console.log(i + 200);
        if (Math.abs(y) > height) {
          els.buttons[i].closest(".component-hover__box").classList.remove("is-active");
        }
      }
      ;
    },
    clickButton: function(event) {
      for (let i = 0; i < els.buttons.length; i++) {
        const list = els.buttons[i].closest(".component-hover__box");
        const targetList = event.currentTarget.closest(".component-hover__box");
        list.classList.add("is-ready");
        if (targetList !== list) {
          list.classList.remove("is-active");
        } else if (targetList == list) {
          list.classList.toggle("is-active");
        }
      }
      ;
    }
  };
  return {
    init
  };
})();

// src/js/init.js
window.component = window.component || {};
window.component.initialize = /* @__PURE__ */ (function() {
  const init = function() {
    window.component.commonResize.init();
    window.component.commonFixed.init();
    window.component.commonCursor.init();
    window.component.gnb.init();
    window.component.kv.init();
    window.component.overview.init();
    window.component.hover.init();
  };
  return {
    init
  };
})();
window.addEventListener("DOMContentLoaded", () => {
  window.component.initialize.init();
});
//# sourceMappingURL=init.js.map
