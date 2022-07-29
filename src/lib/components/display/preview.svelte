<script>
    import { _lang } from '$lib/services/store';
    import { stripHtml } from  'string-strip-html';
    import _strings from './preview-strings';
    
    export let data;
    export let limit;
    export let preview;

    let text, croppedText, croppedFlag;

    // reactive code block $: {}
    // https://svelte.dev/docs#component-format-script-3-$-marks-a-statement-as-reactive
    // as _lang changes the text variable needs to be reactively updated
    // typically assignment operations are automatically reactive
    // https://svelte.dev/docs#component-format-script-2-assignments-are-reactive
    // however in this case the reactive variable is used as an index and that doesn't
    // work without making the expression as reactive
    // svelte documentation is not clear about this use case
    // TODO:: raise bug with svelte
    $: {
        text = stripHtml(data[$_lang]).result;
        croppedText = text.substring(0, limit);
        croppedFlag = text.length > limit;
        if(croppedFlag) text += '...';
    }
    
</script>

<div>
    {#if !preview}
        {@html data[$_lang]}
    {:else}
        {croppedText}
        {#if croppedFlag}
        <span style='font-weight:bold; text-decoration:underline'>
            {_strings['read_more'][$_lang]}
        </span>
        {/if}
    {/if}
</div>
