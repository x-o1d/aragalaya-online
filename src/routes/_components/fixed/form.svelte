<script>
    import { COLUMNS } from '$lib/config/column-config';

    import { onDestroy } from 'svelte';

    import { _lang } from '$lib/services/store';
    import { _emitEvent, _eventListener } from '$lib/services/events'
    import { _createPost } from '$lib/services/functions';
    import { _userSignedIn } from '$lib/services/auth';

    import TextInput from '$lib/components/input/text-input.svelte';
    import HtmlInput from '$lib/components/input/html-input.svelte';
    import Button from '$lib/components/input/button.svelte';
    import Font from '$lib/components/display/font.svelte';
    
    let showForm = false;
    let columnIndex = 0;
    let data = {};

    // listen to the add document event and display the form in an overlay
    // add-document event is triggered by clicking on a + icon in the column 
    // headers
    const addDocumentEvent = _eventListener('show-add-document-form').subscribe(event => {
        columnIndex = event.columnIndex;
        showForm = true;
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

    // map field types to input components
    const COMPONENTS = {
        text: TextInput,
        html: HtmlInput
    }

    const submitDocument = async () => {
        // validate fields
        errors = fieldConfigs.map(config => {
            if(config.required) {
                if(!data[config.name] || 
                    (data[config.name] && !(data[config.name].trim())))
                {
                    return true;
                }
            }
            if(config.validate) {
                return config.validate(data[config.name]);
            } else {
                return false;
            }
        });
        
        if(errors.some(e => e)) return;

        fieldConfigs.map(config => {
            if(config.process) {
                data[config.name] = config.process(data[config.name]);
            }
        });
        
        let user = _userSignedIn();

        // _createPost calls an api endpoint in the backend to
        // translate the data and put it in the db
        // the translated data is returned.
        // fieldType and fieldTranslated properties are appended 
        // to the request data, this information is used by the translations
        // api (html data is handled differently)
        const createdPost = await _createPost({
            ...data,
            ...fieldTypes,
            ...fieldTranslated,
            createdOn: (new Date()).getTime(),
            createdBy: user.uid,
            createdByName: user.name,
            verified: false,
            type: COLUMNS[columnIndex].type,
        });
        console.log('createdPost'. createdPost);
        // this event adds the created data to the relavant column
        _emitEvent('new-column-data', {
            columnIndex,
            postData: {
                ...createdPost.data
            }
        });

        showForm = false;
    }

    const cancelDocument = async () => {
        // reset data and close form
        data = {};
        showForm = false;
    }


</script>

{#if showForm}
<div 
    class="overlay"
    on:click|self={(e) => {
        showForm = false;
    }}>
    <div class="form_c">
        <div class="form">
            <Font
                font={2}
                size={1.3}
                color="black"
                style="
                    margin-bottom: var(--s20px);">
                {COLUMNS[columnIndex].dataFormTitle[$_lang]}
            </Font>
            
            {#each fields as field, _i}
                <svelte:component 
                    this={COMPONENTS[fieldConfigs[_i].type]}
                    config={fieldConfigs[_i]}
                    data={data}
                    error={errors[_i]}/>
            {/each}
            <Button
                form
                onclick={submitDocument}
                text={COLUMNS[columnIndex].submitButton}></Button>
            <Button
                form
                cancel
                onclick={cancelDocument}
                text={COLUMNS[columnIndex].cancelButton}></Button>
        </div>
    </div>
</div>
{/if}

<style>
    .overlay {
        display: flex;
        align-items: center;
        justify-content: center;

        position: fixed;
        z-index: 10000;

        width: 100vw;
        height: 100vh;

        overflow-y: scroll;

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
    }
    .form {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: var(--s20px);
        width: 100%;
        height: 100%;
        background-color: #f0f0f0;
        border-radius: var(--s15px);
        border: var(--s1px) solid #707070;
    }

</style>