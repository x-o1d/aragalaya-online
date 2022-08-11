<script>
    // services
    import { _lang } from '$lib/services/store';
    import _strings from './wip-strings'

	import Card from '$lib/components/util/card.svelte';
    import Font from '$lib/components/display/font.svelte';

	export let data;

</script>

<Card>
    <div class="wip-icon">
        <i class="fa-solid fa-screwdriver-wrench"></i>
    </div>
    <Font 
        font={2}
        size={1}
        color="rgb(55, 55, 55);"
        style="
            margin-bottom: var(--s10px);
            text-align: center;
            font-weight: bold;">
        {_strings['wip'][$_lang]}
    </Font>
    <Font 
        font={0}
        size={0.9}
        color="rgb(55, 55, 55);"
        style="
            margin-bottom: var(--s10px);
            text-align: center;">
        {data.service[$_lang]}
    </Font>

    <Font 
        font={0}
        size={0.9}
        color="rgb(55, 55, 55);"
        style="
            margin-bottom: var(--s10px);
            text-align: center;">
        {_strings['release'][$_lang] + ': ' + data.releaseDate}
    </Font>
</Card>

<style>
    .wip-icon {
        font-size: var(--s30px);
        text-align: center;
        padding: var(--s20px);
    }
</style>