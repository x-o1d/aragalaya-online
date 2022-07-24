<script>
    import { _lang } from '$lib/services/store';
    import { _fontGroups, _fontSizes } from '$lib/utils/theme'

    export let group;
    export let remSize;

    let rootFontSize = _fontSizes[group][0]

    let font = _fontGroups[group][0];
    _lang.subscribe(v => {
        font = _fontGroups[group][v];
        rootFontSize = _fontSizes[group][v];
    })
</script>

<span style="font-size: {rootFontSize}px">
    <span style="
        font-family: {font};
        font-size: {remSize}em">
        <slot/>
    </span>
</span>


