<script>
    import { COLUMNS } from '../data/columns'
    import Card from "../lib/components/Card.svelte";
    import { tweened } from "svelte/motion";
    import { quartOut, backInOut } from "svelte/easing";
    import { onMount } from 'svelte';
    import { themes, current } from '$lib/utils/theme';
    import events from '$lib/services/events';
    import { _lang } from '$lib/services/store';
    
    const _count = COLUMNS.length;

    const WINDOW_SIZE = 3;
    let deltaXWindow = [];
    let deltaXIndex = 0;

    let leftColumn = 0;
    let columnsElement;

    let scrollColumn = Array(_count).fill(15);

    const hScroll = tweened(0, {
        duration: 350,
        easing: quartOut
    });

    function _hScroll(v) {
        hScroll.set(v);
        events.emit('h-scroll', v);
    }

    const scrollAnimation = Array(_count).fill(0).map(_ => tweened(0, {
        duration: 350,
        easing: quartOut
    }));
    const _scrollAnimation = Array(_count).fill(0);

    const headerAnimation = Array(_count).fill(1).map(_ => tweened(0, {
        duration: 350,
        easing: backInOut
    }));
    const _headerAnimation = Array(_count).fill(1);

    events.register('nav-click').subscribe((index) => {
        const maxLeft = (_count - Math.floor(window.innerWidth/500))
        if(index < maxLeft) {
            leftColumn = index;
            _hScroll(500*index);
        } else {
            leftColumn = maxLeft;
            const remainingSpace = (_count*500 + 15)
                - leftColumn*500
                - window.innerWidth;
            leftColumn --;
            _hScroll(500*maxLeft + remainingSpace);
        }

        headerAnimation[index].set(8);
        setTimeout(() => {
            headerAnimation[index].set(0);
        }, 350);
    });

    onMount(() => {
        // set columns scroll left to follow hScroll tween
        hScroll.subscribe(v => (columnsElement.scrollLeft = v));
        headerAnimation.map((t, _i) => {
            t.subscribe(v => _headerAnimation[_i] = v);
        })
        scrollAnimation.map((t, _i) => {
            t.subscribe(v => {
                _scrollAnimation[_i] = v
            });
        })
    });

    let ignore = false;
    function handleHorizontalScroll (event) {
        // save wheel/touch event delta x in a window
        deltaXWindow[deltaXIndex] = event.wheelDeltaX;
        if(deltaXIndex < WINDOW_SIZE) deltaXIndex++;
        else deltaXIndex = 0;

        if(event.wheelDeltaX && !ignore) {
            // check if window contains zero values
            // 0 values indicate a vertical scroll
            if(!deltaXWindow.some(d => (d == 0))) {

                // check if all the values in the window point
                // in the same direction
                let direction = deltaXWindow.reduce((p,c) => {
                    if(Math.sign(p) === Math.sign(c)) {
                        return Math.sign(c);
                    } else {
                        return undefined
                    }
                });

                if(direction) {
                    if(direction < 0) {
                        if(leftColumn < (_count - Math.ceil(window.innerWidth/500))) {
                            leftColumn++;
                        }
                    }
                    if(direction > 0) {
                        if(leftColumn > 0) {
                            leftColumn--;
                        }
                    }
                    let scrollTo = leftColumn*500;

                    const remainingSpace = (_count*500 + 15)
                        - leftColumn*500
                        - window.innerWidth;

                    if(remainingSpace < 500) {
                        scrollTo += remainingSpace;
                    }

                    // set tween value for vertical scroll
                    _hScroll(scrollTo);

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
        }
        event.stopPropagation();
    }

    let lastScrollTime = Array(_count).fill(0);
    function handleVerticalScroll(event, index) {
        scrollColumn[index] = (window.innerHeight - 145)
            / event.originalTarget.scrollTopMax
            * event.originalTarget.scrollTop
            + 15;

        scrollAnimation[index].set(1);
        setTimeout(() => {
            let time = (new Date()).getTime();
            if((time-lastScrollTime[index]) > 490) {
                scrollAnimation[index].set(0);
            }
        }, 500);
        lastScrollTime[index] = (new Date()).getTime();
    }

</script>

<div 
    class="columns"
    style="--background: {themes[$current].background}"
    bind:this={columnsElement}
    on:wheel|stopPropagation={(e) => handleHorizontalScroll(e)}>
	<ul>
        <li 
            class="spacer"
            style="--background: {themes[$current].columns[0]}">
        </li>
        {#each COLUMNS as column, _i}
        <li>
            <div class="column">
                <div style="background-color: #e6e6e6;">
                    <div 
                        class="header"
                        style="
                            background-color: {themes[$current].columns[_i]};
                            top: {_headerAnimation[_i]}px">
                        <div>
                            <i class="{column.icon}"></i>
                            <span>{column.title[$_lang]}</span>
                        </div>
                        <div>
                            <i class="fa-solid fa-add"></i>
                        </div>
                    </div>
                </div>
                <div 
                    class="cards"
                    on:scroll={(e) => handleVerticalScroll(e, _i)}>
                    {#each Array(10) as _}
                    <div class="card_c">
                        <Card>
                            <div style="height: {column.height};"></div>
                        </Card>
                    </div>
                    {/each}
                </div>
                <div class="scroll_c">
                    <div 
                        class="scroll"
                        style="
                            top: {scrollColumn[_i]}px;
                            opacity: {_scrollAnimation[_i]};
                            height: {_scrollAnimation[_i]*30}px">
                    </div>
                </div>
            </div>
        </li>
        {/each}
        <li 
            class="spacer"
            style="--background: {themes[$current].columns[_count - 1]}">
        </li>
	</ul>
</div>

<style> 
    /* column headers */
	.columns {
        --column-width: 500px;
        --header-height: 50px;
        --color: white;
        --padding: 7.5px;
        overflow: hidden;
        background-color: var(--background);
    }
    .column {
        position: relative;
        width: var(--column-width);
        height: calc(100vh - 50px);
    }
    .header {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: var(--header-height);
        color: var(--color);
        padding: 0 15px 0 10px;
        font-weight: bold;
        z-index: 2;
    }
    .header div {
        display: flex;
        align-items: center;
        height: 100%;
    }
    .header:first-child {
		font-size: 24px;
    }
    .header span {
        font-size: 1.3rem;
        margin-left: 10px;
    }
    .fa-add {
        font-size: 17px;
    }

    /* cards */
    .cards {
        position: relative;
        width: 100%;
        height: calc(100vh - 100px);
        overflow-y: scroll;
        overflow-x: hidden;
        -ms-overflow-style: none;
        scrollbar-width: none;
        padding: var(--padding) 0;
    }
    .cards::-webkit-scrollbar {
        display: none;
        /* for Chrome, Safari, and Opera */
    }
    .card_c {
        padding: var(--padding);
    }
    .spacer {
        width: var(--padding);
        height: calc(100vh - 50px);
    }
    .spacer::after {
        display: block;
        content: '';
        height: var(--header-height);
        width: var(--padding);
        background-color: var(--background);
    }
    .scroll_c {
        position: absolute;
        top: 50px;
        right: 0;
    }
    .scroll {
        position: absolute;
        overflow: hidden;
        top: 20px;
        right: -3.75px;
        width: 7.5px;
        border-radius: 7.5px;
        opacity: 0.5;
        background-color: rgba(0,0,0,0.4);
    }
    
</style>