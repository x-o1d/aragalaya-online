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
    data={data}
    contentField={'description'}
    limit={100}
    expanded={data._expanded}
    on:expandPost={() => data._expanded = true}>
    
----
--->
<script>
    // npm modules
    import { createEventDispatcher } from 'svelte';
    import { stripHtml } from  'string-strip-html';

    // services
    import { _lang } from '$lib/services/store';
    import { _getImageURL } from '$lib/services/storage';
    import _strings from './preview-strings';

    // components
    import Content from '$lib/components/display/content.svelte';

    // component props
    export let data;
    export let contentField;
    export let limit;
    export let expanded;

    // event dispatcher
    const dispatch = createEventDispatcher();

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
    
    const expandPreview = () => {
        dispatch('expandPost', true);
    }
</script>

<div class="preview">
    {#if expanded}
        <Content 
            data={data}
            contentField={contentField}/>
    {:else}
        <div 
            class="_clickable"
            on:click={expandPreview}>
            {croppedText}
            {#if croppedFlag}
            <span style='font-weight:bold; text-decoration:underline'>
                {_strings['read_more'][$_lang]}
            </span>
                {#if images}
                <div class="preview-container">
                    <div 
                        class="preview-image"
                        style="--url: url({_getImageURL(images[0])})">
                    </div>
                    <div class="preview-overlay"></div>
                </div>  
                {/if}
            {/if}
        </div>
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
        border-radius: var(--s3px);

        margin-top: var(--theme-cardseparationhalf);

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
    
</style>
