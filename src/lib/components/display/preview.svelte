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

    import Content from '$lib/components/display/content.svelte';
    
    export let data;
    export let contentField;
    export let limit;
    export let preview;

    if(!data[contentField] == undefined) {
        console.log(`data.${contentField} not defined, data type: ${data.type} data id: ${data.id}`);
        data[contentField] = '';
    }

    let content =  data[contentField];

    // get the language string if content is a translated array
    // the MT component sets the _viewOriginal prop of the data object
    // to true when view original is clicked.
    // the third index of translated data contains the original untranslated
    // text
    $: contentString = Array.isArray(content)? content[data._viewOriginal? 3: $_lang]: content;

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

<div class="preview">
    {#if !preview}
        <Content 
            data={data}
            contentField={contentField}/>
    {:else}
        {croppedText}
        {#if croppedFlag}
        <span style='font-weight:bold; text-decoration:underline'>
            {_strings['read_more'][$_lang]}
        </span>
            {#if images}
            <div class="preview-container">
                <div 
                    class="preview-image"
                    style="--url: url({images[0]})">
                </div>
                <div class="preview-overlay"></div>
            </div>  
            {/if}
        {/if}
    {/if}
</div>

<style>
    .preview-image {
        background-image: var(--url);
        background-color: #7b7b7b; 
        height: var(--theme-previewheight);
        width: 100%;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;

        margin-top: 5px;

        filter: grayscale(0.6);
    }
    .preview-container {
        position: relative;
    }
    .preview-overlay {
        position: absolute;
        top: 0;
        left: 0;

        height: var(--theme-previewheight); 
        width: 100%;
        
        background-color: black;
        opacity: var(--theme-previewopacity);
        border-radius: 3px;
    }
    :global(.preview img) {
        margin: var(--s5px) 0;
        width: 100%;
        border-radius: 3px;
    }
    .view-original {
        font-family: 'Roboto', sans-serif;
    }
    
</style>
