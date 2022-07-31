<script>
    import { _lang } from '$lib/services/store';
    import Font from '$lib/components/display/font.svelte';
    import TipTap from '$lib/components/input/tiptap-editor.svelte';

    export let config;
    export let data;
    export let error;
    
</script>

<div class="html-input">
    <TipTap 
        placeholder={config.placeholder}
        config={config}
        data={data}
        error={error}/>
    <!-- if error is a string show the error -->
    {#if typeof error === 'string'}
    <span>
        <Font font={3} size={1}>
            {error}
        </Font>
    </span>
    {/if}
</div>

<style>
    .html-input {
        width: 90%;
        margin-bottom: var(--s18px);
    }
    span {
        color: red;
    }
</style>