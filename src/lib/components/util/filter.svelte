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

    export let show;
    export let columnId;

    const configTags = (COLUMNS[columnId].filter && COLUMNS[columnId].filter.tags) || [];
    let showTags = configTags.length;

    let verified = true;
    let notVerified = false;
    let tags = [];
    let selected = Array(configTags.length).fill(true);

    const tagSelect = (tag) => {
        if(tags.includes(tag)) {
            tags.splice(tags.indexOf(tag), 1);
        } else {
            tags.push(tag);
        }
        selected = selected.map((_,_i) => tags.includes(configTags[_i].name));
    }

    const clearAll = () => {
        verified = true;
        notVerified = false;
        selected = selected.map((_,_i) => (_i == 0));
    }

    const selectAll = () => {
        verified = true;
        notVerified = true;
        selected = selected.map((_,_i) => (_i > -1));
    }
</script>

{#if show}
<div class="filters">
    <Card>
        <Font
            font={0}
            size={0.9}
            style="
                display: flex;
                margin-bottom: var(--s5px);
                justify-content: center;
                flex-wrap: wrap;">
            <span
                class="tag verified" 
                class:selected={verified}
                on:click={() => verified = !verified}>
                {_strings['verified'][$_lang]}
            </span>
            <span 
                class="tag not-verified"
                class:selected={notVerified}
                on:click={() => notVerified = !notVerified}>
                {_strings['not_verified'][$_lang]}
            </span>
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
        <div class="button-container">
            <div 
                class="button"
                on:click={selectAll}>
                <i class="fa-solid fa-grip"></i>
            </div>
            <div 
                class="button"
                on:click={clearAll}>
                <i class="fa-solid fa-xmark"></i>
            </div>
            <div class="button filter">
                {_strings['filter'][$_lang]}
            </div>
            
        </div>
        <!-- filter button -->
        
        
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
        border: var(--s2px) solid #a5a5a5;
        border-radius: var(--s3px);
        padding: 0 var(--s3px);
        margin-right: var(--s5px);
        filter: grayscale(0.8);
        margin-bottom: var(--s5px);
    }
    .tag:hover {
        cursor: pointer;
    }
    .selected {
        border: var(--s2px) solid black;
        filter: none;
    }
    .verified {
        background-color: #9cff6f;
    }
    .not-verified {
        background-color: #ff8181;
        
    }
    .button-container {
        display: flex;
        justify-content: center;
    }
    .button {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        margin-right: var(--s5px);
        padding: var(--s5px);
        background-color: rgb(199, 226, 249);
        border-radius: var(--s3px);
        width: var(--s30px);
    }
    .button:hover {
        cursor: pointer;
    }
    .filter {
        background-color: rgb(127, 191, 247);
        padding: var(--s5px) var(--s10px);
        width: auto;
    }
</style>