<!-- Font component sets the font and styles for the content 
---- inside of it.
---- it makes sure that the font sizes are automatically corrected
---- for both devicePixelRatio and inconsistencies between fonts sizes
---- in different languages.
----
---- PROPS:
---- font = number, from 0-3 (refer theme.js comments)
---- size = number, from 0.5-2 (similar to rem values)
---- color = string, (ex: 'black', 'rgb(10,20,30', '#fe2f22')
---- style = string custom styles
---- 
---- USAGE:
---- <Font 
----     font={1}
----     size={1.25}
----     color="rgb(100, 99, 99)"
----     style="
----         font-weight: bold;
----         padding: var(--s5px) 0 0 0;">
----     'styled text content'
---- </Font>
--->
<script>
    import { onMount } from 'svelte';

    // TODO:: needs documentation
    import { _lang } from '$lib/services/store';
    import { _fontGroups, _fontSizes } from '$lib/services/theme';

    export let font = 0;
    export let size = 1;
    export let color = '';
    export let style = '';
    export let inline = false;

    // devicePixelRatio correction
    let devicePixelRatio = 1;
    // SSR protection, window not available for SSR
    onMount(() => {
        devicePixelRatio = (window && window.innerWidth > 600)
            ? window.devicePixelRatio: 1;
    });

    // reactive declaration ($:) is neccesary to maintain reactivity
    // when there is an automatically subscribed variable in the 
    // expression ($_lang)
    $: fontSize = _fontSizes[font][$_lang]*size*16/devicePixelRatio;
    $: fontFamily = _fontGroups[font][$_lang];

</script>

<div style="
    font-family: {fontFamily};
    font-size: {fontSize}px;
    color: {color || 'inherit'};
    display: {inline? 'inline-block': 'block'};
    {style}">
    <slot/>
</div>

