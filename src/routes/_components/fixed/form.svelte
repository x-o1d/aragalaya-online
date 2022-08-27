<script>
    import { COLUMNS } from '$lib/config/column-config';
    import { TAGS } from '$lib/config/tag-config';

    import { onDestroy } from 'svelte';

    import { _lang, _verified } from '$lib/services/store';
    import { _emitEvent, _eventListener } from '$lib/services/events'
    import { _createPost } from '$lib/services/functions';
    import { _userSignedIn } from '$lib/services/auth';
    import { _deletePost, _updatePost } from '$lib/services/database';
    import _strings from './form-strings'

    import TextInput from '$lib/components/input/text-input.svelte';
    import ImageInput from '$lib/components/input/image-input.svelte';
    import HtmlInput from '$lib/components/input/html-input.svelte';
    import Button from '$lib/components/input/button.svelte';
    import Font from '$lib/components/display/font.svelte';
    import Select from '$lib/components/input/select.svelte';   
    import Tags from '$lib/components/util/tags.svelte';  
    
    let showForm = false;
    let editMode =false;
    let confirmDelete = false;
    let columnIndex = 0;
    let lang;

    let formData = {};
    let originalData;
    let modifiedData;

    // used in editMode to set selected language formData from the trilingual post data object
    const setFormData = () => {
        // copy the current language values of the modifiedData object
        // to the formData object.
        Object.keys(originalData).map((key) => {
            // check if field is a translated string array
            if(modifiedData[key + '_MT']) {
                formData[key] = modifiedData[key][lang];
            }
            if(modifiedData[key + '_videoId']) {
                formData[key] = modifiedData[key];
            }
        });

        // recreate the html editor content with the current language data.
        // _updateEditorContent is added to the data object by the tiptap 
        // editor.
        // NOTE: we can only have one tiptap editor per form
        // because of this
        if(formData._updateEditorContent) {
            formData._updateEditorContent();
        }
    }

    // used in editMode to move the formData to the mofifiedData object
    const setModifiedData = () => {
        Object.keys(formData).map(key => {
            // check if field is a translated string array
            if(modifiedData[key + '_MT']) {
                modifiedData[key][lang] = formData[key];
            }
            if(formData[key + '_images']) {
                if(originalData[key + '_images']) {
                    modifiedData[key + '_images'] = [...formData[key + '_images'],
                        ...originalData[key + '_images'] ];
                } else {
                    modifiedData[key + '_images'] = [...formData[key + '_images']];
                }
            }
        });
    }

    // used in editMode to set machine translated to false for edited data
    const updateMachineTranslated = () => {
        Object.keys(formData).map(key => {
            // check if field is a translated string array
            if(modifiedData[key + '_MT']) {
                for(let l=0;l<3;l++) {
                    if(modifiedData[key][l] != originalData[key][l]) {
                        modifiedData[key + '_MT'][l] = false;
                    }
                }
            }
        });
    }

    // listen to the add document event and display the form in an overlay
    // add-document event is triggered by clicking on a + icon in the column 
    // headers
    const addDocumentEvent = _eventListener('show-post-form').subscribe(event => {
        // edit post mode
        if(event.data) {
            // initialize the editor with the post data
            originalData = event.data;
            selectedTagNames = originalData.tags;
            columnIndex = originalData._columnIndex;
            unselectedTagNames = JSON.parse(JSON.stringify(COLUMNS[columnIndex].tags))
                .filter(t => !selectedTagNames.includes(t));

            // clone original data
            modifiedData = JSON.parse(JSON.stringify(originalData));

            editMode = true;
            showForm = true;

            lang = $_lang;
            setFormData();
        } 
        // create post mode
        else {
            selectedTagNames = [];
            columnIndex = event.columnIndex;
            if(!COLUMNS[columnIndex].tags) {
                console.log('error: tags are not specified for this column in column-config.js');
            }
            unselectedTagNames = JSON.parse(JSON.stringify(COLUMNS[columnIndex].tags));

            showForm = true;
            lang = $_lang;
        }
    });
    // clear subscription
    onDestroy(() => {
        addDocumentEvent.unsubscribe();
    })

    // get the input field data for the selected column from the column data 
    // property of column-config.js
    $: fields = Object.keys(COLUMNS[columnIndex].data);
    $: fieldConfigs = fields.map(f => {
        let fieldConfig = COLUMNS[columnIndex].data[f];
        fieldConfig.name = f;
        return fieldConfig;
    });

    // create a field translated property to be sent to the backend
    // the api will use this to determine if the field needs to be translated
    // ex: _title-translated: true
    const fieldTranslated = {};
    $: fieldTranslatedArray = fieldConfigs.map(c => {
        fieldTranslated['_' + c.name + '-translate'] = c.translate;
    });

    // create a field type property to be sent to the backend
    // the api will use this to determine if the field needs to be translated
    // ex: _title-type: 'text'
    const fieldTypes = {};
    $: fieldTypesArray = fieldConfigs.map(c => {
        fieldTypes['_' + c.name + '-type'] = c.type;
    });

    // error flags for each field
    $: errors = Array(fields.length).fill(false);
    let tagError = false;

    // map field types to input components
    // NOTE: if a new form input type is being added it has be added here
    // a type in the column-config.js data: {} property must 
    // match a key in the below object
    const COMPONENTS = {
        text: TextInput,
        html: HtmlInput,
        image: ImageInput
    }

    const createPost = async () => {
        // validate fields
        // check if a value is assigned if 'required' is true in the column conig
        // call the validation function if it's specified in the conlumn config
        errors = fieldConfigs.map(config => {
            if(config.required) {
                // if form data is not defined show error
                if(!formData[config.name]) {
                    return 'required';
                } 
                // if form data is defined but is an empty string shoe error
                else if((typeof formData[config.name] == 'string') && !(formData[config.name].trim())) {
                    return 'required';
                }
            }
            if(config.validate) {
                return config.validate(formData[config.name]);
            } else {
                return false;
            }
        });
        
        // set tagError if no tags are selected
        tagError = !selectedTagNames.length;

        if(errors.some(e => e) || tagError) return;

        // call the process function if it's defined in the config
        fieldConfigs.map(config => {
            if(config.process) {
                formData[config.name] = config.process(formData[config.name], formData);
            }
        });
        
        let user = _userSignedIn();

        // _createPost calls an api endpoint in the backend to
        // translate the formData and put it in the db
        // the translated data is returned.
        // fieldType and fieldTranslated properties are appended 
        // to the request formData, this information is used by the translations
        // api (html data is handled differently)
        const createdPost = await _createPost({
            ...formData,
            ...fieldTypes,
            ...fieldTranslated,
            tags: selectedTagNames,
            createdOn: (new Date()).getTime(),
            createdBy: user.uid,
            createdByName: user.name,
            verified: false,
            type: COLUMNS[columnIndex].type,
        });

        // this event adds the created post to the relavant column
        _emitEvent('new-post', {
            ...createdPost.data,
            _columnIndex: columnIndex
        });

        resetForm();
    }

    const editPost = async () => {
        // copy form data to modified data
        setModifiedData();
        // update machine translated fields
        updateMachineTranslated();
        // remove local variables from data
        Object.keys(modifiedData).map(key => {
            if(key.startsWith('_')) {
                delete modifiedData[key];
            }
        })
        // save modifiedData
        let error = await _updatePost({
            ...modifiedData,
            tags: selectedTagNames,
            verified: $_verified,
            modifiedOn: (new Date()).getTime()
        });
        if(error) return;

        // update original data
        Object.keys(modifiedData).map(key => {
            originalData[key] = modifiedData[key];
        })
        // this event triggers an update of the column data in index.svelte
        _emitEvent('update-post');
        resetForm();
    }

    const deletePost = async () => {
        if(!confirmDelete) {
            confirmDelete = true;
        } else {
           let error = await _deletePost(modifiedData);
           // this event adds removed the post from the relavant column
            _emitEvent('delete-post', {
                ...modifiedData
            });
           if(!error) resetForm();
        }
    }

    const resetForm = async () => {
        // reset all data fields
        formData = {};
        originalData = undefined;
        modifiedData = undefined;

        selectedTagNames = [];
        unselectedTagNames = [];

        confirmDelete = false;
        editMode = false;
        lang = undefined;
        columnIndex = 0;
        // hide form
        showForm = false;
    }

    let unselectedTagNames = [];
    let selectedTagNames = [];

    const selectTag = (tagObject) => {
        unselectedTagNames.splice(unselectedTagNames.findIndex(_ => (_ == tagObject.name)), 1);
        selectedTagNames.push(tagObject.name);
        // for reactivity
        selectedTagNames = selectedTagNames;
        unselectedTagNames = unselectedTagNames;
    }

    const clickTag = (tagName) => {
        unselectedTagNames.push(tagName);
        selectedTagNames.splice(selectedTagNames.findIndex(_ => (_ == tagName)), 1);
        // for reactivity
        selectedTagNames = selectedTagNames;
        unselectedTagNames = unselectedTagNames;
    }

    const switchLanguage = (language) => {
        // save the current edits in modifiedData 
        // before switching language
        setModifiedData();
        // switch language
        lang = language;
        // set form formData to the new language
        setFormData();
    }

