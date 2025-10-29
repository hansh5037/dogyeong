window.component = window.component || {};
window.component.commonFixed = (function () {
    let els = {};

    const init = function () {
        els.section = document.querySelector('.contents');
        els.fixedTrack = els.section.querySelectorAll('.common-fixed-track');

        if (!!els.fixedTrack) {
            setElements();
            BindEvents();
        }
    };

    const setElements = function () {
        els.gnb = els.section.querySelector('.gnb');
    };

    const BindEvents = function () {
        eventslist.setTrack();
        eventHandler.resize();
    };

    const eventHandler = {
        resize: function () {
            window.addEventListener('resize', eventslist.setTrack);
        }
    };

    const eventslist = {
        setTrack: function () {
            for (let i = 0; i < els.fixedTrack.length; i++) {
                const trackHeight = Number(els.fixedTrack[i].getAttribute('data-track-height')) || 1;;
                els.fixedTrack[i].style.height = (window.innerHeight * trackHeight) + 'px';
            }
        },
        getProgress: function () {
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
                    const usableVh = viewPort - ((els.gnb && els.gnb.offsetHeight) || 0);
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
                progress: undefined
            };
        },
        getDirection: function () {
            const s = this.getProgress()
            if (!s.trackInside) return;

            if (this.lastP == null) {
                this.lastP = s.progress;
                return;
            }
            const delta = s.progress - this.lastP;
            const dir = (delta > 0) ? 'down' : 'up';
            this.lastP = s.progress;

            return dir;
        }
    }
    return {
        init: init,
        eventslist: eventslist
    }
})();