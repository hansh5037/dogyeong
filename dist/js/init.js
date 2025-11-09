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
        const end = viewPortBottom > elsBottom;
        const trackInside = !start && !end;
        let progress;
        if (trackInside) {
          const usableVh = viewPort - (els.gnb && els.gnb.offsetHeight || 0);
          const trackH = elsBottom - elsTop;
          const denom = Math.max(1, trackH - usableVh);
          const t = (viewPortTop - elsTop) / denom;
          progress = Math.max(0, Math.min(1, t));
          if (end) progress = 1;
          return {
            viewPort,
            trackInside,
            progress
          };
        }
      }
      return {
        viewPort: window.innerHeight,
        trackInside: false,
        progress: void 0
      };
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
window.component.commonCarousel = /* @__PURE__ */ (function() {
  const CAROUSEL = {
    create: function(opts = {}) {
      let els = {}, activeIndex = 0, drag = {
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
      const init = function() {
        els.section = options.container;
        if (els.section) {
          setElements();
          setProperty();
          bindEvents();
          if (typeof options.onInit === "function") {
            options.onInit();
          }
        }
      };
      const setElements = function() {
        els.carouselWrap = els.section.querySelector(".js-carousel-wrap");
        els.carouselSlides = els.section.querySelectorAll(".js-carousel-slide");
        els.carouselNavigation = els.section.querySelector(".js-carousel-navigation");
        els.carouselNextArrow = els.section.querySelector(".js-carousel-next");
        els.carouselPrevArrow = els.section.querySelector(".js-carousel-prev");
        els.carouselPagination = els.section.querySelector(".js-carousel-pagination");
        els.carouselPaginationBullet = null;
      };
      const setProperty = function() {
        els.lastIndex = els.carouselSlides.length - 1;
        els.slideRect = els.carouselSlides[activeIndex].getBoundingClientRect();
        els.slideWidth = els.slideRect.width;
      };
      const bindEvents = function() {
        if (els.carouselPagination) {
          carouselEventList.setPagination();
        }
        carouselEventList.slideChange();
        eventHandler.on();
      };
      const eventHandler = {
        on: function() {
          if (els.carouselNextArrow) {
            els.carouselNextArrow.addEventListener("click", clickEventList.onArrowClick);
          }
          if (els.carouselPrevArrow) {
            els.carouselPrevArrow.addEventListener("click", clickEventList.onArrowClick);
          }
          if (els.carouselPagination) {
            els.carouselPagination.addEventListener("click", clickEventList.onBulletClick);
          }
          els.carouselWrap.addEventListener("pointerdown", dragEventList.dragStart, { passive: false });
          window.addEventListener("pointermove", dragEventList.dragMove);
          window.addEventListener("pointerup", dragEventList.dragEnd);
          window.addEventListener("pointercancel", dragEventList.dragEnd);
        },
        off: function() {
          if (els.carouselNextArrow) {
            els.carouselNextArrow.removeEventListener("click", clickEventList.onArrowClick);
          }
          if (els.carouselPrevArrow) {
            els.carouselPrevArrow.removeEventListener("click", clickEventList.onArrowClick);
          }
          if (els.carouselPagination) {
            els.carouselPagination.removeEventListener("click", clickEventList.onBulletClick);
          }
          els.carouselWrap.removeEventListener("pointerdown", dragEventList.dragStart);
          window.removeEventListener("pointermove", dragEventList.dragMove);
          window.removeEventListener("pointerup", dragEventList.dragEnd);
          window.removeEventListener("pointercancel", dragEventList.dragEnd);
        }
      };
      const carouselEventList = {
        setPagination: function() {
          for (let i = 0; i < els.carouselSlides.length; i++) {
            const bulletButtonWrap = document.createElement("li");
            const bulletButton = document.createElement("button");
            bulletButton.type = "button";
            bulletButton.className = `js-carousel-bullet${i === 0 ? " is-active" : ""}`;
            bulletButton.setAttribute("aria-label", i + 1 + "/" + els.carouselSlides.length);
            els.carouselPagination.append(bulletButtonWrap);
            bulletButtonWrap.append(bulletButton);
          }
          els.carouselPaginationBullet = els.carouselPagination.querySelectorAll(".js-carousel-bullet");
        },
        moveToTransform: function() {
          let wrapperRect = els.carouselWrap.getBoundingClientRect().left;
          let activeSlideRect = els.carouselSlides[activeIndex].getBoundingClientRect().left;
          let rect = activeSlideRect - wrapperRect;
          els.carouselWrap.style.transform = `translateX(-${rect}px)`;
          return rect;
        },
        toggleActiveClass: function(list) {
          for (let i = 0; i < list.length; i++) {
            list[i].classList.toggle("is-active", i === activeIndex);
          }
          ;
        },
        slideChange: function() {
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
          if (typeof options.onSlideChange === "function") {
            options.onSlideChange(activeIndex);
          }
        }
      };
      const clickEventList = {
        onArrowClick: function(event) {
          const isNext = event.target === els.carouselNextArrow;
          const isPrev = event.target === els.carouselPrevArrow;
          let nextIndex = activeIndex;
          if (isNext) {
            nextIndex += 1;
          } else if (isPrev) {
            nextIndex -= 1;
          }
          if (nextIndex < 0 || nextIndex > els.lastIndex) return;
          activeIndex = nextIndex;
          carouselEventList.slideChange();
        },
        onBulletClick: function(event) {
          const clickedBullet = event.target.closest(".js-carousel-bullet");
          const clickBulletIndex = [...els.carouselPaginationBullet].indexOf(clickedBullet);
          if (!clickedBullet || clickBulletIndex < 0) return;
          activeIndex = clickBulletIndex;
          carouselEventList.slideChange();
        }
      };
      const dragEventList = {
        dragStart: function(event) {
          drag.isDown = true;
          drag.startX = event.clientX;
          drag.startPosition = carouselEventList.moveToTransform();
          event.preventDefault();
        },
        dragMove: function(event) {
          if (!drag.isDown) return;
          const dragX = event.clientX - drag.startX;
          drag.deltaX = dragX;
          const currentOffset = drag.startPosition - dragX;
          els.carouselWrap.style.transform = `translateX(-${currentOffset}px)`;
        },
        dragEnd: function() {
          if (!drag.isDown) return;
          drag.isDown = false;
          const microSlideRatio = 30 / 100;
          const threshold = els.slideWidth * microSlideRatio;
          if (Math.abs(drag.deltaX) >= threshold) {
            let next = activeIndex + (drag.deltaX < 0 ? 1 : -1);
            if (next <= els.lastIndex && next >= 0) {
              if (next !== activeIndex) {
                activeIndex = next;
              }
              ;
              carouselEventList.slideChange();
            }
          }
          carouselEventList.moveToTransform();
          drag.deltaX = 0;
        }
      };
      const accessibility = {
        updateDisabledArrow: function() {
          const activeFirstSlide = 0 === activeIndex;
          const activeLastSlide = els.lastIndex === activeIndex;
          els.carouselPrevArrow.setAttribute("aria-disabled", activeFirstSlide ? "true" : "false");
          els.carouselNextArrow.setAttribute("aria-disabled", activeLastSlide ? "true" : "false");
        },
        activeCurrentBullet: function() {
          for (let i = 0; i < els.carouselPaginationBullet.length; i++) {
            els.carouselPaginationBullet[i].setAttribute("aria-selected", i === activeIndex ? "true" : "false");
          }
          ;
        },
        activeSlideAcc: function() {
          for (let i = 0; i < els.carouselSlides.length; i++) {
            els.carouselSlides[i].setAttribute("aria-hidden", i === activeIndex ? "false" : "true");
            els.carouselSlides[i].setAttribute("tabindex", i === activeIndex ? "0" : "-1");
          }
          ;
        }
      };
      const destroy = function() {
        eventHandler.off();
        els.carouselWrap.style.transform = "";
        for (let i = 0; i < els.carouselSlides.length; i++) {
          els.carouselSlides[i].classList.remove("is-active");
        }
        ;
        if (els.carouselPagination) {
          for (let i = 0; i < els.carouselPaginationBullet.length; i++) {
            els.carouselPaginationBullet[i].classList.remove("is-active");
          }
        }
        ;
        if (els.carouselNavigation) {
          els.carouselNextArrow.removeAttribute("aria-disabled");
          els.carouselPrevArrow.removeAttribute("aria-disabled");
        }
        ;
        if (els.carouselPagination) els.carouselPagination.innerHTML = "";
        activeIndex = 0;
        els.carouselPaginationBullet = null;
        drag.isDown = false;
        drag.deltaX = 0;
      };
      return {
        init,
        destroy
      };
    }
  };
  return CAROUSEL;
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
    els.bg = els.section.querySelector(".js-background");
    els.bgImg = els.bg.querySelector("img");
    els.svg = els.section.querySelector(".js-svg");
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
          eventsList.rotateSvg(p);
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
    els.section = document.querySelector(".common-wrap");
    if (!!els.section) {
      setElements();
      bindEvents();
    }
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
      const myCarousel = CAROUSEL.create({
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
  };
  return {
    init
  };
})();
window.addEventListener("DOMContentLoaded", () => {
  window.component.initialize.init();
});
//# sourceMappingURL=init.js.map
