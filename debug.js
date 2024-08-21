'use strict';
/**
 * Zapnutí debugu
 */
var g3__debug = sessionStorage.getItem('g3__debug');
function debug() {
    if (!g3__debug) {
        sessionStorage.setItem('g3__debug', true);
        console.log('Debug zapnut');
        g3__debug = sessionStorage.getItem('g3__debug');
    } else {
        sessionStorage.removeItem('g3__debug');
        console.log('Debug vypnut');
        g3__debug = sessionStorage.getItem('g3__debug');
    }
}
const g3__ = {
    log: function (...args) {
        if (g3__debug) {
            console.log(...args);
        }
    },
    error: function (...args) {
        if (g3__debug) {
            console.error(...args);
        }
    },
    warn: function (...args) {
        if (g3__debug) {
            console.warn(...args);
        }
    },
    info: function (...args) {
        if (g3__debug) {
            console.info(...args);
        }
    },
};

// Zpřístupnění funkcí globálně
window.debug = debug;
window.g3__ = g3__;

// Export pro použití v jiných souborech
export { debug, g3__ };
