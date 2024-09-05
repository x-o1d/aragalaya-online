<script>
    // configs
    import { COLUMNS } from '$lib/config/column-config';
    import { COMPONENTS } from '../../+page.svelte';

    // npm modules
    import { onDestroy } from 'svelte';

    // services
    import { _appContentReady, _lang } from '$lib/services/store';
    import { _emitEvent } from '$lib/services/events';
    import { _isMobile } from '$lib/services/theme';
    import _strings from './post-strings';

    // components
    import Button from '$lib/components/input/button.svelte';

    export let data;

    const columnIndex = COLUMNS.findIndex(c => c.type == data.type);

    const appContentReadyUnsubscribe = _appContentReady.subscribe(() => {
        if($_isMobile) {
            _emitEvent('nav-click', {index: columnIndex});
        }
    })
    onDestroy(appContentReadyUnsubscribe)
    
    const hidePost = () => {
        data._singlePostView = false;
        data._expanded = true;
        _emitEvent('hide-post');
    }
</script>

<div 
    class="post"
    on:click|self={hidePost}>
    <div class="post-container">
        <svelte:component 
            class="post-component"
            this={COMPONENTS[data.type]}
            data={data}/>
        <Button
            form
            text={data._initialLoad? 
                    (_strings['more'][$_lang] + COLUMNS[columnIndex].title[$_lang].toLowerCase()):
                    _strings['back'][$_lang]}
            style="
                width: calc(100% - var(--theme-cardseparation));
                margin: var(--theme-cardseparationhalf);
                margin-bottom: var(--s100px);"
            onclick={hidePost}/>
    </div>
</div>

<style>
    .post {
        position: fixed;
        top: calc(var(--theme-columnheaderheight) + var(--theme-layoutheaderheight));
        left: 0;
        z-index: 1000;

        display: flex;
        flex-direction: column;

        overflow-y: scroll;

        width: 100%;
        height: calc(100vh - var(--theme-columnheaderheight) - var(--theme-layoutheaderheight));

        background-color: rgba(0,0,0,0.9);
    }
    .post-container {
        width: var(--theme-columnwidth);
        margin: auto;
    }

</style>