<script>
    import convert from 'html-to-text';

    export let data;
    export let limit;
    export let preview;

    let text = convert(data).substring(0, limit);

    if(text.length > preview) {
        text += '..'
    }

</script>

<div>
    {#if !preview}
        {@html data}
    {:else}

    {/if}
</div>
