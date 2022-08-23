<!-- Select component creates a styled drop down menu similar to the
---- native html select component -->
<script>
    import { createEventDispatcher } from 'svelte';

    import { _lang } from '$lib/services/store';
    import Font from "../display/font.svelte";

    export let style = '';
    export let value = undefined;
    export let placeholder;
    export let options;
    export let error;

    if(!options) options = [];

    // event dispatcher
    const dispatch = createEventDispatcher();

    let showOptions = false

    const clickOption = (value) => {
        dispatch('select', value);
        error = false;
        showOptions = false;
    }
</script>

<div 
    class="select"
    style={style}>
    <div 
        class="select-box _clickable"
        class:error={error}
        on:click={() => showOptions = !showOptions}>
        <Font
            font={0}
            size={0.9}
            color={value? 'black': '#767676'}>
            {value || placeholder}
        </Font>
    </div>
    {#if showOptions}
    <div class="select-options">
        {#each options as option, _i}
        <div 
            class="option"
            on:click={() => clickOption(option)}>
            <Font
                font={0}
                size={0.9}
                color={value? 'black': '#767676'}>
                {Array.isArray(option.strings)? option.strings[$_lang]: option.strings}
            </Font>
        </div>
        {/each}
    </div>
    {/if}
</div>

<style>
    .select {
        position: relative;
        width: 100%;
        height: var(--s45px);

        margin-bottom: var(--s14px);
    }
    .select-box {
        padding: var(--s5px);
        border-radius: var(--s5px);
        padding: var(--s10px);
        border: var(--s1px) solid var(--theme-defaultbutton);
        background-color: white;
    }
    .error {
        border-width: 2px;
        border-color: #c02e46;
    }
    .select-options {
        position: absolute;

        top: var(--s50px);
        left: 0;

        width: 100%;
        border-radius: var(--s5px);
        border: var(--s1px) solid var(--theme-defaultbutton);

        background-color: white;
    }
    .option {
        padding: var(--s5px);
        border-radius: var(--s5px);
    }
    .option:hover {
        cursor: pointer;
        background-color: aliceblue;
    }
</style>