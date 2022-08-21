<!-- Filter component creates a filter options card which presents
---- the user with the option of selecting verified/unverified posts
---- and tags specified for that specific column
--->
<script>
    // configs
    import { COLUMNS } from '$lib/config/column-config';
    import { TAGS } from '$lib/config/tag-config';

    // services
    import _strings from './filter-strings';
    import { _lang } from '$lib/services/store';
    import { _getFilteredPosts } from '$lib/services/database';

    // components
    import Card from '$lib/components/util/card.svelte';
    import Font from '$lib/components/display/font.svelte';
    import { _emitEvent } from '$lib/services/events';
    import Progress from './progress.svelte';

    export let show;
    export let columnId;

    let filterProgress = false;

    let configTags = [];
    if(COLUMNS[columnId].tags) {
        configTags = COLUMNS[columnId].tags.map(tag => TAGS[tag]);
    }

    let verified = true;
    let notVerified = false;
    let tagNames = configTags.map(_ => _.name);
    let selectedTags = Array(configTags.length).fill(true);

    const tagSelect = (tag) => {
        if(tagNames.includes(tag)) {
            if(tagNames.length > 1) {
                tagNames.splice(tagNames.indexOf(tag), 1);
            }
        } else {
            tagNames.push(tag);
        }
        selectedTags = selectedTags.map((_,_i) => tagNames.includes(configTags[_i].name));
    }

    const selectBasic = () => {
        verified = true;
        notVerified = false;
        tagNames = [configTags[0].name, configTags[1].name];
        selectedTags = selectedTags.map((_,_i) => (_i < 2));
    }

    const selectAll = () => {
        verified = true;
        notVerified = true;
        tagNames = configTags.map(_ => _.name);
        selectedTags = selectedTags.map((_,_i) => (_i > -1));
    }

    const verifiedClick = () => {
        if(verified) {
            verified = false;
            notVerified = true;
        } else if(!verified) {
            verified = true;
        }
    }

    const notVerifiedClick = () => {
        if(notVerified) {
            notVerified = false;
            verified = true;
        } else if(!notVerified) {
            notVerified = true;
        }
    }

    const filterPosts = async () => {
        filterProgress = true;
        const posts = await _getFilteredPosts(COLUMNS[columnId].type, verified && !notVerified, tagNames);
        _emitEvent('filtered-posts', {
            column: columnId,
            posts: posts
        })
        filterProgress = false;
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
            <!-- verified tag -->
            <span
                class="tag" 
                class:selected-tags={verified}
                style="--color: #48bb6b;"
                on:click={verifiedClick}>
                {_strings['verified'][$_lang]}
            </span>
            <!-- not verified tag -->
            <span 
                class="tag"
                class:selected-tags={notVerified}
                style="
                    --color: #e44e4e;"
                on:click={notVerifiedClick}>
                {_strings['not_verified'][$_lang]}
            </span>
        </Font>
        <Font
            font={0}
            size={0.9}
            style="
                display: flex;
                margin-bottom: var(--s5px);
                justify-content: center;
                flex-wrap: wrap;">
            <!-- other tags -->
            {#each configTags as tag, _i}
            <span 
                class="tag"
                class:selected-tags={selectedTags[_i]}
                on:click={() => tagSelect(tag.name)}
                style="--color: {tag.color};">
                {tag.strings[$_lang]}
            </span>
            {/each}
        </Font>
        <div class="button-container">
            <!-- select all button -->
            <div 
                class="button"
                on:click={selectAll}>
                <i class="fa-solid fa-grip"></i>
            </div>
            <!-- select basics button -->
            <div 
                class="button"
                on:click={selectBasic}>
                <i class="fa-solid fa-ellipsis"></i>
            </div>
            <!-- filter button -->
            <div 
                class="button filter"
                on:click={filterPosts}>
                <Font 
                    font={0}
                    size={0.9}>
                    {#if !filterProgress}
                    {_strings['filter'][$_lang]}
                    {:else}
                    <Progress delay={200}/>
                    {/if}
                </Font>
            </div>
            <!-- hide filter button -->
            <div 
                class="button"
                on:click={() => show = false}>
                <i class="fa-solid fa-xmark"></i>
            </div>
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
        background-color: white;
        border: var(--s1px) solid #cfcfcf;
        border-radius: var(--s5px);
        padding: var(--s3px) var(--s5px);
        margin-right: var(--s5px);
        filter: grayscale(0.8);
        margin-bottom: var(--s6px);
    }
    .tag:hover {
        cursor: pointer;
    }
    .selected-tags {
        background-color: var(--color);
        filter: none;
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
        padding: var(--s7px);
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
        width: var(--s150px);
    }
</style>