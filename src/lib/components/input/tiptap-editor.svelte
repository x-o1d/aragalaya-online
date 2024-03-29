<script>
    import { onMount, onDestroy } from 'svelte';

    // TipTap editor imports
    // TODO: add url
    import { Editor } from '@tiptap/core';
    import Text from '@tiptap/extension-text';
    import Bold from '@tiptap/extension-bold';
    import Italic from '@tiptap/extension-italic';
    import Strike from '@tiptap/extension-strike';
    import BulletList from '@tiptap/extension-bullet-list';
    import Document from '@tiptap/extension-document';
    import ListItem from '@tiptap/extension-list-item';
    import OrderedList from '@tiptap/extension-ordered-list';
    import Image from '@tiptap/extension-image';
    import Dropcursor from '@tiptap/extension-dropcursor';
    import Paragraph from '@tiptap/extension-paragraph';
    import Heading from '@tiptap/extension-heading';
    import Placeholder from '@tiptap/extension-placeholder';
    import Link from '@tiptap/extension-link';
    import HardBreak from '@tiptap/extension-hard-break';

    import { _getFileURL, _uploadToImages, _uploadToDocuments, _getImageURL } from '$lib/services/storage';
    import { _lang } from '$lib/services/store';

    import Progress from '$lib/components/util/progress.svelte';
    import Font from '$lib/components/display/font.svelte';

    export let placeholder;
    export let data;
    export let config;
    export let error;

    let element;
    let editor;
    let fileSelector;
    let imageSelector;
    let editorDisabled = false;
  
    onMount(() => {
        const initEditor = () => {
            if(editor) editor.destroy();
            editor = new Editor({
                element: element,
                extensions: [
                    Document,
                    Text,
                    Heading,
                    Paragraph,
                    HardBreak,
                    Bold,
                    Italic,
                    Strike,
                    BulletList, 
                    OrderedList, 
                    ListItem,
                    Image,
                    Dropcursor,
                    Link,
                    Placeholder.configure({
                        placeholder: placeholder[$_lang],
                    })
                ],
                content: data[config.name] || '',
                onTransaction: () => {
                    // force re-render so `editor.isActive` works as expected
                    editor = editor;
                    // if editor is empty getHTML() still returns the placeholder
                    // html, this is avoided by checking for the is-editor-empty 
                    // class
                    // blank paragraphs are rendered in the editor with a <br>
                    // node inside of it, but this br tag is not returned in
                    // getHTML(), to make the rendered html similar to the 
                    // editor empty p tags are replaced with a br
                    data[config.name] = element.innerHTML.includes('is-editor-empty')?
                        '': editor.getHTML().replaceAll('<p></p>','<br>');
                },
            });
        };
        initEditor();

        data._updateEditorContent = () => {
            // init editor so that the initial content will be updated
            initEditor();
        };
    })
  
    onDestroy(() => {
        if (editor) {
            editor.destroy()
        }
    })

    const selectImage = () => {
        imageSelector.click();
    }

    const selectFile = () => {
        fileSelector.click();
    }

    const addImage = async (event) => {
        editorDisabled = true;
        const imageRef = await _uploadToImages(event.target.files[0]);
        console.log(imageRef);
        if(!Array.isArray(data[config.name + '_images'])) {
            data[config.name + '_images'] = [];
        }
        data[config.name + '_images'].push(imageRef);
        editor.chain().focus().setImage({ 
            src: _getImageURL(imageRef.url),
            alt: 'user image'
        }).run();
        // add an empty paragraph after an image is added
        editor.commands.createParagraphNear();
        editorDisabled = false;
    }

    const addFile = async (event) => {
        editorDisabled = true;
        const docRef = await _uploadToDocuments(event.target.files[0]);
        if(!Array.isArray(data[config.name + '_files'])) {
            data[config.name + '_files'] = [];
        }
        data[config.name + '_files'].push(docRef);
        editor.commands.insertContent(`<a href="${await _getFileURL(docRef.url)}">DOWNLOAD:: ${docRef.name}</a>`)
        editorDisabled = false;
    }
