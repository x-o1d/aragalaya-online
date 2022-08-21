import { COLUMN_COUNT } from '$lib/config/column-config'

import { tweened } from "svelte/motion";
import { quartOut, backInOut } from 'svelte/easing';

import { _getSizeConfig } from '$lib/services/theme';
import { _eventListener, _emitEvent } from '$lib/services/events';
import { _isMobile } from '$lib/services/theme';

// if the app is loaded in a mobile browser
let isMobile = false;
_isMobile.subscribe(v => isMobile = v);

let sizeConfig;

// horizontal scroll index:
// index of the left most column in view
// this value is modified by both handleVerticalScroll method
// and the nav-click event
let hScrollIndex = 0;

// tween for the horizontal scroll animation of the app window element
const hScrollPositionTween = tweened(0, {
    duration: 350,
    easing: quartOut
});

// tweens for the scroll position animation of each column
const vScrollPositionTweens = Array(COLUMN_COUNT).fill(false).map(_ => tweened(0, {
    duration: 350,
    easing: quartOut
}))

// tweens for the scroll bar position of each column
const vScrollBarTweens = Array(COLUMN_COUNT).fill(false).map(_ => tweened(15, {
    duration: 350,
    easing: quartOut
}))

// tweens for the scroll bar animation of each column
const vScrollBarAnimationTweens = Array(COLUMN_COUNT).fill(0).map(_ => tweened(0, {
    duration: 350,
    easing: quartOut
}));

// header bounce animation on navigation click
const headerBounceAnimationTweens = Array(COLUMN_COUNT).fill(1).map(_ => tweened(0, {
    duration: 350,
    easing: backInOut
}));

// navigation menu scroll bar animation tween
const navScrollPositionTween = tweened(0, {
    duration: 350,
    easing: quartOut
});

let _appWindowElement;
let _columnElements;
let _columnScrollBarElements;
let _columnHeaderElements;
let _navScrollElement;

// last scroll time is maintained to scale down and hide the
// scroll bar after the scroll bar has been idle for 500ms
let lastScrollTime = Array(COLUMN_COUNT).fill(0);

export const _setupIndexAnimations = (
    appWindowElement, 
    columnElements, 
    columnScrollBarElements,
    columnHeaderElements
) => {
    _appWindowElement = appWindowElement;
    _columnElements = columnElements;
    _columnScrollBarElements = columnScrollBarElements;
    _columnHeaderElements = columnHeaderElements;
    
    // get the size configuration based on theme
    sizeConfig = _getSizeConfig();

    // set app window element scrollLeft to follow the _hScroll tween
    hScrollPositionTween.subscribe(v => {
        _appWindowElement.scrollLeft = v;
    });

    // set column element scrollTop to follow the _vScroll tween
    vScrollPositionTweens.map((t, _i) => {
        t.subscribe(v => {
            columnElements[_i].scrollTop = v;
        });
    });

    // set scroll bar element top to follow the _vScrollBar tween
    vScrollBarTweens.map((t, _i) => {
        t.subscribe(v => {
            columnScrollBarElements[_i].style.top = v + 'px';
        });
    });

    // set scroll bar element opacity and height to follow the 
    // _vScrollBarAnimation tween
    vScrollBarAnimationTweens.map((t, _i) => {
        t.subscribe(v => {
            columnScrollBarElements[_i].style.opacity = v;
            columnScrollBarElements[_i].style.height = v*25 + 'px';
        });
    });

    // set column header top value to follow the header bounce
    // animation tween
    headerBounceAnimationTweens.map((t, _i) => {
        t.subscribe(v => {
            columnHeaderElements[_i].style.top = v + 'px';
        });
    });

    // setup a listener for navigation menu click events
    _eventListener('nav-click').subscribe((index) => {
        // find the maximum horizontalIndex that can be scrolled to
        const maxLeft = (COLUMN_COUNT - Math.floor(window.innerWidth/sizeConfig.columnWidth));

        // if clicked index smaller than max left, scroll to it
        if(index < maxLeft) {
            hScrollIndex = index;
            hScrollPositionTween.set(sizeConfig.columnWidth * index);
        } 
        // if not scroll to the absolute edge
        else {
            hScrollIndex = maxLeft;
            hScrollPositionTween.set((COLUMN_COUNT * sizeConfig.columnWidth + 15) - window.innerWidth);
        }

        // trigger the column header bounce animation on desktop browsers
        if(!isMobile) {
            headerBounceAnimationTweens[index].set(8);
            setTimeout(() => {
                headerBounceAnimationTweens[index].set(0);
            }, 350);
        }
    });
}

export const _setupNavAnimations = (scrollElement) => {
    _navScrollElement = scrollElement;

    // set navigation bar sc
    navScrollPositionTween.subscribe(v => {
        scrollElement.style.top = v + 'px';
    });
}

// *** START: vertical scroll handler

// draws and animates the scroll bar element according to the scroll
// position
let columnHeight;
export const _handleColumnScroll = (event, columnIndex) => {

    // calculate the height of the column
    // it is calculated for once a single scroll session and reset by
    // the below set timeout (500ms after scroll has stopped)
    if(!columnHeight) {
        columnHeight = Array.from(event.target.childNodes).reduce((p, c) => {
            return p + c.offsetHeight;
        }, 0);
    }

    // maximum scroll height
    // 100 = layout header height + column header height
    const maxScrollHeight = columnHeight-(window.innerHeight-100);

    // calculate the scroll bar position
    const columnScrollBarPosition = (window.innerHeight - 160)
        / maxScrollHeight
        * event.target.scrollTop
        + 15;

    // set the column scroll position tween
    // _columnElements[columnIndex].scrollTop = columnScrollBarPosition;
    // vScrollPositionTweens[columnIndex].set(columnVScrollPosition[columnIndex]);
    // set the scroll bar position tween
    vScrollBarTweens[columnIndex].set(columnScrollBarPosition);
    // sets the visibility and size animation tween of the scroll bar
    vScrollBarAnimationTweens[columnIndex].set(1);
    // hide the scroll bar 500 ms after the last scroll
    setTimeout(() => {
        let time = (new Date()).getTime();
        if((time-lastScrollTime[columnIndex]) > 490) {
            vScrollBarAnimationTweens[columnIndex].set(0);
            columnHeight = undefined;
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

export const _handleWheel = (event) => {
    
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
            if(hScrollIndex < (COLUMN_COUNT - Math.ceil(window.innerWidth / sizeConfig.columnWidth))) {
                hScrollIndex++;
            }
        }
        if(direction > 0) {
            if(hScrollIndex > 0) {
                hScrollIndex--;
            }
        }

        let scrollTo = hScrollIndex * sizeConfig.columnWidth;

        // if remaining space to the right is less than the width of a column
        // scroll to the absolute edge
        const remainingSpace = (COLUMN_COUNT * sizeConfig.columnWidth + 15)
            - hScrollIndex * sizeConfig.columnWidth
            - window.innerWidth;
        if(remainingSpace < sizeConfig.columnWidth) {
            scrollTo += remainingSpace;
        }

        // set tween value for horizontal scroll
        hScrollPositionTween.set(scrollTo);
        // set tween value for the scroll bar on the navigation menu
        navScrollPositionTween.set(sizeConfig.navSize*hScrollIndex);

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

let touchStartX = null;

export const _handleTouchStart = (event) => {
    touchStartX = event.touches[0].pageX;
}

export const _handleTouchMove = (event) => {
    let deltaX = (event.touches[0].pageX - touchStartX)*2;
    __handleHorizontalScroll({wheelDeltaX: deltaX});
}
