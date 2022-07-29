<script>
    import Progress from '$lib/components/util/progress.svelte';
    import { _lang } from '$lib/services/store';

    let buttonProgress;
    
    export let onclick;
    export let text;
    export let cancel;
</script>

<div 
    class="button"
    class:cancel={cancel}
    on:click={async () => {
        buttonProgress = true;
        await onclick();
        buttonProgress = false;
    }}>
    {#if buttonProgress}
        <Progress/>
    {:else}
        {text[$_lang]}
    {/if}
</div>

<style>
    .button {
        display: flex;
        align-items: center;
        justify-content: center;

        height: var(--s45px);
        width: 90%;
        border-radius: var(--s5px);
        padding: var(--s5px);
        cursor: pointer;

        color: white;
        font-size: 1.1rem;
        font-weight: bold;

        margin-bottom: var(--s14px);

        background-color: var(--theme-defaultbutton);
    }
    .cancel {
        background-color: var(--theme-cancelbutton);
    }
</style>