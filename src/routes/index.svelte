<script context="module">
    export async function load({ fetch }) {
        const res = await fetch('/api');
        if(res.ok) return { 
            props: {
                bulletins: await res.json()
            }
        };
        return {
            status: res.status,
            error: new Error()
        };
    }
</script>

<script>
    import { COLUMNS } from '../data/columns'
    import Card from "../lib/components/card.svelte";
    import { tweened } from "svelte/motion";
    import { quartOut, backInOut } from "svelte/easing";
    import { onMount } from 'svelte';
    import { themes, current } from '$lib/utils/theme';
    import events from '$lib/services/events';
    import { _lang } from '$lib/services/store';
    import { handleHorizontalScroll, handleVerticalScroll } from '$lib/utils/scroll';

    export let bulletins;
    
    // columns count:
    // the column configuration is specified in ../data/columns
    const _count = COLUMNS.length;

    // the DOM element that contains all the columns
    // this element is moves left and right to produce the
    // horizontal scroll effect
    let columnsElement;

    ////////////////////////////////////////////////////////////////////
    // NOTE:: variables prepended with _ are number arrays that track the
    // current value of a tween of the same name
    ////////////////////////////////////////////////////////////////////

    // vertical scroll:
    // array that holds the vertical scroll positions of 
    // each indidual column
    // initial value is set to 15px to align with the edge of the card
    const vScroll = Array(_count).fill(15);
    // above value is updated by the update-vscroll event triggered by the
    // handleVerticalScroll() method
    // NOTE:: updating the value with an event ensures that the value remains
    // reactive, there might be a better way to do it
    events.register('update-vscroll').subscribe(v => {
        vScroll[v.index] = v.value;
    });

    // column scroll bar visibility and size animation
    const vScrollAnimation = Array(_count).fill(0).map(_ => tweened(0, {
        duration: 350,
        easing: quartOut
    }));
    const _vScrollAnimation = Array(_count).fill(0);

    // horizontal scroll index:
    // index of the left most column in view
    // this value is modified by both handleVerticalScroll method
    // and the nav-click event
    //
    // NOTE:: hScrollIndex is passed to handleVerticalScroll as an object so that 
    // the changes can be reflected in the component
    // https://www.tutorialspoint.com/explain-javascript-pass-by-reference-in-javascript
    let hScrollIndex = {
        value: 0
    }

    // horizontal scroll animation tween
    const hScroll = tweened(0, {
        duration: 350,
        easing: quartOut
    });

    const setHorizontalScroll = (v) => {
        hScroll.set(v);
        // emit the h-scroll event to trigger the corresponding
        // animation in the navigation bar
        events.emit('h-scroll', v);
    }

    // header bounce animation on navigation click
    const bounceAnimation = Array(_count).fill(1).map(_ => tweened(0, {
        duration: 350,
        easing: backInOut
    }));
    const _bounceAnimation = Array(_count).fill(1);

    // hook that listens to to navigation click events
    events.register('nav-click').subscribe((index) => {
        const _width = 500/window.devicePixelRatio;
        const maxLeft = (_count - Math.floor(window.innerWidth/_width))
        if(index < maxLeft) {
            hScrollIndex.value = index;
            setHorizontalScroll(_width * index);
        } else {
            hScrollIndex.value = maxLeft;
            const remainingSpace = (_count*_width + 15)
                - hScrollIndex.value * _width
                - window.innerWidth;
            hScrollIndex.value--;
            setHorizontalScroll(_width*maxLeft + remainingSpace);
        }

        bounceAnimation[index].set(8);
        setTimeout(() => {
            bounceAnimation[index].set(0);
        }, 350);
    });

    onMount(() => {
        // set columnsElement.scrolLeft to follow hScroll tween
        // hScroll is used for the horizontal scrolling animation
        hScroll.subscribe(v => (columnsElement.scrollLeft = v));
        
        // set _bounceAnimation[index] to follow 
        // bounceAnimation[index] tween
        // _bounceAnimation is used for the bounce effect of the
        // column headers
        bounceAnimation.map((t, _i) => {
            t.subscribe(v => (_bounceAnimation[_i] = v));
        })

        // set _vScrollAnimation[index] to follow 
        // vScrollAnimation[index] tween
        // _vScrollAnimation[index] is used for the vertical scroll
        // bar visibility and size animation
        vScrollAnimation.map((t, _i) => {
            t.subscribe(v => {
                _vScrollAnimation[_i] = v;
            });
        })
    });

</script>

<div 
    class="columns"
    style="--background: {themes[$current].background}"
    bind:this={columnsElement}
    on:wheel|stopPropagation={(e) => {
        handleHorizontalScroll(e, hScrollIndex, setHorizontalScroll)
    }}>
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
                        class="header _clickable"
                        on:click={() => events.emit('nav-click', _i)}
                        style="
                            background-color: {themes[$current].columns[_i+1]};
                            top: {_bounceAnimation[_i]}px">
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
                    on:scroll|stopPropagation={(e) => handleVerticalScroll(e, _i, vScrollAnimation)}>
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
                            top: {vScroll[_i]}px;
                            opacity: {_vScrollAnimation[_i]};
                            height: {_vScrollAnimation[_i]*25}px">
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
        --column-width: var(--s500px);
        --header-height: var(--s50px);
        --color: white;
        --padding: var(--s6px);
        overflow: hidden;
        background-color: var(--background);
    }
    .column {
        position: relative;
        width: var(--column-width);
        height: calc(100vh - var(--s50px));
    }
    .header {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: var(--header-height);
        color: var(--color);
        padding: 0 var(--s15px) 0 var(--s10px);
        font-weight: bold;
        z-index: 2;
    }
    .header div {
        display: flex;
        align-items: center;
        height: 100%;
    }
    .header:first-child {
		font-size: var(--s24px);
    }
    .header span {
        text-shadow: 0px 0px 3px #1b1b1b, 0 0 8px #525252;
        font-size: 1.2rem;
        margin-left: var(--s10px);
    }
    .fa-add {
        font-size: var(--s17px);
    }

    /* cards */
    .cards {
        position: relative;
        width: 100%;
        height: calc(100vh - var(--s100px));
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
        height: calc(100vh - var(--s50px));
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
        top: var(--s50px);
        right: 0;
    }
    .scroll {
        position: absolute;
        overflow: hidden;
        top: var(--s20px);
        right: var(--s-3_75px);
        width: var(--s7_5px);
        border-radius: var(--s7_5px);
        opacity: 0.5;
        background-color: rgba(0,0,0,0.4);
    }
    
</style>