</script>
  
{#if editor}
<!-- the hidden input element for triggerring the image selection dialog -->
<input
    hidden
    type="file"
    class="file-upload"
    accept="image/*"
    on:change={(e) => addImage(e)}
    bind:this={imageSelector}>
<!-- the hidden input element for triggerring the file selection dialog -->
<input
    hidden
    type="file"
    class="file-upload"
    on:change={(e) => addFile(e)}
    bind:this={fileSelector}>
<!-- toolbar items -->
<button
    on:click={() => editor.chain().focus().toggleHeading({ level: 3}).run()}
    class:active={editor.isActive('heading', { level: 3 })}
    disabled={editorDisabled}>
    <i class="fa-solid fa-heading"></i>
</button>
<button
    on:click={() => editor.chain().focus().setParagraph().run()} 
    class:active={editor.isActive('paragraph')}
    disabled={editorDisabled}>
    <i class="fa-solid fa-paragraph"></i>
</button>
<button
    on:click={() => editor.chain().focus().toggleBold().run()}
    class:active={editor.isActive('bold')}
    disabled={editorDisabled}>
    <i class="fa-solid fa-bold"></i>
</button>
<button
    on:click={() => editor.chain().focus().toggleItalic().run()}
    class:active={editor.isActive('italic')}
    disabled={editorDisabled}>
    <i class="fa-solid fa-italic"></i>
</button>
<button
    on:click={() => editor.chain().focus().toggleStrike().run()}
    class:active={editor.isActive('strike')}
    disabled={editorDisabled}>
    <i class="fa-solid fa-strikethrough"></i>
</button>
<button
    on:click={() => editor.chain().focus().toggleBulletList().run()}
    class:active={editor.isActive('bulletList')}
    disabled={editorDisabled}>
    <i class="fa-solid fa-list-ul"></i>
</button>
<button
    on:click={() => editor.chain().focus().toggleOrderedList().run()}
    class:active={editor.isActive('orderedList')}
    disabled={editorDisabled}>
    <i class="fa-solid fa-list-ol"></i>
</button>
<button
    on:click={selectImage}>
    <i class="fa-solid fa-image"></i>
</button>
<button
    on:click={selectFile}>
    <i class="fa-solid fa-file"></i>
</button>
{/if}
  
<div class='editor-container'>
    <Font
        font={3}
        size={0.8}>
        <div 
        class={error? 'editable error': 'editable'}
        bind:this={element}/>
    </Font>
    
    {#if editorDisabled}
    <div class='editor-mask'>
        <Progress delay={200}/>
    </div>
    {/if}
</div>

  
<style>
    .editor-container {
        position: relative;
    }
    .editor-mask {
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        color: white;
        background-color: black;
        font-size: 1.5rem;
        opacity: 0.7;
        border-radius: var(--s5px);
        z-index: 10000;
    }
    :global(.editable > .ProseMirror) {
        min-height: var(--s300px);
        max-height: 50vh;
        overflow-y: auto;
        border-radius: var(--s5px);
        background-color: white;
        border: var(--s1px) solid var(--button);
        padding: var(--s10px);
    }
    :global(.error > .ProseMirror) {
        border: var(--s2px) solid #c02e46;
    }
    button {
        background: white;
        font-size: 13px;
        border: var(--s1px) solid var(--theme-defaultbutton);
        padding: var(--s3px);
        border-radius: var(--s3px);
    }
    button.active {
        background: black;
        color: white;
    }
    :global(h2) {
        margin: var(--s10px) 0px;
    }

    /* Placeholder (at the top) */
    :global(.ProseMirror p.is-editor-empty:first-child::before) {
        content: attr(data-placeholder);
        float: left;
        color: #a3a3a3;
        pointer-events: none;
        height: 0;
    }
</style>