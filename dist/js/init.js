// src/js/common.js
window.component = window.component || {};
window.component.common = /* @__PURE__ */ (function() {
  let els = {};
  const init = function() {
    els.section = document.querySelector(".contents");
    if (!!els.section) {
      setElements();
      BindEvents();
    }
  };
  const setElements = function() {
    els.cursor = els.section.querySelector(".common-cursor");
    els.fixedTrack = els.section.querySelector(".common-fixed-track");
    els.fixedInner = els.section.querySelector(".common-fixed-inner");
  };
  const BindEvents = function() {
    eventHandler.mouseMove();
  };
  const eventHandler = {
    mouseMove: function() {
      document.addEventListener("mousemove", function(event) {
        if (window.navigator.maxTouchPoints == 0) {
          eventsList.mousePosition(event);
        }
      });
    }
  };
  const eventsList = {
    mousePosition: function(event) {
      let x = event.clientX;
      let y = event.clientY;
      els.cursor.style.left = x + "px";
      els.cursor.style.top = y + "px";
    }
  };
  const fixedScrollEvent = {
    set: function(opts = {}) {
      opts.trackHeight = !!!opts.trackHeight ? 1 : opts.trackHeight;
      this.setTrack(opts.trackHeight);
    },
    setTrack: function(trackHeight) {
      els.fixedTrack.style.height = window.innerHeight * trackHeight + "px";
    },
    getProgress: function() {
      if (!els.fixedTrack) return;
      const elsRect = els.fixedTrack.getBoundingClientRect();
      const viewPort = window.visualViewport && window.visualViewport.height || window.innerHeight;
      const trackOutside = elsRect.bottom <= viewPort || elsRect.top >= viewPort;
      let progress;
      if (!trackOutside) {
        const t = (viewPort - elsRect.top) / elsRect.height;
        progress = Math.max(0, Math.min(1, t));
        if (progress < 0.19) progress = 0;
        if (progress > 1 - 0.02) progress = 1;
      }
      return { elsRect, viewPort, trackOutside, progress };
    },
    getDirection: function() {
      const s = this.getProgress();
      if (s.trackOutside) return;
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
    fixedScrollEvent
  };
})();

// src/js/gnb.js
window.component = window.component || {};
window.component.gnb = /* @__PURE__ */ (function() {
  let els = {};
  const init = function() {
    setElements();
    BindEvents();
  };
  const setElements = function() {
    els.gnb = document.querySelector(".gnb");
    els.gnbButton = els.gnb.querySelectorAll("button");
    els.home = document.querySelector("#home");
    els.carousel = document.querySelector("#carousel");
  };
  const BindEvents = function() {
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
  let fixed = window.component.common.fixedScrollEvent;
  const clamp01 = (v) => Math.max(0, Math.min(1, v));
  const init = function() {
    els.section = document.querySelector(".component-kv");
    if (!!els.section) {
      setElements();
      bindEvents();
    }
  };
  const setElements = function() {
    els.fixedTrack = els.section.querySelector(".common-fixed-track");
    els.fixedInner = els.section.querySelector(".common-fixed-inner");
    els.headlineTop = els.section.querySelector(".js-headline-top");
    els.headlineBottom = els.section.querySelector(".js-headline-bottom");
    els.alphabetTop = els.headlineTop.querySelectorAll("span");
    els.alphabetBottom = els.headlineBottom.querySelectorAll("span");
    els.eyebrow = els.section.querySelector(".js-eyebrow");
  };
  const bindEvents = function() {
    eventsList.setFixed();
    eventHandler.scroll();
    eventsList.eyebrowChange();
  };
  const eventHandler = {
    scroll: function() {
      window.addEventListener("scroll", function() {
        const p = fixed.getProgress();
        const dir = fixed.getDirection();
        eventsList.top(p, dir);
        eventsList.bottom(p, dir);
      });
    }
  };
  const eventsList = {
    setFixed: function() {
      fixed.set({
        trackHeight: 5
      });
    },
    top: function(p, dir) {
      let prog = 1 - p.progress;
      const spanArray = Array.from(els.alphabetTop);
      const span = dir === "up" ? spanArray.reverse() : spanArray;
      for (let i = 0; i < span.length; i++) {
        const scale = clamp01(prog);
        span[i].style.transform = `scaleY(${scale})`;
        if (dir === "up") prog += gap;
        if (dir === "down") prog -= gap;
      }
    },
    bottom: function(p, dir) {
      let prog = p.progress;
      const spanArray = Array.from(els.alphabetBottom);
      const span = dir === "up" ? spanArray : spanArray.reverse();
      for (let i = span.length - 1; i >= 0; i--) {
        const scale = clamp01(prog);
        span[i].style.transform = `scaleY(${scale})`;
        if (dir === "up") prog -= gap;
        if (dir === "down") prog += gap;
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
      BindEvents();
    }
  };
  const setElements = function() {
  };
  const BindEvents = function() {
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
    window.component.common.init();
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
