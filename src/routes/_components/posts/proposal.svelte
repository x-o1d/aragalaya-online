<script>
	import Card from '$lib/components/util/card.svelte';

    import { _lang } from '$lib/services/store';
    import Preview from '$lib/components/display/preview.svelte';
import Toolbar from '$lib/components/util/toolbar.svelte';

	export let data;

</script>

<div class="proposals">
    <Card>
        <Preview
            data={data}
            contentField={'proposal'}
            limit={50}
            expanded={data._expanded}
            on:expandPost={() => data._expanded = true}>
        </Preview>
        <Toolbar 
            data={data}
            on:toggleExpanded={(e) => data._expanded = e.detail}/>
    </Card>
</div>

<style>
    .proposals {
        width: 100%;
    }
</style>