<script>
    import { createEventDispatcher } from 'svelte';
    import { _lang } from '$lib/services/store';
    import Font from "../display/font.svelte";

    export let style = undefined;
    export let value;
    export let placeholder;
    export let options;

    if(!options) options = [];

    // event dispatcher
    const dispatch = createEventDispatcher();

    let showOptions = false

    const clickOption = (value) => {
        dispatch('select', value);
        showOptions = false;
    }

</script>

<div 
    class="select"
    style={style}>
    <div 
        class="select-box"
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
                {option.strings[$_lang]}
            </Font>
        </div>
        {/each}
    </div>
    {/if}
</div>

<style>
    .select {
        position: relative;
        width: 90%;
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