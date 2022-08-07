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
    {@html data[contentField][data._viewOriginal? 3: $_lang]}  
</div>

<style>

</style>
