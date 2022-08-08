<!-- Filter component creates a filter options card which presents
---- the user with the option of selecting verified/unverified posts
---- and tags specified for that specific column
--->
<script>
    import { COLUMNS } from '$lib/config/column-config';

    import _strings from './filter-strings';
    import { _lang } from '$lib/services/store';

    import Card from '$lib/components/util/card.svelte';
    import Font from '$lib/components/display/font.svelte';
    import Button from '$lib/components/input/button.svelte';

    export let show;
    export let columnId;

    const configTags = (COLUMNS[columnId].filter && COLUMNS[columnId].filter.tags) || [];
    let showTags = configTags.length;

    let verified = true;
    let notVerified = false;
    let tags = [];
    let selected = Array(configTags.length).fill(false);

    const tagSelect = (tag) => {
        if(tags.includes(tag)) {
            tags.splice(tags.indexOf(tag), 1);
        } else {
            tags.push(tag);
        }
        selected = selected.map((_,_i) => tags.includes(configTags[_i].name));
    }
</script>

{#if show}
<div class="filters">
    <Card>
        <Font
            font={1}
            size={0.9}
            style="margin-bottom: var(--s3px);">
            {_strings['verified_status'][$_lang]}
        </Font>
        <Font
            font={0}
            size={0.75}
            style="
                display: inline-flex;
                margin-bottom: var(--s10px);">
            <span
                class="tag green" 
                class:selected={verified}
                on:click={() => verified = !verified}>
                {_strings['verified'][$_lang]}
            </span>
            <span 
                class="tag red"
                class:selected={notVerified}
                on:click={() => notVerified = !notVerified}>
                {_strings['not_verified'][$_lang]}
            </span>
        </Font>
        <!-- tag selection -->
        {#if showTags}
        <Font
            font={1}
            size={0.9}
            style="margin-bottom: var(--s3px);">
            {_strings['tags'][$_lang]}
        </Font>
        <Font
            font={0}
            size={0.75}
            style="
                display: inline-flex;
                margin-bottom: var(--s3px);">
            {#each COLUMNS[columnId].filter.tags as tag, _i}
            <span 
                class="tag"
                class:selected={selected[_i]}
                on:click={() => tagSelect(tag.name)}
                style="background-color: {tag.color};">
                {tag.strings[$_lang]}
            </span>
            {/each}
        </Font>
        {/if}
        <!-- filter button -->
        <div class="filter-button">
            <Button 
                text={_strings['filter']}
                style="
                    display: inline-flex;
                    width: var(--s100px);"
                fontSize={0.8}
                onclick={() => {}}/>
        </div>
        
    </Card>
</div>
{/if}

<style>
    .filters {
        position: relative;
        width: 100%;
        padding: var(--theme-cardseparationhalf) 0 0 0;
    }
    .tag {
        border: var(--s3px) solid #a5a5a5;
        border-radius: var(--s3px);
        padding: 0 var(--s3px);
        margin-right: var(--s3px);
        filter: grayscale(0.8);
    }
    .tag:hover {
        cursor: pointer;
    }
    .selected {
        border: var(--s3px) solid #1ea5ff;
        filter: none;
    }
    .green {
        background-color: #9cff6f;
    }
    .red {
        background-color: #ff8181;
        
    }
    .filter-button {
        display: flex;
        justify-content: flex-end;
    }
</style>