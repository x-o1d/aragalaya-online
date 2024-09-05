<!-- this component creates the index route, or the initial route
---- which is loaded when the app starts.
---- it creates a multiple column layout which can be configured
---- in src/lib/config/column-config.js
--->

<!-- this context module block is added here so that the COMPONENT definition
---- can be accesed by other components
---- the COMPONENTS objects map post type to the component that needs to be 
---- loaded
---- https://svelte.dev/tutorial/module-exports 
--->
<script context="module">
    // the component of the card to be loaded for a particular column
    // data.type = component'
    // refer: comments in columns.js config file
    // NOTE:: if a component is not specified for a column type it will load an
    // empty card
    export const COMPONENTS = {
        news: News,
        video: Video,
        bulletin: Bulletin,
        proposal: Proposal,
        wip: Wip,
        cartoon: Image,
        legal: Bulletin
    }
</script>
<!-- index route logic -->
<script>
    // config
    import { COLUMNS, COLUMN_COUNT }from '$lib/config/column-config'
    
    // npm modules
    import { onMount, onDestroy } from 'svelte';
    import { stripHtml } from  'string-strip-html';
    
    // services
    import { _eventListener, _emitEvent } from '$lib/services/events';
    import { _lang, _shareLink, _URL } from '$lib/services/store';
    import { _userSignedIn } from '$lib/services/auth';
    import { _themes, _isMobile, _getSizeConfig } from '$lib/services/theme';
    import { _getPost } from '$lib/services/database';
    import { _getFileURL } from '$lib/services/storage';
    import { _handleWheel, _handleTouchMove, _handleTouchStart, 
        _handleColumnScroll, _setupIndexAnimations, _handleTouchEnd} from '$lib/services/scroll';

    // components$lib/services/scroll
    import Nav from './_components/fixed/nav.svelte';
    import Empty from './_components/posts/_template.svelte';
    import Bulletin from './_components/posts/bulletin.svelte';
    import News from './_components/posts/news.svelte';
    import Post from './_components/fixed/post.svelte';
    import Font from '$lib/components/display/font.svelte';
    import Filter from '$lib/components/util/filter.svelte';
    import Proposal from './_components/posts/proposal.svelte';
    import Wip from './_components/posts/wip.svelte';
    import Video from './_components/posts/video.svelte';
    import Image from './_components/posts/image.svelte';

    // the DOM element that contains all the columns
    // this element is moves left and right to produce the
    // horizontal scroll effect
    let appWindowElement;
    // the cards container element for each column, this element
    // is vertically scrolled on wheel and touch events
    let columnElements = Array(COLUMN_COUNT).fill(null);
    // the scroll bar element for each column, this element
    // moves vertically to indicate the current scroll position
    let columnScrollBarElements = Array(COLUMN_COUNT).fill(null);
    // the column header element for each column
    // this element is animated on navigation clicks
    let columnHeaderElements = Array(COLUMN_COUNT).fill(null);

    // these elements are sent to the scroll service after mount and
    // they are animated based on wheel and touch events
    onMount(() => {
        _setupIndexAnimations(
            appWindowElement, 
            columnElements, 
            columnScrollBarElements, 
            columnHeaderElements
        );
    });

    // column data, this is populated by the page endpoint (./index.js)
    // using the page endpoint allows the data to be fetched in the backend
    // itself for SSR
    export let columnData;
    // if a postId was specified in the url, the data for that post will be
    // available in this prop, this is populated by the page endpoint (./index.js)
    export let postData = undefined;

    // START - SSR: setup open graph tags for social shares
    // default values if postData is not specified
    let title = 'අරගලය.online';
    let url = _URL;
    let description = 'The online portal for the aragalaya movement in Sri Lanka';
    let type = 'website';
    let image = 'https://aragalaya.online/images/aragalaya-online-og-image-002.png';
    
    // if the url is for a specific post (?post=<post_id>) opengraph meta tags will be populated
    // with the data from that post.
    // since these are added to the page in SSR search engines will be able to index
    // each post seperately.
    // also post links shared on social media whatsapp/facebook will be able to render
    // the post content properly in their previews.
    if(postData) {
        // in single post view expand all previews
        postData._expanded = true;
        postData._initialLoad = true;
        title = (postData.title && postData.title[0]) || 
                    (postData.organization && postData.organization[0]) ||
                        'අරගලය.online';
        url = _shareLink + postData.id;
        const columnIndex = COLUMNS.findIndex(c => c.type == postData.type);
        const columnTitle = COLUMNS[columnIndex].title[0];

        description = `[${columnTitle}] ` + stripHtml(
                (postData.description && postData.description[0]) ||
                    (postData.shortDescription && postData.shortDescription[0]) || 
                    (postData.proposal && postData.proposal[0]) || 
                    (postData.source && postData.source[0]) || ''
                ).result;
        type = 'article';
        let images = [];
        Object.keys(postData).map(key => {
            if(key.includes('_images')) {
                images.push(...postData[key]);
            }
        })
        if(images[0] && (images[0].url || images[0].href)) {
            // images added in text posts has a url property which is relative
            // to the app domain
            if(images[0].url) {
                image = _URL + images[0].url;
            } 
            // images added in youtube video posts has an href property which
            // is an absolute url
            else {
                image = images[0].href;
            }
        }
    }
    // START - SSR: setup open graph tags for social shares
    
    onMount(() => {
        if(postData) {
            window.history.pushState("", "", '/');
            window.history.pushState("", "", `/?post=${postData.id}`);
        }
    })
    // update count is incremented every time column data is updated
    // to make the {#each} keys unique.
    // this ensures that column data will be reactively updated.
    let updateCount = 0;

    // this flag determines if a column filters are visible or not
    let showFilters = Array(COLUMN_COUNT).fill(false);

    // filtered-posts event is triggered by the Filter component.
    const filteredPostsEvent = _eventListener('filtered-posts').subscribe((data) => {
        updateCount++;
        columnData[data.column] = data.posts;
        // reactively updata
        columnData = columnData;
    })
    // clear subscription
    onDestroy(() => filteredPostsEvent.unsubscribe());

    // triggered by the Toolbar component when show post button is clicked
    const showPostEvent = _eventListener('show-post').subscribe((data) => {
        // set the post id in the url
        window.history.pushState("", "", `/?post=${data.id}`);
        // in single post view expand all previews
        data._expanded = true;
        // let the toolbar know that the post is in single post view
        data._singlePostView = true;
        // assign data and show the Post component
        postData = data;
    });
    // clear subscriptions
    onDestroy(() => showPostEvent.unsubscribe());

    // triggered by the Post component when it's exited
    const hidePostEvent = _eventListener('hide-post').subscribe(() => {
        // clear the post id from the url
        window.history.pushState("", "", '/');
        title = 'අරගලය.online';
        // clear data and hide the Post component
        postData = undefined;
    });
    // clear subscriptions
    onDestroy(() => hidePostEvent.unsubscribe());

    // when new data is added by a form it's inserted to the column
    // by this listener
    const newPostEvent = _eventListener('new-post').subscribe(async (postData) => {
        columnData[postData._columnIndex].unshift(postData);
        // trigger template update
        updateCount++;
        columnData = columnData;
    })
    // clear subscription
    onDestroy(() => newPostEvent.unsubscribe());

    // when new data is added by a form it's inserted to the column
    // by this listener
    const postUpdatedtEvent = _eventListener('update-post').subscribe(async () => {
        // trigger template update
        updateCount++;
        columnData = columnData;
    })
    // clear subscription
    onDestroy(() => postUpdatedtEvent.unsubscribe());

    // when new data is added by a form it's inserted to the column
    // by this listener
    const deletePostEvent = _eventListener('delete-post').subscribe(async (postData) => {
        const postIndex = columnData[postData._columnIndex]
            .findIndex(p => p.id == postData.id);
        columnData[postData._columnIndex].splice(postIndex, 1);
        // trigger template update
        updateCount++;
        columnData = columnData;
    })
    // clear subscription
    onDestroy(() => deletePostEvent.unsubscribe());

    // header + icon click event
    // this opens the Form component in an overlay
    const addDocument = (event, index) => {
        if(_userSignedIn()) {
            _emitEvent('show-post-form', {columnIndex: index});
        } else {
            _emitEvent('show-hide-login', true);
        }
    }

    // goto column
    const goToColumn = (index) => {
        _emitEvent('nav-click', {index: index});
        _emitEvent('hide-post');
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

{#if postData}
<!-- Post displays a single post as an overlay -->
<Post data={postData}/>
{/if}

<div
    class="columns"
    bind:this={appWindowElement}
    on:wheel|passive|stopPropagation={(e) => {
        _handleWheel(e);
    }}
    on:touchstart|passive={_handleTouchStart}
    on:touchmove|passive={_handleTouchMove}
    on:touchend|passive={_handleTouchEnd}>
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
                        bind:this={columnHeaderElements[_i]}
                        on:click={() => goToColumn(_i)}
                        style="background-color: var(--theme-columns-{_i+1});">
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
                            <!-- filter button -->
                            {#if column.verified || column.tags}
                            <div 
                                class='icon-button'
                                on:click|stopPropagation={(e) => showFilters[_i] = !showFilters[_i]}>
                                <i class="fa-solid fa-filter-circle-xmark"></i>
                            </div>
                            {/if}
                            <!-- add document button -->
                            {#if !column.static}
                            <div 
                                class='icon-button'
                                on:click|stopPropagation={(e) => addDocument(e, _i)}>
                                <i class="fa-solid fa-add"></i>
                            </div>
                            {/if}
                        </div>
                    </div>
                </div>
                <Filter 
                    show={showFilters[_i]}
                    columnIndex={_i}/>
                <!-- column cards -->
                <div 
                    class="cards"
                    bind:this={columnElements[_i]}
                    on:scroll|stopPropagation={(e) => _handleColumnScroll(e, _i)}>
                    {#each columnData[_i] as item, _i (item.id + updateCount)}
                    <div>
                        <svelte:component 
                            this={COMPONENTS[item.type] || Empty}
                            data={item}/>
                    </div>
                    {/each}
                </div>
                <div class="scrollbar">
                    <div 
                        bind:this={columnScrollBarElements[_i]}
                        class="scroll">
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
        padding: 0 var(--theme-cardseparationhalf) 0 var(--s10px);
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
        scrollbar-width: none;
        -ms-overflow-style: none;
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