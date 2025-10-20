// src/js/kv.js
window.component = window.component || {};
window.component.kv = /* @__PURE__ */ (function() {
  let els = {};
  let gap = 0.1;
  const init = function() {
    els.section = document.querySelector(".component-kv");
    if (!!els.section) {
      setElemets();
      bindEvents();
    }
  };
  const setElemets = function() {
    els.fixedTrack = els.section.querySelector(".common-fixed-track");
    els.fixedInner = els.section.querySelector(".common-fixed-inner");
    els.headlineTop = els.section.querySelector(".js-headline-top");
    els.headlineBottom = els.section.querySelector(".js-headline-bottom");
  };
  const bindEvents = function() {
    eventsList.setFixedScroll();
    eventHandler.scroll();
    eventHandler.wheel();
  };
  const eventHandler = {
    scroll: function() {
      window.addEventListener("scroll", function() {
        const p = eventsList.getScroll();
      });
    },
    wheel: function() {
      window.addEventListener("wheel", (event) => {
        const p = eventsList.getScroll();
        const inRange = p > 0 && p < 1;
        const wheel = event.wheelDeltaY;
        if (inRange) {
          if (wheel > 0) {
            eventsList.headlineBottomAnimation();
          } else {
            eventsList.headlineTopAnimation();
          }
        }
        return;
      });
    }
  };
  const eventsList = {
    setFixedScroll: function() {
      els.fixedTrack.style.height = window.innerHeight * 5 + "px";
    },
    getScroll: function() {
      const elsRect = els.fixedTrack.getBoundingClientRect();
      const viewPort = window.visualViewport?.height || window.innerHeight;
      const t = elsRect.top / (viewPort - elsRect.height);
      return Math.max(0, Math.min(1, t));
    },
    getScaleValue: function(repeat = 1, eps = 1e-3) {
      const scroll = eventsList.getScroll();
      const x = scroll * repeat % 1;
      let v = (1 - Math.cos(2 * Math.PI * x)) / 2;
      if (v > 1 - eps) v = 1;
      else if (v < eps) v = 0;
      return v;
    },
    headlineTopAnimation: function() {
      const alphabetTop = els.headlineTop.querySelectorAll("span");
      const alphabetBottom = els.headlineBottom.querySelectorAll("span");
      const scaleValue = eventsList.getScaleValue();
      for (let i = 0; i < alphabetTop.length; i++) {
        let scale = 1 - (scaleValue + gap * i);
        if (scale < 0) scale = 0;
        if (scale > 1) scale = 1;
        alphabetTop[i].style.transform = `scaleY(${scale})`;
      }
      for (let i = 0; i < alphabetBottom.length; i++) {
        let scale = scaleValue + gap * i;
        if (scale < 0) scale = 0;
        if (scale > 1) scale = 1;
        alphabetBottom[i].style.transform = `scaleY(${scale})`;
      }
    },
    headlineBottomAnimation: function() {
      const alphabetTop = els.headlineTop.querySelectorAll("span");
      const alphabetBottom = els.headlineBottom.querySelectorAll("span");
      const scaleValue = eventsList.getScaleValue();
      for (let i = 0; i < alphabetTop.length; i++) {
        let scale = scaleValue + gap * i;
        if (scale < 0) scale = 0;
        if (scale > 1) scale = 1;
        alphabetTop[i].style.transform = `scaleY(${scale})`;
      }
      for (let i = 0; i < alphabetBottom.length; i++) {
        let scale = 1 - (scaleValue + gap * i);
        if (scale < 0) scale = 0;
        if (scale > 1) scale = 1;
        alphabetBottom[i].style.transform = `scaleY(${scale})`;
      }
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
    els.section = document.querySelector("component-carousel");
    if (!!els.section) {
      setElemets();
      BindEvents();
    }
  };
  const setElemets = function() {
  };
  const BindEvents = function() {
  };
  const eventHandler = function() {
  };
  const eventsList = {};
  const accessibility = function() {
  };
  return {
    init
  };
})();

// src/js/init.js
window.component = window.component || {};
window.component.initialize = /* @__PURE__ */ (function() {
  const init = function() {
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
