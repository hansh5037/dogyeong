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

// src/js/carousel.js
window.component = window.component || {};
window.component.carousel = /* @__PURE__ */ (function() {
  let els = {};
  const init = function() {
    els.section = document.querySelector(".component-carousel");
    if (!!els.section) {
      setElements();
      bindEvents();
    }
  };
  const setElements = function() {
  };
  const bindEvents = function() {
  };
  const eventHandler = {};
  const eventsList = {};
  const accessibility = {};
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
    window.component.carousel.init();
  };
  return {
    init
  };
})();
window.addEventListener("DOMContentLoaded", () => {
  window.component.initialize.init();
});
//# sourceMappingURL=init.js.map
