<script>
    import { TAGS } from '$lib/config/tag-config';

    import { _lang } from "$lib/services/store";
    import Font from "../display/font.svelte";
    import { createEventDispatcher } from 'svelte';

    export let tags;
    export let clickable = undefined;
    export let style = '';

    if(!tags) tags = [];
    console.log(tags);
    // event dispatcher
    const dispatch = createEventDispatcher();
</script>

<Font
    font={0}
    size={0.75}
    style="
        display: flex;
        width: calc(90% - 4px);
        flex-wrap: wrap;{style}">
    {#each tags as tag, _i}
    <span 
        class="tag {clickable? '_clickable': ''}"
        on:click={() => dispatch('tagclick', tag)}
        style="background-color: {TAGS[tag].color};">
        {TAGS[tag].strings[$_lang]}
    </span>
    {/each}
</Font>

<style>
    .tag {
        border: var(--s2px) solid #a5a5a5;
        border-radius: var(--s3px);
        padding: 0 var(--s3px);
        margin-right: var(--s3px);
        margin-bottom: var(--s3px);
    }
</style>