<script>
    import { _lang } from '$lib/services/store';
    import { _fontGroups, _fontSizes } from '$lib/services/theme';

    export let group;
    export let remSize;

    // reactive declaration is neccesary because the reactive variable is 
    // used as an index $_lang
    // more info in the preview component
    $: rootFontSize = _fontSizes[group][$_lang];
    $: font = _fontGroups[group][$_lang];

</script>

<span style="font-size: {rootFontSize}px">
    <span style="
        font-family: {font};
        font-size: {remSize}em">
        <slot/>
    </span>
</span>


