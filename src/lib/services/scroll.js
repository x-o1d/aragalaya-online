import { COLUMN_COUNT } from '$lib/config/column-config'

import { tweened } from "svelte/motion";
import { quartOut, backInOut } from 'svelte/easing';

import { _getSizeConfig } from '$lib/services/theme';
import { _eventListener, _emitEvent } from '$lib/services/events';
import { _isMobile } from '$lib/services/theme';
import { of } from 'rxjs';

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

// setup the scroll related animations for the index route (index.svelte)
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
}

// setup the horizontal scroll animations for the navigation menu
export const _setupNavAnimations = (scrollElement) => {
    _navScrollElement = scrollElement;

    // set navigation bar sc
    navScrollPositionTween.subscribe(v => {
        scrollElement.style.top = v + 'px';
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

// *** START: column scroll bar animation

// last scroll time is maintained to scale down and hide the
// scroll bar after the scroll bar has been idle for 500ms
let lastScrollTime = Array(COLUMN_COUNT).fill(0);

// draws and animates the column scroll bar element according to the scroll
// position of each column
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

// *** START: end column scroll bar animation

// last wheel time is used to determine when the wheel operation ends
// if _handleWheel desn't get a wheel event for 500ms it calls wheelEnd()
// this way wheelEnd can be used similar to browser touchEnd event
let lastWheelTime = 0;
// handles wheel (touchpad/mousewheel) events
export const _handleWheel = (event) => {
    unfiedMoveHandler(event.wheelDeltaX/4, event.wheelDeltaY/4);

    setTimeout(() => {
        let time = (new Date()).getTime();
        if((time-lastWheelTime) > 490) {
            emulatedWheelEnd();
        }
    }, 500);
    lastWheelTime = (new Date()).getTime();
}

// holds the previous touch position to calculate the delta
let touchStartX = null;
let touchStartY = null;

// handle mobile touch start
export const _handleTouchStart = (event) => {
    touchStartX = event.touches[0].pageX;
    touchStartY = event.touches[0].pageY;
}

// handle mobile touch move
export const _handleTouchMove = (event) => {
    const deltaX = event.touches[0].pageX - touchStartX;
    const deltaY = event.touches[0].pageY - touchStartY;
    touchStartX = event.touches[0].pageX;
    touchStartY = event.touches[0].pageY;
    unfiedMoveHandler(deltaX, deltaY);
}

// handle mobile touch end
export const _handleTouchEnd = (event) => {
    unifiedMoveEnd();
}
// handle mouse wheel/touchpad end
const emulatedWheelEnd = () => {
    unifiedMoveEnd();
}

// when a move event ends reset the delta cache
const unifiedMoveEnd = () => {
    moveDeltaXCache = [];
    moveDeltaYCache = [];
    peeked = false;
    moved = false;

    // if peek has been activated return to the original position
    hScrollPositionTween.set(hScrollIndex * sizeConfig.columnWidth);
    // enable vertical scroll on the column
    _columnElements.map(c => c.style.overflowY = 'scroll');
}

let total = 0;

let moveDeltaXCache = [];
let moveDeltaYCache = [];

let peeked = false;
let moved = false;

const unfiedMoveHandler = (deltaX, deltaY) => {
    if(moveDeltaXCache[0] && (Math.sign(deltaX) != Math.sign(moveDeltaXCache[0]))) {
        unifiedMoveEnd();
        return;
    }
    if(peeked && moved) return;

    moveDeltaXCache.unshift(deltaX);
    moveDeltaYCache.unshift(deltaY);

    const PEEK_THRESHOLD = 20;
    const MOVE_THRESHOLD = 40;

    // call peek or move based on the values in the xCache
    let xTotal = 0;
    moveDeltaXCache.findIndex((_, _i) => {
        // deltaX value is divided by the deltaY value so that
        // the movement in the x direction would be less if the 
        // touch is moving at an angle
        xTotal += Math.abs(moveDeltaXCache[_i])/(Math.abs(moveDeltaYCache[_i])+1);

        if(!peeked && (xTotal > PEEK_THRESHOLD)) {
            peek(Math.sign(-1*deltaX));
            peeked = true;
        }
        if(!moved && (xTotal > MOVE_THRESHOLD)) {
            move(Math.sign(-1*deltaX));
            moved = true;
            return true;
        }
    });

    const HIDE_NAV_THRESHOLD = 20;

    // hide navbar based on the values in the yCache
    let yTotal = 0;
    moveDeltaYCache.findIndex((_, _i) => {
        // deltaX value is divided by the deltaY value so that
        // the movement in the x direction would be less if the 
        // touch is moving at an angle
        yTotal += Math.abs(moveDeltaYCache[_i])/(Math.abs(moveDeltaXCache[_i])+1);

        if(yTotal > HIDE_NAV_THRESHOLD) {
            _emitEvent('hide-nav-menu');
        }
    });
}

// peek the next column without switching to it. if the user let's 
// go of the touch or moves in the opposite direction, the column 
// would return to the original position
const peek = (direction) => {
    // disable vertical scroll on the column
    _columnElements.map(c => c.style.overflowY = 'hidden');

    const PEEK_DISTANCE = 24;
    const scrollMax = COLUMN_COUNT * sizeConfig.columnWidth - window.innerWidth;

    let scrollTo = hScrollIndex * sizeConfig.columnWidth + (PEEK_DISTANCE*direction);

    // scroll to the peek position
    if((scrollTo < scrollMax) && (scrollTo > 0)) {
        hScrollPositionTween.set(scrollTo);
    }
}

// switch to the next column
const move = (direction) => {
    if((direction < 0) && (hScrollIndex > 0)) {
        hScrollIndex--;
    }
    if((direction > 0) && (hScrollIndex < COLUMN_COUNT)) {
        hScrollIndex++;
    }
    let scrollTo = hScrollIndex * sizeConfig.columnWidth;

    // calculate remaining space to the right after the move.
    const remainingSpace = (COLUMN_COUNT * sizeConfig.columnWidth + 15)
        - scrollTo
        - window.innerWidth;

    // if the remaining space is less than a column width
    // scroll to the absolute edge
    if(remainingSpace < sizeConfig.columnWidth) {
        scrollTo += remainingSpace;
    }

    hScrollPositionTween.set(scrollTo);
}