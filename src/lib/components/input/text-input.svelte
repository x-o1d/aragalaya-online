<!-- Input component creates a styled text input component similar
---- to the native input tag
---- if formData is passed as it's data object and the config 'name' is 'title'
---- it'll modify the formData.title property.
---- 'type' can be either 'text' or 'password'.
---- when used inside the form.svelte component, it will automatically execute
---- the validate and process functions when the form is submitted.

USAGE:
<Input
    config={{
        name: 'title',
        type: 'text',
        maxlength: 100,
        placeholder: [
            'මාතෘකාව',
            'title',
            'தலைப்பு'
        ],
        required: true,
        validate: (val) => true,
        process: (val) => val,
    }}
    data={formData}
    on:enter={getUser}/>
--->
<script>
    import { _lang } from '$lib/services/store';
    import Font from '$lib/components/display/font.svelte';
    import { createEventDispatcher } from 'svelte';

    export let disabled = false;
    export let config;
    export let data;

    const dispatch = createEventDispatcher();

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
            on:keydown={(e) => {
                if(e.keyCode == 13) dispatch('enter')
            }}
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
            on:keydown={(e) => {
                if(e.keyCode == 13) dispatch('enter')
            }}
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