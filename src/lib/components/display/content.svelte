<!-- Content component will display any text/html data in the current
---- selected language.
---- it will also add the machine translated symbol for content that
---- has automatically been translated.
---- clicking on the machine translated symbol shows the text in it's 
---- original language.
--->
<script>
    import { _lang } from '$lib/services/store';

    export let data;
    export let contentField;

</script>

<div>
    <!-- the MT component sets the _viewOriginal prop of the data object
    ---- to true when view original is clicked.
    ---- the third index of translated data contains the original untranslated
    ---- text
    --->
    {@html data[contentField][data._viewOriginal? 3: $_lang]}  
</div>

<style>
    /* globalimg {
        background-color: #7b7b7b; 
        height: var(--theme-previewheight);

        margin: var(--theme-cardseparationhalf) 0;
        width: 100%;
        border-radius: 3px;
    } */
</style>
