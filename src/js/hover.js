window.component = window.component || {};
window.component.hover = (function () {
    let els = {};

    const init = function () {
        els.section = document.querySelector('.component-hover');

        if (!!els.section) {
            setElements();
            bindEvents();
        }
    };

    const setElements = function () {
        els.buttons = els.section.querySelectorAll('.js-hover-button')
    };

    const bindEvents = function () {
        eventHandler.scroll();
        eventHandler.click();
    };

    const eventHandler = {
        scroll: function () {
            window.addEventListener('scroll', function () {
                eventsList.activeFeature();
            });
        },
        click: function () {
            for (let i = 0; i < els.buttons.length; i++) {
                els.buttons[i].addEventListener('click', function (event) {
                    eventsList.clickButton(event);
                });
            };
        }
    };

    const eventsList = {
        activeFeature: function () {
            const rect = els.section.getBoundingClientRect();
            const y = rect.y;
            const height = rect.height;

            for (let i = 0; i < els.buttons.length; i++) {

                setTimeout (() => {
                    els.buttons[i].classList.toggle('is-show', y < height && Math.abs(y) < height);
                }, i*200);

                if (Math.abs(y) > height) {
                    els.buttons[i].closest('.component-hover__box').classList.remove('is-active');
                }
            };
        },
        clickButton: function (event) {
            for (let i = 0; i < els.buttons.length; i++) {
                const list = els.buttons[i].closest('.component-hover__box');
                const targetList = event.currentTarget.closest('.component-hover__box');

                list.classList.add('is-ready');
                if (targetList !== list) {
                    list.classList.remove('is-active');
                } else if (targetList == list) {
                    list.classList.toggle('is-active');
                }
            };
        }
    };

    return {
        init: init
    }
})();