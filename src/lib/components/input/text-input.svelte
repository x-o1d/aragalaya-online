<script>
    import { _lang } from '$lib/services/store';
    import Font from '$lib/components/display/font.svelte';

    export let disabled;
    export let config;
    export let data;

    export let error;
    
</script>

<div class="text-input">
    <Font
        font={0}
        size={1}>
        <!-- type='password' cannot be dynamically set -->
        {#if config.type !== 'password'}
        <input 
            type="text"
            class:error={error}
            disabled={disabled}
            placeholder={config.placeholder[$_lang]}
            maxlength={config.maxlength}
            autocomplete={config.autocomplete}
            on:keyup={() => (error = false)}
            bind:value={data[config.name]}/>
        {:else}
        <input 
            type="password"
            class:error={error}
            disabled={disabled}
            placeholder={config.placeholder[$_lang]}
            maxlength={config.maxlength}
            autocomplete={config.autocomplete}
            on:keyup={() => (error = false)}
            bind:value={data[config.name]}/>
        {/if}
        <!-- if error is a string show the error -->
        {#if error && typeof error != 'boolean'}
        <span>
            <Font font={0} size={0.8}>
                {Array.isArray(error)? error[$_lang]: error}
            </Font>
        </span>
        {/if}
    </Font>
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