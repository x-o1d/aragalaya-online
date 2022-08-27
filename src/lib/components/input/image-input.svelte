<!-- this Component adds an 'add image' button to a form.
---- once cliked it will open a file select dialg and allow the
---- user to select a file
--->
<script>
    import { _uploadToImages } from '$lib/services/storage';
    import { _lang } from '$lib/services/store';
    import _strings from './image-input-strings';

    import Font from '../display/font.svelte';

    export let data;
    export let config;
    export let error;

    let imageSelector;
    let image;

    const addImage = async (event) => {
        const imageRef = await _uploadToImages(event.target.files[0]);
        if(!Array.isArray(data[config.name + '_images'])) {
            data[config.name + '_images'] = [];
        }
        data[config.name + '_images'].push(imageRef);
        data[config.name] = imageRef;
        image = imageRef;
    }

    const selectImage = () => {
        if(image) return;
        imageSelector.click();
    }
</script>

<div class="image-input">
    <div 
        class="image-selector"
        on:click={selectImage}
        class:disabled={image}>
        <Font
            font={0}
            size={1}>
            {_strings['add_image'][$_lang]}
        </Font>
    </div>
    {#if image}
    <div 
        class="preview-image"
        style="--url: url({image.url})">
    </div>
    {/if}
    {#if error && typeof error != 'boolean'}
        <span>
            <Font font={0} size={0.8} color="red">
                {Array.isArray(error)? error[$_lang]: error}
            </Font>
        </span>
    {/if}
</div>
<input
    hidden
    type="file"
    class="file-upload"
    accept="image/*"
    on:change={(e) => addImage(e)}
    bind:this={imageSelector}>
<!-- the hidden input element for triggerring the file selection dialog -->

<style>
    .image-input {
        width: 100%;
    }
    .image-selector {
        display: flex;
        align-items: center;
        justify-content: center;

        width: 100%;
        height: var(--s45px);
        border-radius: var(--s5px);
        padding: var(--s5px);
        cursor: pointer;

        color: white;

        background-color: var(--theme-defaultbutton);
    }
    .preview-image {
        display: block;
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
    .disabled {
        background-color: #a5a5a5;
    }
</style>