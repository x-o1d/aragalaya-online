<script>
    import { onMount } from 'svelte';

    import { _lang } from '$lib/services/store';
    import { _fontGroups, _fontSizes } from '$lib/services/theme';

    export let group;
    export let remSize;
    export let inline = false;

    // devicePixelRatio correction
    let devicePixelRatio = 1;
    // SSR protection, window not available for SSR
    onMount(() => (devicePixelRatio = window.devicePixelRatio));

    // reactive declaration ($:) is neccesary to maintain reactivity
    // when there is an automatically subscribed variable in the 
    // expression ($_lang)
    $: fontSize = _fontSizes[group][$_lang]*remSize*16/devicePixelRatio;
    $: font = _fontGroups[group][$_lang];

</script>

<div style="
    font-family: {font};
    font-size: {fontSize}px;
    display: {inline? 'inline-block': 'block'}">
    <slot/>
</div>

