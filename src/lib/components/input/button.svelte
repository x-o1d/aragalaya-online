<script>
    import Progress from '$lib/components/util/progress.svelte';
    import { _lang } from '$lib/services/store';

    let buttonProgress;
    export let onclick;
    export let text;
</script>

<div 
    class="button"
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
        background-color: var(--button);
        cursor: pointer;

        color: white;
        font-size: 1.1rem;
        font-weight: bold;

        margin-bottom: var(--s14px);
    }
</style>