<script>
    import { COLUMNS } from '$lib/config/column-config';
    import { COMPONENTS } from '../../index.svelte';

    import { _lang } from '$lib/services/store';
    import { _emitEvent } from '$lib/services/events';
    import _strings from './post-strings';

    import Button from '$lib/components/input/button.svelte';
    
    export let data;

    const column = COLUMNS.find(c => c.type == data.type);
    
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
                    (_strings['more'][$_lang] + column.title[$_lang]):
                    _strings['back'][$_lang]}
            style="
                width: calc(100% - var(--theme-cardseparation));
                margin: var(--theme-cardseparationhalf);
                margin-bottom: var(--s20px);"
            onclick={hidePost}/>
    </div>
</div>

<style>
    .post {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1000;

        display: flex;
        flex-direction: column;

        overflow-y: scroll;

        width: 100%;
        height: 100%;

        background-color: rgba(0,0,0,0.9);
    }
    .post-container {
        width: var(--theme-columnwidth);
        margin: auto;
    }

</style>