</script>

{#if showForm}
<div 
    class="overlay"
    on:click|self={resetForm}>
    <div class="form_c">
        <div class="form">
            {#if !editMode}
            <Font
                font={2}
                size={1.3}
                color="black"
                style="
                    margin-bottom: var(--s20px);">
                {COLUMNS[columnIndex].dataFormTitle[lang]}
            </Font>
            {:else}
            <div class="language-select">
                <div class="language">
                    <Button
                        selected={lang == 0}
                        onclick={() => switchLanguage(0)}
                        text={'සිංහල'}
                        font={3}
                        style="
                            width: 100%;
                            padding: var(--s10px);
                            "/>
                </div>
                <div class="language">
                    <Button
                        selected={lang == 1}
                        onclick={() => switchLanguage(1)}
                        text={'english'}
                        font={3}
                        style="
                            width: 100%;
                            padding: var(--s10px);"/>
                </div>
                <div class="language">
                    <Button
                        selected={lang == 2}
                        onclick={() => switchLanguage(2)}
                        text={'தமிழ்'}
                        font={3}
                        style="
                            width: 100%;
                            padding: var(--s10px);"/>
                </div>
            </div>
            {/if}
            {#each fields as field, _i}
                <svelte:component 
                    this={COMPONENTS[fieldConfigs[_i].type]}
                    disabled={(fieldConfigs[_i].editable === false) && editMode}
                    config={fieldConfigs[_i]}
                    data={formData}
                    error={errors[_i]}
                    form/>
            {/each}
            <Tags  
                clickable
                tags={selectedTagNames}
                on:tagclick={(e) => clickTag(e.detail)}/>
            <Select
                placeholder={_strings['tags'][$_lang]}
                options={unselectedTagNames.map(tag => TAGS[tag])}
                on:select={(e) => selectTag(e.detail)}
                error={tagError}/>
            {#if editMode}
            <Button
                form
                onclick={editPost}
                text={_strings['save']}/>
            <Button
                form
                onclick={deletePost}
                text={_strings[confirmDelete? 'confirm_delete': 'delete']}/>
            {:else}
            <Button
                form
                onclick={createPost}
                text={COLUMNS[columnIndex].submitButton}/>
            {/if}
            <Button
                form
                cancel
                onclick={resetForm}
                text={COLUMNS[columnIndex].cancelButton}/>
        </div>
    </div>
</div>
{/if}

<style>
    .overlay {
        display: flex;
        /* justify-content: center; */

        position: fixed;
        z-index: 10000;

        width: 100vw;
        min-height: 100vh;
        max-height: 100vh;

        overflow-y: scroll;
        padding: var(--s50px) 0;
        
        background-color: rgba(0,0,0,0.9);
    }
    .form_c {
        width: var(--s500px);
        padding: var(--s3_75px);
        background: var(--theme-columns-0);
        background: radial-gradient(
            circle at bottom left, 
            var(--theme-columns-0) 25%, 
            var(--theme-columns-2) 50%,
            var(--theme-columns-4) 75%, 
            var(--theme-columns-6) 100%);
        border-radius: var(--s15px);
        border: var(--s1px) solid #5c5c5c;
        margin: auto;
    }
    .form {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: var(--theme-cardpadding);
        width: 100%;
        /* height: 100%; */
        background-color: #f0f0f0;
        border-radius: var(--s15px);
        border: var(--s1px) solid #707070;
    }

    .language-select {
        display: flex;
        align-items: center;
        justify-content: space-between;

        width: 100%;
        margin-bottom: var(--s10px);
    }
    .language {
        display: inline-flex;
        /* height: var(--s50px); */
        width: 33%;
    }
</style>