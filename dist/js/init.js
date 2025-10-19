// src/js/kv.js
window.component = window.component || {};
window.component.kv = /* @__PURE__ */ (function() {
  let els = {};
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
  };
  const eventHandler = {
    scroll: function() {
      window.addEventListener("scroll", function() {
        const p = eventsList.getScroll();
        console.log(Math.round(p * 100));
      });
    }
  };
  const eventsList = {
    setFixedScroll: function() {
      els.fixedTrack.style.height = window.innerHeight * 3 + "px";
    },
    getScroll: function() {
      const elsRect = els.fixedTrack.getBoundingClientRect();
      const viewPort = window.visualViewport?.height || window.innerHeight;
      const elsHeight = elsRect.height;
      const t = (viewPort - elsRect.top) / elsHeight;
      return Math.max(0, Math.min(1, t));
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
