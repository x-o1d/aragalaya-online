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
    import { stripHtml } from  'string-strip-html';
    
    // services
    import { _eventListener, _emitEvent } from '$lib/services/events';
    import { _lang } from '$lib/services/store';
    import { _userSignedIn } from '$lib/services/auth';
    import { _themes, _isMobile, _getSizeConfig } from '$lib/services/theme';
    import { _getPost } from '$lib/services/database';
    import { _getFileURL } from '$lib/services/storage';

    // helpers
    import { __handleHorizontalScroll, __handleTouchMove, __handleTouchStart, __handleVerticalScroll } from '$lib/utils/scroll';

    // components
    import Nav from './_components/fixed/nav.svelte'
    import Font from '$lib/components/display/font.svelte';
    import Empty from './_components/posts/empty.svelte';
    import Bulletin from './_components/posts/bulletin.svelte';
    import News from './_components/posts/news.svelte';
    import Post from './_components/fixed/post.svelte';
    
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

    // if a postId was specified in the url, the data for that post will be
    // available in this prop, this is populated by the page endpoint (./index.js)
    export let postData;

    // triggered by the Toolbar component when show post button is clicked
    // this assigns the post data 
    const showPostEvent = _eventListener('show-post').subscribe((data) => {
        window.history.pushState("", "", `/?post=${data.id}`);
        postData = data;
    });
    // clear subscriptions
    onDestroy(() => showPostEvent.unsubscribe());

    // triggered by the Post component when it's exited
    // this clears the postData therefore hiding the post component
    const hidePostEvent = _eventListener('hide-post').subscribe(() => {
        window.history.pushState("", "", '/');
        postData = undefined;
    });
    // clear subscriptions
    onDestroy(() => hidePostEvent.unsubscribe());

    // default values for the opengraph meta tags
    // these will be added to the page in SSR
    let title = 'aragalaya.online';
    let url = 'https://aragalaya-online.web.app';
    let description = 'The online portal for the aragalaya movement in Sri Lanka';
    let type = 'website';
    let image = 'https://firebasestorage.googleapis.com/v0/b/aragalaya-online.appspot.com/o/aragalaya-image.jpeg?alt=media&token=46171892-7f2f-49bb-8424-65ca7411271e';
    
    // if the url is for a specific post (?post=<post_id>) opengraph meta tags will be populated
    // with the data from that post.
    // since these are added to the page in SSR search engines will be able to index
    // each post seperately.
    // also post links shared on social media whatsapp/facebook will be able to render
    // the post content properly in their previews.
    if(postData) {
        postData._expanded = true;
        title = postData.title[0];
        url = 'https://aragalaya-online.web.app/?post=' + postData.id;
        description = stripHtml((postData.description && postData.description[0]) 
                        || (postData.shortDescription && postData.shortDescription[0])).result;
        type = 'article';
        let images = [];
        Object.keys(postData).map(key => {
            if(key.includes('_images')) {
                images.push(...postData[key]);
            }
        })
        if(images[0] && images[0].href) image = images[0].href;
    }

    // when new data is added by a form it's inserted to the column
    // by this listener
    const newColumnDataEvent = _eventListener('new-column-data').subscribe(async (event) => {
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
    const vScrollEvent = _eventListener('update-vscroll').subscribe(v => {
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
    _eventListener('nav-click').subscribe((index) => {
        const sizeConfig = _getSizeConfig();
        const maxLeft = (COLUMN_COUNT - Math.floor(window.innerWidth/sizeConfig.columnWidth))
        if(index < maxLeft) {
            hScrollIndex.value = index;
            setHorizontalScroll(sizeConfig.columnWidth * index);
        } else {
            hScrollIndex.value = maxLeft;
            const remainingSpace = (COLUMN_COUNT * sizeConfig.columnWidth + 15)
                - hScrollIndex.value * sizeConfig.columnWidth
                - window.innerWidth;
            hScrollIndex.value--;
            setHorizontalScroll(sizeConfig.columnWidth * maxLeft 
                + remainingSpace);
        }

        // trigger the column header bounce animation on desktop browsers
        if(!$_isMobile) {
            bounceAnimation[index].set(8);
            setTimeout(() => {
                bounceAnimation[index].set(0);
            }, 350);
        }
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

<svelte:head>
    <title>{title}</title>
    <!-- meta og tags for site crawlers and shareable content -->
    <meta property="fb:app_id"      content="420214326726915"/>
    <meta property="og:url"         content="{url}"/>
    <meta property="og:type"        content="{type}"/>
    <meta property="og:title"       content="{title}"/>
    <meta property="og:description" content="{description}"/>
    <meta property="og:image"       content="{image}"/>
</svelte:head>

<!-- Nav is the navigation bar component which is a fixed overlay-->
<Nav/>  

<div 
    class="columns"
    bind:this={columnsElement}
    on:wheel|stopPropagation={(e) => {
        __handleHorizontalScroll(e, hScrollIndex, setHorizontalScroll);
    }}
    on:touchstart={__handleTouchStart}
    on:touchmove={(e) => {
        __handleTouchMove(e, hScrollIndex, setHorizontalScroll);
    }}>
    <!-- Post displays a single post as an overlay -->
    {#if postData}
    <Post data={postData}/>
    {/if}
	<ul>
        {#if !$_isMobile}
        <li 
            class="spacer"
            style="--background: var(--theme-columns-0);">
        </li>
        {/if}
        {#each COLUMNS as column, _i}
        <li>
            <div class="column">
                <!-- column header -->
                <div style="background-color: var(--theme-headerbackground);">
                    <div 
                        class="header _clickable"
                        on:click={() => _emitEvent('nav-click', _i)}
                        style="
                            background-color: var(--theme-columns-{_i+1});
                            top: {_bounceAnimation[_i]}px">
                        <div>
                            <i class="{column.icon}"></i>
                            <Font 
                                inline
                                font={2}
                                size={0.95}
                                style="
                                    text-shadow: 0px 0px 3px #1b1b1b, 0 0 8px #525252;
                                    margin-left: var(--s10px);">
                                {column.title[$_lang]}
                            </Font>
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
                <!-- column cards -->
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
        {#if !$_isMobile}
        <li 
            class="spacer"
            style="--background: var(--theme-columns-{COLUMN_COUNT-1});">
        </li>
        {/if}
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
        position: relative;
        overflow: hidden;
        background-color: var(--theme-columnbackground);
    }
    .column {
        position: relative;
        width: var(--theme-columnwidth);
        height: calc(100vh - var(--theme-columnheaderheight));
    }
    .header {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: var(--theme-columnheaderheight);
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
        height: calc(100vh - var(--theme-columnheaderheight));
    }
    .spacer::after {
        display: block;
        content: '';
        height: var(--theme-columnheaderheight);
        width: var(--theme-cardseparationhalf);
        background-color: var(--background);
    }
    .scrollbar {
        position: absolute;
        top: var(--theme-columnheaderheight);
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