<script>
    import COLUMNS from '$lib/config/columns-config';

    import { themes, current } from '$lib/services/theme';
    import { _lang } from '$lib/services/store';
    import { events } from '$lib/services/events'

    import TextInput from '$lib/components/input/text-input.svelte';
    import HtmlInput from '$lib/components/input/html-input.svelte';
    import Button from '$lib/components/input/button.svelte';
    import { createPost } from '$lib/services/database';
    import { userSignedIn } from '$lib/services/auth';

    let showForm = false;
    let columnIndex = 0;
    let data = {};

    events.register('add-document').subscribe(event => {
        if(event.columnIndex != undefined) {
            columnIndex = event.columnIndex;
            showForm = true;
        }
    });

    // get input fields from the column data property of
    // column-config.js
    const fields = Object.keys(COLUMNS[columnIndex].data);
    const fieldConfigs = fields.map(f => {
        let fieldConfig = COLUMNS[columnIndex].data[f];
        fieldConfig.name = f;
        return fieldConfig;
    });

    let error = Array(fields.length).fill(false);
    // map data types to input components
    const COMPONENTS = {
        text: TextInput,
        html: HtmlInput
    }

    const submitDocument = async () => {
        // validate fields
        error = fieldConfigs.map(config => {
            if(config.required) {
                if(!data[config.name] || 
                    (data[config.name] && !(data[config.name].trim())))
                return true;
            }
            if(config.validate) {
                return config.validate(data[config.name]);
            } else {
                return false;
            }
        });

        let user = userSignedIn();
        let document = await createPost({
            ...data,
            createdOn: (new Date()).getTime(),
            createdBy: user.uid,
            createdByName: user.name,
            verified: false,
            svelte: true,
            type: COLUMNS[columnIndex].type,
        });
        events.emit('add-to-column', {
            index: columnIndex,
            data: document
        });
        showForm = false;
    }
</script>

{#if showForm}
<div 
    class="overlay"
    on:click|self={(e) => {
        console.log(e);
        showForm = false;
    }}>
    <div class="form_c"
         style="
            --theme-1: {themes[$current].nav[0]};
            --theme-2: {themes[$current].nav[2]};
            --theme-3: {themes[$current].nav[4]};
            --theme-4: {themes[$current].nav[6]};
            --button: {themes[$current].button}">
        <div class="form">
            <span>{COLUMNS[columnIndex].dataFormTitle[$_lang]}</span>
            {#each  fields as field, _i}
                <svelte:component 
                    this={COMPONENTS[fieldConfigs[_i].type]}
                    config={fieldConfigs[_i]}
                    data={data}
                    error={error[_i]}/>
            {/each}
            <Button
                onclick={submitDocument}
                text={COLUMNS[columnIndex].submitButton}></Button>
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

        background-color: rgba(0,0,0,0.9);
    }
    .form_c {
        width: var(--s500px);
        padding: var(--s3_75px);
        background: var(--theme-1);
        background: radial-gradient(
            circle at bottom left, 
            var(--theme-1) 25%, 
            var(--theme-2) 50%,
            var(--theme-3) 75%, 
            var(--theme-4) 100%);
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
    span {
        font-size: 1.3rem;
        font-weight: bold;
        color: black;
        margin-bottom: var(--s20px);
    }

</style>