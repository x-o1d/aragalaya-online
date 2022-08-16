<script>
    import Progress from '$lib/components/util/progress.svelte';
    import { _lang } from '$lib/services/store';
    import Font from '$lib/components/display/font.svelte';

    let buttonProgress;
    
    // TODO:: change onclick to a standard on:click event dispatcher
    export let onclick;
    export let text;
    export let cancel;
    export let form;
    export let selected = false;
    export let style = undefined;
    export let fontSize = undefined;
    export let font = undefined;
</script>

<div 
    class="button"
    class:cancel={cancel || selected}
    class:form={form}
    style={style}
    on:click={async () => {
        buttonProgress = true;
        await onclick();
        buttonProgress = false;
    }}>
    {#if buttonProgress}
        <Progress delay={100}/>
    {:else}
        <Font
            font={font || 0}
            size={fontSize || 1}>
            {Array.isArray(text)? text[$_lang]: text}
        </Font>
    {/if}
</div>

<style>
    .button {
        display: flex;
        align-items: center;
        justify-content: center;
        
        border-radius: var(--s5px);
        padding: var(--s5px);
        cursor: pointer;

        color: white;

        background-color: var(--theme-defaultbutton);
    }
    .form {
        height: var(--s45px);
        width: 90%;
        margin-bottom: var(--s14px);
    }
    .cancel {
        background-color: var(--theme-cancelbutton);
    }
</style>