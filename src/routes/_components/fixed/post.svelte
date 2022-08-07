<script>
    import { _emitEvent } from '$lib/services/events';

    import Empty from '../posts/empty.svelte';
    import Bulletin from '../posts/bulletin.svelte';
    import News from '../posts/news.svelte';

    export let data;

    export const COMPONENTS = {
        bulletin: Bulletin,
        newsx: News,
        empty: Empty
    }

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
            this={COMPONENTS[data.type]}
            data={data}/>
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
        align-items: center;
        justify-content: center;

        width: 100%;
        height: 100%;

        background-color: rgba(0,0,0,0.9);
    }
    .post-container {
        width: var(--theme-columnwidth);
    }
</style>