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
    export let form = false;
    export let style = '';

    const dispatch = createEventDispatcher();

    export let error;
    
</script>

<div class="text-input">
    <Font
        font={3}
        size={form? 1: 0.75}>
        <!-- type='password' cannot be dynamically set -->
        {#if config.type !== 'password'}
        <input 
            style={style}
            type="text"
            class:error={error}
            class:form={form}
            disabled={disabled}
            placeholder={Array.isArray(config.placeholder)? 
                config.placeholder[$_lang]: config.placeholder}
            maxlength={config.maxlength}
            autocomplete={config.autocomplete}
            on:keyup={() => (error = false)}
            on:keydown={(e) => {
                if(e.keyCode == 13) dispatch('enter')
            }}
            on:focus={(e) => dispatch('focus')}
            on:blur={(e) => dispatch('blur')}
            bind:value={data[config.name]}/>
        {:else}
        <input 
            style={style}
            type="password"
            class:error={error}
            class:form={form}
            disabled={disabled}
            placeholder={Array.isArray(config.placeholder)? 
                config.placeholder[$_lang]: config.placeholder}
            maxlength={config.maxlength}
            autocomplete={config.autocomplete}
            on:keyup={() => (error = false)}
            on:keydown={(e) => {
                if(e.keyCode == 13) dispatch('enter')
            }}
            on:focus={(e) => dispatch('focus')}
            on:blur={(e) => dispatch('blur')}
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
        width: 100%;
    }
    input {
        width: 100%;
        height: 100%;
        border-radius: var(--s3px);
        padding: var(--theme-cardseparationhalf) var(--s40px) var(--theme-cardseparationhalf) var(--s9px);
        border: var(--s1px) solid rgb(237, 237, 237);
    }
    .form {
        border-radius: var(--s5px);
        border: var(--s1px) solid var(--theme-defaultbutton);
        height: var(--s45px);
        margin-bottom: var(--s18px);
        padding: var(--theme-cardseparation);
    }
    span {
        color: red;
    }
    .error {
        border-width: 2px;
        border-color: #c02e46;
    }
</style>