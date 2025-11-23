window.component = window.component || {};
window.component.kv = (function () {
    let els = {};
    let gap = 0.1;
    let fixed = window.component.commonFixed.eventList;

    const clamp01 = v => Math.max(0, Math.min(1, v));

    const init = function () {
        els.section = document.querySelector('.component-kv');

        if (!!els.section) {
            setElements();
            bindEvents();
        }
    };

    const setElements = function () {
        els.fixedInner = els.section.querySelector('.common-fixed-inner')
        els.headline = els.section.querySelector('.js-headline');
        els.headline2 = els.section.querySelector('.js-headline2');
        els.headline3 = els.section.querySelector('.js-headline3');
        els.headlineTop = els.section.querySelector('.js-headline-top');
        els.headlineBottom = els.section.querySelector('.js-headline-bottom');
        els.headlineMeddle = els.section.querySelector('.js-headline-meddle');
        els.alphabetTop = null;
        els.alphabetMeddle = null;
        els.alphabetBottom = null;

        els.eyebrow = els.section.querySelector('.js-eyebrow');
    };

    const bindEvents = function () {
        eventList.headline1();
        eventList.headline2();
        eventList.headline3();
        eventHandler.scroll();
        eventList.eyebrowChange();
    };

    const eventHandler = {
        scroll: function () {
            let ticking = false;

            window.addEventListener('scroll', function () {
                if (ticking) return;
                ticking = true;

                requestAnimationFrame(function () {
                    const p = fixed.getProgress();
                    if (p) {
                        eventList.headline1Ani(p);
                        eventList.headline2Ani(p);
                        eventList.headline3Ani(p);
                    }
                    ticking = false;
                });
            }, { passive: true });
        }
    };

    const eventList = {
        creatHeadline: function (headline, wrap) {
            for (let i = 0; i < headline.textContent.length; i++) {
                let span = document.createElement('span');

                span.classList.add('component-kv__headline-text');
                span.textContent = headline.textContent[i];

                wrap.append(span);

                if (span.textContent.trim() === '') {
                    span.replaceWith(document.createTextNode('\u00A0'));
                }
            }
        },
        headline1: function () {
            eventList.creatHeadline(els.headline, els.headlineTop);
            els.alphabetTop = els.headlineTop.querySelectorAll('span');
        },
        headline2: function () {
            eventList.creatHeadline(els.headline2, els.headlineMeddle);
            els.alphabetMeddle = els.headlineMeddle.querySelectorAll('span');
        },
        headline3: function () {
            eventList.creatHeadline(els.headline3, els.headlineBottom);
            els.alphabetBottom = els.headlineBottom.querySelectorAll('span');
        },
        typoAnimation: function (p, element, scaleDown,startPont, endPoint) {
            const end = endPoint?? 100;
            const start = startPont?? 0;
            const range = end - start; 
            const step = range / element.length;

            for (let i = 0; i < element.length; i++) {
                const startP = (i * step) + start;
                const local = clamp01((p.progress - startP) / (end - startP));
                const t = scaleDown ? 1 - local : local;

                element[i].style.transform = `scaleY(${t})`;
            }
        },
        headline1Ani: function (p) {
            eventList.typoAnimation(p, els.alphabetTop, true, 0, 49);
        },
        headline2Ani: function (p) {
            if (p.progress < 50) {
                for (let i = 0; i < els.alphabetMeddle.length; i++) {
                    els.alphabetMeddle[i].style.transformOrigin = 'bottom';
                }

                eventList.typoAnimation(p, els.alphabetMeddle, false, 0, 49);
            } else if (p.progress === 50){
                for (let i = 0; i < els.alphabetMeddle.length; i++) {
                    els.alphabetMeddle[i].style.transform = 'scaleY(1)';
                }
            } else if (p.progress >= 50){

                for (let i = 0; i < els.alphabetMeddle.length; i++) {
                    els.alphabetMeddle[i].style.transformOrigin = 'top';
                }
                eventList.typoAnimation(p, els.alphabetMeddle, true, 50, 100);
            }
        },
        headline3Ani: function (p) {
            eventList.typoAnimation(p, els.alphabetBottom, false, 50, 100);
        },
        eyebrowChange: function () {
            const eyebrowChangeValue = ['UI/UX', 'FrontEnd', 'Web'];
            let i = 0;

            els.eyebrow.innerText = eyebrowChangeValue[i];

            setInterval(function () {
                i = (i + 1) % eyebrowChangeValue.length;
                els.eyebrow.innerHTML = eyebrowChangeValue[i];
            }, 1300);
        }
    };

    return {
        init: init
    }
})();