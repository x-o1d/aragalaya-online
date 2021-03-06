<!-- this component creates the index route, or the initial route
---- which is loaded when the app starts.
---- it creates a multiple column layout which can be configured
---- in src/lib/config/column-config.js
--->
<script>
    // config
    import { COLUMNS, COLUMN_COUNT }from '$lib/config/column-config'
    
    // npm modules
    import { tweened } from "svelte/motion";
    import { quartOut, backInOut } from 'svelte/easing';
    import { onMount, onDestroy } from 'svelte';
    
    // services
    import { _registerEvent, _emitEvent } from '$lib/services/events';
    import { _lang } from '$lib/services/store';
    import { _userSignedIn } from '$lib/services/auth';
    import { _themes } from '$lib/services/theme';
    import { _getPost } from '$lib/services/database';

    // helpers
    import { __handleHorizontalScroll, __handleVerticalScroll } from '$lib/utils/scroll';

    // components
    import Nav from './_components/fixed/nav.svelte'
    import Font from '$lib/components/display/font.svelte';
    import Empty from './_components/posts/empty.svelte';
    import Bulletin from './_components/posts/bulletin.svelte';
    import News from './_components/posts/news.svelte';
    
    // the component of the card to be loaded for a particular column
    // data.type = component'
    // refer: comments in columns.js config file
    // NOTE:: if a component is not specified for a column type it will load an
    // empty card
    export const COMPONENTS = {
        bulletin: Bulletin,
        newsx: News,
        empty: Empty
    }

    // column data, this is populated by the page endpoint (./index.js)
    // using the page endpoint allows the data to be fetched in the backend
    // itself for SSR
    export let columnData;

    // when new data is added by a form it's inserted to the column
    // by this listener
    const newColumnDataEvent = _registerEvent('new-column-data').subscribe(async (event) => {
        const data = event.postData;
        data._slideInTop = true;
        columnData[event.columnIndex].unshift(data);
        // trigger template update
        columnData = columnData;
    })
    // clear subscription
    onDestroy(() => newColumnDataEvent.unsubscribe());

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
    const vScroll = Array(COLUMN_COUNT).fill(15);
    // above value is updated by the update-vscroll event triggered by the
    // handleVerticalScroll() method
    // NOTE:: updating the value with an event ensures that the value remains
    // reactive, there might be a better way to do it
    const vScrollEvent = _registerEvent('update-vscroll').subscribe(v => {
        vScroll[v.index] = v.value;
    });
    // clear subscription
    onDestroy(() => {
        vScrollEvent.unsubscribe();
    })

    // column scroll bar visibility and size animation
    const vScrollAnimation = Array(COLUMN_COUNT).fill(0).map(_ => tweened(0, {
        duration: 350,
        easing: quartOut
    }));
    const _vScrollAnimation = Array(COLUMN_COUNT).fill(0);

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
        _emitEvent('h-scroll', v);
    }

    // header bounce animation on navigation click
    const bounceAnimation = Array(COLUMN_COUNT).fill(1).map(_ => tweened(0, {
        duration: 350,
        easing: backInOut
    }));
    const _bounceAnimation = Array(COLUMN_COUNT).fill(1);

    // hook that listens to to navigation click events
    _registerEvent('nav-click').subscribe((index) => {
        const _width = 500/window.devicePixelRatio;
        const maxLeft = (COLUMN_COUNT - Math.floor(window.innerWidth/_width))
        if(index < maxLeft) {
            hScrollIndex.value = index;
            setHorizontalScroll(_width * index);
        } else {
            hScrollIndex.value = maxLeft;
            const remainingSpace = (COLUMN_COUNT*_width + 15)
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

    // NOTE:: sunscriptions in this onMount function can potentially be
    // automatically subscribed through reactive declarations, 
    // have to try it out.
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

    // header + icon click event
    const addDocument = (event, index) => {
        if(_userSignedIn()) {
            _emitEvent('show-add-document-form', {columnIndex: index});
        } else {
            _emitEvent('show-hide-login', true);
        }
    }

</script>

<!-- Nav is the navigation bar component which is a fixed overlay-->
<Nav/>

<div 
    class="columns"
    bind:this={columnsElement}
    on:wheel|stopPropagation={(e) => {
        __handleHorizontalScroll(e, hScrollIndex, setHorizontalScroll)
    }}>
	<ul>
        <li 
            class="spacer"
            style="--background: var(--theme-columns-0);">
        </li>
        {#each COLUMNS as column, _i}
        <li>
            <div class="column">
                <div style="background-color: #e6e6e6;">
                    <div 
                        class="header _clickable"
                        on:click={() => _emitEvent('nav-click', _i)}
                        style="
                            background-color: var(--theme-columns-{_i+1});
                            top: {_bounceAnimation[_i]}px">
                        <div>
                            <i class="{column.icon}"></i>
                            <span>
                                <Font 
                                    font={2}
                                    size={0.95}>
                                    {column.title[$_lang]}
                                </Font>
                            </span>
                        </div>
                        <div>
                            <div 
                                class='icon-button'
                                on:click|stopPropagation={(e) => addDocument(e, _i)}>
                                <i class="fa-solid fa-add"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div 
                    class="cards"
                    on:scroll|stopPropagation={(e) => __handleVerticalScroll(e, _i, vScrollAnimation)}>
                    {#each columnData[_i] as item, _i (item.id)}

                    <div>
                        <svelte:component 
                            this={COMPONENTS[column.type] || Empty}
                            data={item}/>
                    </div>
                    {/each}
                </div>
                <div class="scrollbar">
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
            style="--background: var(--theme-columns-{COLUMN_COUNT-1});">
        </li>
	</ul>
</div>

<style> 
    /* column headers */
    ul {
		display: inline-flex;
		align-items: center;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	li {
		display: inline-flex;
	}
	.columns {
        overflow: hidden;
        background-color: var(--theme-columnbackground);
    }
    .column {
        position: relative;
        width: var(--theme-columnwidth);
        height: calc(100vh - var(--s50px));
    }
    .header {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: var(--theme-headerheight);
        color: var(--theme-headerfontcolor);
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
        margin-left: var(--s10px);
    }
    .icon-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;

        width: 35px;
        height: 35px;

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
        padding: var(--theme-cardseparationhalf) 0;
    }
    .cards::-webkit-scrollbar {
        display: none;
        /* for Chrome, Safari, and Opera */
    }
    .spacer {
        width: var(--theme-cardseparationhalf);
        height: calc(100vh - var(--s50px));
    }
    .spacer::after {
        display: block;
        content: '';
        height: var(--theme-headerheight);
        width: var(--theme-cardseparationhalf);
        background-color: var(--background);
    }
    .scrollbar {
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