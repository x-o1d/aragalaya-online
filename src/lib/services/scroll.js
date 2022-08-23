import { COLUMN_COUNT } from '$lib/config/column-config'

import { tweened } from "svelte/motion";
import { quartOut, backInOut } from 'svelte/easing';
import { v4 as uuid } from 'uuid';

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
    _eventListener('nav-click').subscribe(({index, change}) => {
        // find the maximum horizontalIndex that can be scrolled to
        const maxLeft = (COLUMN_COUNT - Math.floor(window.innerWidth/sizeConfig.columnWidth));
        // if change is true index is added to the current 
        // horizontal index
        if(change) {
            if(((index < 0) && (hScrollIndex > 0)) ||
                    ((index > 0) && (hScrollIndex < maxLeft))) {
                index += hScrollIndex;
            } else {
                scrollEndAnimation(hScrollIndex? 1: -1);
                return;
            }
            
        }

        // if clicked index smaller than max left, scroll to it
        if(index < maxLeft) {
            hScrollIndex = index;
            hScrollPositionTween.set(sizeConfig.columnWidth * index);
            navScrollPositionTween.set(hScrollIndex * sizeConfig.navSize);
        } 
        // if not scroll to the absolute edge
        else {
            hScrollIndex = maxLeft;
            hScrollPositionTween.set((COLUMN_COUNT * sizeConfig.columnWidth + 15) - window.innerWidth);
            navScrollPositionTween.set(hScrollIndex * sizeConfig.navSize);
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

// every time a scroll event is received a unique id is created for it 
// and saved in lastWheelEventId.
// checkLastScrollEventId() stores this id in it's closure
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures
// when the setTimeout() callback triggers after N milliseconds
// if lastScrollEventId hasn't changed, that means no new scroll events
// has been received in the last N milliseconds.
// this is assumed to be the end of the scroll move operation and the
// scroll bar is hidden
let lastScrolEventIds = Array(COLUMN_COUNT).fill(0);
// draws and animates the column scroll bar element according to the scroll
// position of each column
let columnHeight;
export const _handleColumnScroll = (event, columnIndex) => {
    // scrollbar animation is diabled in mobile for performance
    // on low end devices
    if(isMobile) return;

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

    const checkLastScrollEventId = (scrollEventId) => {
        setTimeout(() => {
            if(scrollEventId == lastScrolEventIds[columnIndex]) {
                vScrollBarAnimationTweens[columnIndex].set(0);
                // reset columnHeight so that it will be recalculated
                // in the next scroll event
                columnHeight = undefined;
            }
        }, 500);
    }
    lastScrolEventIds[columnIndex] = uuid();
    checkLastScrollEventId(lastScrolEventIds[columnIndex]);
}

// *** END: column scroll bar animation

// *** START: handle wheel event

// every time a wheel event is received a unique id is created for it 
// and saved in lastWheelEventId.
// checkLastWheelEventId() stores this id in it's closure
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures
// when the setTimeout() callback triggers after N milliseconds
// if lastWheelEventId hasn't changed, that means no new wheel events
// has been received in the last N milliseconds.
// this is assumed to be the end of the wheel move operation and emulateWheelEnd()
// is called.
let lastWheelEventId = null;
// handles wheel (touchpad/mousewheel) events
export const _handleWheel = (event) => {
    unfiedMoveHandler(event.wheelDeltaX/8, event.wheelDeltaY/8);

    const checkLastWheelEventId = (wheelEventId) => {
        setTimeout(() => {
            if(wheelEventId == lastWheelEventId) {
                emulatedWheelEnd();
            }
        }, 300);
    }
    lastWheelEventId = uuid();
    checkLastWheelEventId(lastWheelEventId);
}

// handle mouse wheel/touchpad end
// this function emulates the touchend behavior for
// wheel events
const emulatedWheelEnd = () => {
    unifiedMoveEnd();
}

// *** END: handle wheel events

// *** START: handle touch events

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

// *** END: handle touch events

// *** START: horizontal scroll

let moveDeltaXCache = [];
let moveDeltaYCache = [];

let moved = false;

// both wheel and touch events are merged into this handler
const unfiedMoveHandler = (deltaX, deltaY) => {
    // check if the current delta directio is the same as the previous in
    // cache, if not consider the gesture has ended
    if(moveDeltaXCache[0] && (Math.sign(deltaX) != Math.sign(moveDeltaXCache[0]))) {
        unifiedMoveEnd();
        return;
    }
    // ignore events after move has been triggered, until unifiedMoveEnd() has been
    // called
    if(moved) return;

    moveDeltaXCache.unshift(deltaX);
    moveDeltaYCache.unshift(deltaY);

    const MOVE_THRESHOLD = 20;

    // call peek or move based on the values in the xCache
    let xTotal = 0;
    moveDeltaXCache.findIndex((_, _i) => {
        // deltaX value is divided by the deltaY value so that
        // the movement in the x direction would be less if the 
        // touch is moving at an angle
        xTotal += (Math.abs(moveDeltaXCache[_i])/(Math.abs(moveDeltaYCache[_i])+1));

        if(!moved && (xTotal > MOVE_THRESHOLD)) {
            move(Math.sign(-1*deltaX));
            return true;
        }
    });

    const HIDE_NAV_THRESHOLD = 16;

    // hide navbar based on the values in the yCache
    let yTotal = 0;
    moveDeltaYCache.findIndex((_, _i) => {
        // deltaY value is divided by the deltaX value so that
        // the movement in the y direction would be less if the 
        // touch also has a component in the x direction
        yTotal += (Math.abs(moveDeltaYCache[_i])/(Math.abs(moveDeltaXCache[_i])+1));
        if(yTotal > HIDE_NAV_THRESHOLD) {
            _emitEvent('hide-nav-menu');
        }
    });
}

// both wheel/touch end events are merged into handler
const unifiedMoveEnd = () => {
    moveDeltaXCache = [];
    moveDeltaYCache = [];
    moved = false;

    // enable vertical scroll on the column
    // _columnElements.map(c => c.style.overflowY = 'scroll');
}

// switch to the next column
const move = (direction) => {
    // maximum column you can scroll to based on screen size
    const hScrollIndexMax = Math.floor(
                                ((COLUMN_COUNT * sizeConfig.columnWidth) 
                                    // add spacer width for desktop browsers
                                    + (isMobile? 0: sizeConfig.cardSeparation)
                                    - window.innerWidth)
                                / sizeConfig.columnWidth);
    // move to the left column
    if((direction < 0) && (hScrollIndex > 0)) {
        hScrollIndex--;
        hScrollPositionTween.set(getHorizontalScrollPosition());
        navScrollPositionTween.set(hScrollIndex * sizeConfig.navSize);
    } 
    // move to the right column
    else if((direction > 0) && (hScrollIndex < hScrollIndexMax)) {
        hScrollIndex++;
        hScrollPositionTween.set(getHorizontalScrollPosition());
        navScrollPositionTween.set(hScrollIndex * sizeConfig.navSize);
    } 
    // end of scroll
    else {
        scrollEndAnimation(direction);
    }
    moved = true;
}

const scrollEndAnimation = (direction) => {
    const SCROLL_END_ANIMATION = 10;
    hScrollPositionTween.set(getHorizontalScrollPosition() - (SCROLL_END_ANIMATION*direction), {
        duration: 100
    });
    setTimeout(() => {
        hScrollPositionTween.set(getHorizontalScrollPosition());
    }, 100);
}

// calculate the scrollLeft value for the current hScrollIndex value
const getHorizontalScrollPosition = () => {
    let scrollTo = hScrollIndex * sizeConfig.columnWidth;

    // calculate remaining space to the right after the move.
    const remainingSpace = (COLUMN_COUNT * sizeConfig.columnWidth)
        // add spacer width for desktop browsers
        + (isMobile? 0: sizeConfig.cardSeparation)
        - scrollTo
        - window.innerWidth;

    // if the remaining space is less than a column width
    // scroll to the absolute edge
    if(remainingSpace < sizeConfig.columnWidth) {
        scrollTo += remainingSpace;
    }
    return scrollTo;
}

// *** END: horizontal scroll