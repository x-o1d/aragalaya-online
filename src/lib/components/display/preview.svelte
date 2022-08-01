<!-- Preview component crops content if the content length 
---- exceeds the specified limit.
---- if the provides content has images the preview becomes
---- the cropped text + the first image 
----
---- PROPS:
---- content = string, text or html content
---- limit = number, the number of characters displayed before being cropped
---- preview = boolean, true: content cropped at limit, falst: full content displated
----
---- USAGE: 

<Preview
    content={data.description}
    limit={100}
    preview={true}/>
    
----
--->
<script>
    import { _lang } from '$lib/services/store';
    import { stripHtml } from  'string-strip-html';
    import _strings from './preview-strings';
    
    export let content;
    export let limit;
    export let preview;

    if(!content) throw ('content not defined: preview.svelte')
    // get the language string if content is a translated array
    $: contentString = Array.isArray(content)? content[$_lang]: content;

    let text, croppedText, croppedFlag;
    
    $: images = contentString.match(/src="([\w\W]+?)"/g);

    $: images = images && 
        images.map((src, _i) => {
            return src.replace('src="', '')
                        .replace('"','')
                        .replace('&amp;', '&')
            });
    
    // reactive declaration $:
    // https://svelte.dev/docs#component-format-script-3-$-marks-a-statement-as-reactive
    // as _lang changes the text variable needs to be reactively updated
    // typically assignment operations (=) are automatically reactive
    // https://svelte.dev/docs#component-format-script-2-assignments-are-reactive
    // however in this case since an automatic subscription ($_lang) is used
    // text is no longer reactive without the reactive declatration.
    // svelte documentation is not clear about this use case
    // TODO:: update svelte docs
    $: text = stripHtml(contentString).result;
    $: croppedText = text.substring(0, limit);
    $: croppedFlag = (text.length > limit) || images;
    $: croppedText += croppedFlag? '...' : '';
    
</script>

<div>
    {#if !preview}
        {@html contentString}
    {:else}
        {croppedText}
        {#if croppedFlag}
        <span style='font-weight:bold; text-decoration:underline'>
            {_strings['read_more'][$_lang]}
        </span>
            {#if images}
            <div 
                class="preview-image"
                style="--url: url({images[0]})">
            </div>
            {/if}
        {/if}
    {/if}
</div>

<style>
    .preview-image {
        background-image: var(--url); /* The image used */
        background-color: #cccccc; /* Used if the image is unavailable */
        height: 200px; /* You must set a specified height */
        width: 100%;
        background-position: center; /* Center the image */
        background-repeat: no-repeat; /* Do not repeat the image */
        background-size: cover; /* Resize the background image to cover the entire container */

        margin-top: 5px;
    }
    :global(.description img) {
        width: 100%;
        border-radius: 3px;
    }
</style>
