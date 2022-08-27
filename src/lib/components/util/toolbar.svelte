<!-- Toolbar component adds below functionalities to a post: 
---- - expand/minimize 
---- - view single post
---- - share to facebook
---- - share to twitter
---- - verified/not verified indication
---- below snippet has to be added to a post to add the toolbar to a post
EXAMPLE:
<Toolbar 
    data={data}
    on:toggleExpanded={(e) => data._expanded = e.detail}/>
--->
<script>
    // configs
    import { COLUMNS } from '$lib/config/column-config';

    // npm modules
    import { createEventDispatcher, onMount } from 'svelte';

    // services

    import { _adminToggleVerified } from '$lib/services/functions';
    import { _user, _lang, _shareLink, _admin } from '$lib/services/store';
    import { _emitEvent } from '$lib/services/events';
    import { _isMobile } from '$lib/services/theme';
    import _strings from './toolbar-strings';

    // components
    import Font from '$lib/components/display/font.svelte';

    // component props
    export let data;

    let verified = data._columnIndex && COLUMNS[data._columnIndex].verified;

    // check if the browser support navigator.share for sharing links
    let navigatorShareAvailable = false;
    onMount(() => {
        navigatorShareAvailable = !!navigator.share && !navigator.platform.includes('Win');
    })

    // event dispatcher
    const dispatch = createEventDispatcher();

    const toggleExpanded = () => {
        dispatch('toggleExpanded', !data._expanded)
    }

    const toggleSinglePostView = () => {
        if(data._singlePostView) {
            data._singlePostView = false;
            _emitEvent('hide-post');
        } else {
            dispatch('toggleExpanded', true)
            _emitEvent('show-post', data)
        }
    }

    const shareButtonClick = (e) => {
        let link = _shareLink + data.id;
        if(navigatorShareAvailable) {
            navigator.share({url: link})
        } else {
            navigator.clipboard.writeText(link);
            _emitEvent('show-toast', { 
                text: 'Link copied!',
                event: e
            });
        }
    }

    const facebookShare = () => {
        let link = _shareLink + data.id;
        if(navigatorShareAvailable) {
            navigator.share({url: link})
        } else {
            window.open(`/share/facebook?post=${data.id}`, '_blank');
        }
    }

    const twitterShare = () => {
        let link = _shareLink + data.id;
        if(navigatorShareAvailable) {
            navigator.share({url: link})
        } else {
            window.open(`/share/twitter?post=${data.id}`, '_blank');
        }
    }

    const whatsappShare = () => {
        let link = _shareLink + data.id;
        if(navigatorShareAvailable) {
            navigator.share({url: link})
        } else {
            window.open(`/share/whatsapp?post=${data.id}`, '_blank');
        }
    }

    const redditShare = () => {
        let link = _shareLink + data.id;
        if(navigatorShareAvailable) {
            navigator.share({url: link})
        } else {
            window.open(`/share/reddit?post=${data.id}`, '_blank');
        }
    }

    const toggleVerified = async () => {
        if($_admin) {
            data.verified = !data.verified;
            let result = await _adminToggleVerified(data.id);
            if(result.error) {
                data.verified = !data.verified;
            }
        }
    }

    const editPost = () => {
        _emitEvent('show-post-form', { data });
    }
</script>

<div class="toolbar">
    <div class="toolbar-left">
        {#if $_user && ($_user.uid == data.createdBy)}
        <div 
            class="icon _clickable"
            on:click={editPost}>
            <i class="fa-solid fa-pen-clip"></i>
        </div>
        {/if}
        <div 
            class="icon _clickable"
            class:on={data._expanded}
            on:click={toggleExpanded}>
            <i class="fa-solid fa-up-down"></i>
        </div>
        {#if !$_isMobile}
        <div 
            class="icon _clickable"
            class:on={data._singlePostView}
            on:click={toggleSinglePostView}>
            <i class="fa-solid fa-up-right-and-down-left-from-center"></i>
        </div>
        {/if}
        <div class="mobile-huddle">
            <div 
                class="icon _clickable"
                class:huddle={$_isMobile}
                on:click={shareButtonClick}>
                <i class="fa-solid fa-share-nodes"></i>
            </div>
            <div 
                class="icon facebook _clickable"
                class:huddle={$_isMobile}
                on:click={facebookShare}>
                <i class="fa-brands fa-facebook"></i>
            </div>
            <div 
                class="icon twitter _clickable"
                class:huddle={$_isMobile}
                on:click={twitterShare}>
                <i class="fa-brands fa-twitter"></i>
            </div>
            <div 
                class="icon whatsapp _clickable"
                class:huddle={$_isMobile}
                on:click={whatsappShare}>
                <i class="fa-brands fa-whatsapp"></i>
            </div>
        </div>
        {#if !$_isMobile}
        <div 
            class="icon reddit _clickable"
            on:click={redditShare}>
            <i class="fa-brands fa-reddit"></i>
        </div>
        {/if}
    </div>
    {#if verified}
    <div class="toolbar-right"
        class:_clickable={$_admin}
        on:click={toggleVerified}>
        {#if data.verified}
        <Font
            font={0}
            size={0.75}
            style="margin-right: var(--s5px);">
            {_strings['verified'][$_lang]}
        </Font>
        <div 
            class="icon verified">
            <i class="fa-solid fa-check"></i>
        </div>
        {:else}
        <Font
            font={0}
            size={0.75}
            style="margin-right: var(--s5px);">
            {_strings['not_verified'][$_lang]}
        </Font>
        <div class="icon not-verified">
            <i class="fa-solid fa-exclamation"></i>
        </div>
        {/if}
    </div>
    {/if}
</div>

<style>
    .toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: var(--theme-cardseparationhalf);
    }
    .toolbar-left {
        display: inline-flex;
    }
    .toolbar-right {
        display: inline-flex;
        align-items: center;
    }
    .icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;

        width: var(--theme-toolbarbuttonsize);
        height: var(--theme-toolbarbuttonsize);

        margin-right: var(--theme-cardseparationhalf);

        font-size: var(--s13px);
        line-height: var(--s14px);

        background-color: rgb(226, 230, 230);
        border-radius: var(--s3px);
    }
    .mobile-huddle {
        display: inline-flex;
        border-radius: var(--s3px);
        overflow: hidden; 
        padding: 0;
    }
    .huddle {
        margin-right: 0;
        border-radius: 0;
    }
    .on {
        background-color: rgb(124, 124, 124);
        color: white;
    }
    .verified {
        background-color: #48bb6b;
        color: white;
        margin-right: 0;
    }
    .not-verified {
        background-color: #e44e4e;
        color: white;
        margin-right: 0;
    }
    .facebook {
        background-color: #557bab;
    }
    .twitter {
        background-color: #6abef2;
    }
    .whatsapp {
        background-color: #61ba7b;
    }
    .reddit {
        background-color: #fc7949;
    }
    .fa-brands {
        color: white;
    }
</style>