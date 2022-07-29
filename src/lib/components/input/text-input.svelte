<script>
    import { _lang } from '$lib/services/store';
    import Font from '$lib/components/display/font.svelte';

    export let disabled;
    export let config;
    export let data;
    export let onchange;

    export let error;
    
</script>

<div class="text-input">
    {#if config.type !== 'password'}
    <input 
        type="text"
        class:error={error}
        disabled={disabled}
        placeholder={config.placeholder[$_lang]}
        maxlength={config.maxlength}
        autocomplete={config.autocomplete}
        on:change={() => (error = false)}
        bind:value={data[config.name]}/>
    {:else}
    <input 
        type="password"
        class:error={error}
        disabled={disabled}
        placeholder={config.placeholder[$_lang]}
        maxlength={config.maxlength}
        autocomplete={config.autocomplete}
        on:change={() => (error = false)}
        bind:value={data[config.name]}/>
    {/if}
    <!-- if error is a string show the error -->
    {#if typeof error === 'string'}
    <span>
        <Font group={0} remSize={0.8}>
            {error}
        </Font>
    </span>
    {/if}
</div>

<style>
    .text-input {
        width: 90%;
        margin-bottom: var(--s18px);
    }
    input {
        height: var(--s45px);
        width: 100%;
        border-radius: var(--s5px);
        padding: var(--s10px);
        border: var(--s1px) solid var(--theme-defaultbutton);
        font-size: 1rem;
        margin-bottom: 3px;
    }
    span {
        color: red;
    }
    .error {
        border-width: 2px;
        border-color: #c02e46;
    }
</style>