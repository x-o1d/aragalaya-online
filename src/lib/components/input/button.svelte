<script>
    import { _lang } from '$lib/services/store';

    import Font from '$lib/components/display/font.svelte';
    import PreloadingIndicator from '$lib/components/util/preloading-indicator.svelte';

    let buttonProgress;
    
    // TODO:: change onclick to a standard on:click event dispatcher
    export let onclick;
    export let text;
    export let cancel = false;
    export let form = false;
    export let selected = false;
    export let style = undefined;
    export let fontSize = undefined;
    export let font = undefined;
    export let progress = undefined;
</script>

<div 
    class="button"
    class:cancel={cancel || selected}
    class:form={form}
    style={style}
    on:click={async () => {
        if(buttonProgress) return;
        buttonProgress = true;
        await onclick();
        buttonProgress = false;
    }}>
    <Font
        font={font || 0}
        size={fontSize || 1}>
        {Array.isArray(text)? text[$_lang]: text}
    </Font>
</div>
{#if buttonProgress || progress}
    <div class="preloader"><PreloadingIndicator height={2}/></div>
{/if}

<style>
    .button {
        display: flex;
        align-items: center;
        justify-content: center;
        
        width: 100%;

        border-radius: var(--s5px);
        padding: var(--s5px);
        cursor: pointer;

        color: white;

        background-color: var(--theme-defaultbutton);
    }
    .form {
        height: var(--s45px);
    }
    .cancel {
        background-color: var(--theme-cancelbutton);
    }
    .preloader {
        position: relative;
        width: calc(100% - var(--s5px));
    }
</style>