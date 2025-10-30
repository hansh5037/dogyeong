window.component = window.component || {};
window.component.kv = (function () {
    let els = {};
    let gap = 0.1;
    let fixed = window.component.commonFixed.eventslist;

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
        els.headlineTop = els.section.querySelector('.js-headline-top');
        els.headlineBottom = els.section.querySelector('.js-headline-bottom');
        els.alphabetTop = els.headlineTop.querySelectorAll('span');
        els.alphabetBottom = els.headlineBottom.querySelectorAll('span');

        els.eyebrow = els.section.querySelector('.js-eyebrow');

        els.bg = els.section.querySelector('.js-background');
        els.bgImg = els.bg.querySelector('img');

        els.svg = els.section.querySelector('.js-svg');
    };

    const bindEvents = function () {
        eventHandler.scroll();
        eventsList.eyebrowChange();
    };

    const eventHandler = {
        scroll: function () {
            window.addEventListener('scroll', function () {
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
        headlineTop: function (p, dir) {
            let prog = 1 - p.progress;

            const spanArray = Array.from(els.alphabetTop);
            const span = (dir === 'up') ? spanArray.reverse() : spanArray;

            for (let i = 0; i < span.length; i++) {
                const scale = clamp01(prog);
                if (dir === 'up') prog += gap;
                if (dir === 'down') prog -= gap;
                span[i].style.transform = `scaleY(${scale})`;
            }
        },
        headlineBottom: function (p, dir) {
            let prog = p.progress;

            const spanArray = Array.from(els.alphabetBottom);
            const span = (dir === 'up') ? spanArray : spanArray.reverse();

            for (let i = span.length - 1; i >= 0; i--) {
                const scale = clamp01(prog);
                if (dir === 'up') prog -= gap;
                if (dir === 'down') prog += gap;
                span[i].style.transform = `scaleY(${scale})`;
            }
        },
        eyebrowChange: function () {
            const eyebrowChangeValue = ['UI/UX', 'FrontEnd', 'Web'];
            let i = 0;

            els.eyebrow.innerText = eyebrowChangeValue[i];

            setInterval(function () {
                i = (i + 1) % eyebrowChangeValue.length;
                els.eyebrow.innerHTML = eyebrowChangeValue[i];
            }, 1300);
        },
        rotateSvg: function (p) {
			const rotate = Math.round(p.progress * 360);
			
			els.svg.style.transform = `rotate(${rotate}deg)`;
		}
    };

    return {
        init: init
    }
})();