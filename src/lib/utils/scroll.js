import { COLUMN_COUNT } from '$lib/config/column-config'

import { _emitEvent } from '$lib/services/events';
import { _getSizeConfig } from '$lib/services/theme';

// *** START: vertical scroll handler

// last scroll time is maintained to scale down and hide the
// scroll bar after the scroll bar has been idle for 500ms
let lastScrollTime = Array(COLUMN_COUNT).fill(0);

export const __handleVerticalScroll = (event, columnIndex, vScrollAnimation) => {
    const height = Array.from(event.target.childNodes).reduce((p, c) => {
        return p + c.offsetHeight;
    }, 0);
    
    const scrollTopMax = height-(window.innerHeight-100);

    // sets the vertical scroll position of the column
    let verticalScrollValue = (window.innerHeight - 160)
        / scrollTopMax
        * event.target.scrollTop
        + 15;
        
    _emitEvent('update-vscroll', { index: columnIndex, value: verticalScrollValue});
    
    // sets the visibility and size animation of the column
    // scroll bar
    vScrollAnimation[columnIndex].set(1);
    setTimeout(() => {
        let time = (new Date()).getTime();
        if((time-lastScrollTime[columnIndex]) > 490) {
            vScrollAnimation[columnIndex].set(0);
        }
    }, 500);
    lastScrollTime[columnIndex] = (new Date()).getTime();
}

// *** END: vertical scroll handler

// *** START: horizontal scroll handler

// totalizer window size for horizontal scroll deltaX
const WINDOW_SIZE = 4;
// threshold momentum for horizontal scroll events
const WHEEL_THRESHOLD = 550;
// totalizer window
let deltaXWindow = [];
// totalizer window current position
let deltaXIndex = 0;
// ignore horizontal scroll events for debouncing
let ignore = false;

let touchStartX = null;

export const __handleTouchStart = (event) => {
    touchStartX = event.touches[0].pageX;
}

export const __handleTouchMove = (event, hScrollIndex, setHorizontalScroll) => {
    let deltaX = (event.touches[0].pageX - touchStartX)*2;
    __handleHorizontalScroll({wheelDeltaX: deltaX}, hScrollIndex, setHorizontalScroll);
}

export const __handleHorizontalScroll = (event, hScrollIndex, setHorizontalScroll) => {

    const sizeConfig = _getSizeConfig();
    // save wheel/touch event deltaX value in a window
    // deltaXWindow always contains the most recent deltaX values 
    // emitted
    deltaXWindow[deltaXIndex] = event.wheelDeltaX;
    if(deltaXIndex < WINDOW_SIZE) deltaXIndex++;
    else deltaXIndex = 0;

    if(event.wheelDeltaX && !ignore) {
        // check if window contains zero values
        // 0 values indicate a vertical scroll
        // horizontal scroll is cancelled if a 0 is found
        if(deltaXWindow.some(d => (d == 0))) return;

        // check the direction of scroll and that the direction
        // is same for all values in the window
        const direction = deltaXWindow.reduce((p,c) => {
            if(Math.sign(p) === Math.sign(c)) {
                return Math.sign(c);
            } else {
                return undefined;
            }
        });
        if(!direction) return;

        // check if the sum of deltaX values of the scroll window is
        // greater than a threshold
        const sum = Math.abs(deltaXWindow.reduce((p,c) => (p+c), 0));
        if(sum < WHEEL_THRESHOLD) return;

        // increment or decrement the hScrollIndex value based on the scroll direction
        if(direction < 0) {
            if(hScrollIndex.value < (COLUMN_COUNT - Math.ceil(window.innerWidth / sizeConfig.columnWidth))) {
                hScrollIndex.value++;
            }
        }
        if(direction > 0) {
            if(hScrollIndex.value > 0) {
                hScrollIndex.value--;
            }
        }

        let scrollTo = hScrollIndex.value * sizeConfig.columnWidth;

        // if remaining space to the right is less than the width of a column
        // scroll to the absolute edge
        const remainingSpace = (COLUMN_COUNT * sizeConfig.columnWidth + 15)
            - hScrollIndex.value * sizeConfig.columnWidth
            - window.innerWidth;
        if(remainingSpace < sizeConfig.columnWidth) {
            scrollTo += remainingSpace;
        }

        // set tween value for horizontal scroll
        setHorizontalScroll(scrollTo);

        // debounce horizontal scroll
        ignore = true; 
        setTimeout(() => {
            ignore = false;
        }, 500);

        // reset window
        deltaXWindow = [];
        deltaXIndex = 0;
    }
}

// *** END: horizontal scroll handler