<!-- MT component takes in the data component and indicates if any of the
---- fields are machine translated in the current language. 
---- if there are machine translated fields and the view original text is clicked
---- the _viewOriginal property of the data object will be set to true. which will be
---- used by the Content and Preview components to view the text in original 
---- language.
---- only the below snippet has to be added to the post component.
EXAMPLE:
<MT data={data}
        on:viewOriginal={e => data._viewOriginal = e.detail}/>
--->
<script>
    // npm modules
    import { createEventDispatcher } from 'svelte';
    
    // services
    import { _lang } from '$lib/services/store';
    import _strings from './mt-strings';

    // components
    import Font from '$lib/components/display/font.svelte';

    const dispatch = createEventDispatcher();

    export let data;

    let objectProps = Object.keys(data);
    let objectFields = objectProps.filter(prop => prop.includes('_MT'));

    $: machineTranslated = objectFields.some(key => data[key][$_lang]);

    let viewOriginal = false;
    const toggleOriginal = () => {
        viewOriginal = !viewOriginal;
        dispatch('viewOriginal', viewOriginal);
    }

</script>

{#if machineTranslated}
<div 
    class="machine-translated"
    on:click={toggleOriginal}>
    <Font
        font={0}
        size={0.75}
        style="text-decoration: underline;">
        {#if !viewOriginal}
        <i class="fa-solid fa-globe"></i> {_strings['machine_translated'][$_lang]}
        {:else}
        <i class="fa-solid fa-globe"></i> {_strings['original_text'][$_lang]}
        {/if}
    </Font>
</div>
{/if}

<style>
    .machine-translated{
        cursor: pointer;
    }
    .fa-solid {
        font-size: var(--s11px);
    }
</style>