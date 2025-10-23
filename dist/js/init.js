// src/js/common.js
window.component = window.component || {};
window.component.common = /* @__PURE__ */ (function() {
  let els = {};
  const init = function() {
    els.section = document.querySelector(".contents");
    if (!!els.section) {
      setElemets();
      BindEvents();
    }
  };
  const setElemets = function() {
    els.cursor = els.section.querySelector(".common-cursor");
  };
  const BindEvents = function() {
    eventHandler.mouseMove();
  };
  const eventHandler = {
    mouseMove: function() {
      document.addEventListener("mousemove", function(event) {
        let x = event.clientX;
        let y = event.clientY;
        els.cursor.style.cssText = "left:" + x + "px;top:" + y + "px;";
      });
    }
  };
  const eventsList = {};
  return {
    init
  };
})();

// src/js/kv.js
window.component = window.component || {};
window.component.kv = /* @__PURE__ */ (function() {
  let els = {};
  let gap = 0.1;
  const clamp01 = (v) => Math.max(0, Math.min(1, v));
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
    els.alphabetTop = els.headlineTop.querySelectorAll("span");
    els.alphabetBottom = els.headlineBottom.querySelectorAll("span");
    els.eyebrow = els.section.querySelector(".js-eyebrow");
  };
  const bindEvents = function() {
    eventsList.setFixedScroll();
    eventHandler.wheel();
    eventsList.eyebrowChange();
  };
  const eventHandler = {
    wheel: function() {
      window.addEventListener("wheel", (event) => {
        const p = eventsList.getScrollValue();
        const inRange = p > 0 && p < 1;
        const wheel = event.wheelDeltaY;
        if (inRange) {
          if (wheel > 0) {
            eventsList.applyHeadlineScale(els.alphabetTop, p, -1, true, (pLocal) => 1 - pLocal);
            eventsList.applyHeadlineScale(els.alphabetBottom, p, -1, true, (pLocal) => pLocal);
          } else {
            eventsList.applyHeadlineScale(els.alphabetTop, p, 1, false, (pLocal) => 1 - pLocal);
            eventsList.applyHeadlineScale(els.alphabetBottom, p, 1, false, (pLocal) => pLocal);
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
    getScrollValue: function() {
      const elsRect = els.fixedTrack.getBoundingClientRect();
      const viewPort = window.visualViewport?.height || window.innerHeight;
      const t = elsRect.top / (viewPort - elsRect.height);
      return Math.max(0, Math.min(1, t));
    },
    applyHeadlineScale: function(spans, p, dir, scrollUp, computeScale) {
      const len = spans.length;
      for (let k = 0; k < len; k++) {
        const i = scrollUp ? len - 1 - k : k;
        const pLocal = p + dir * gap * (k + 1);
        let scale = clamp01(computeScale(pLocal));
        spans[i].style.transform = `scaleY(${scale})`;
      }
      ;
    },
    eyebrowChange: function() {
      const eyebrowChangeValue = ["UI/UX", "FrontEnd", "Web"];
      let i = 0;
      els.eyebrow.innerText = eyebrowChangeValue[i];
      setInterval(function() {
        i = (i + 1) % eyebrowChangeValue.length;
        els.eyebrow.innerHTML = eyebrowChangeValue[i];
      }, 1500);
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
    window.component.kv.init();
    window.component.common.init();
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
