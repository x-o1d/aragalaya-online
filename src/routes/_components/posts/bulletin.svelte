<script>
    // services
    import { _lang } from '$lib/services/store';

    // components
    import Timestamp from '$lib/components/display/timestamp.svelte';
    import Font from '$lib/components/display/font.svelte';
    import Preview from '$lib/components/display/preview.svelte';
    import Card from '$lib/components/util/card.svelte';
    import Content from '$lib/components/display/content.svelte';
    import MT from '$lib/components/util/mt.svelte';
    import Toolbar from '$lib/components/util/toolbar.svelte';
    import Tags from '$lib/components/util/tags.svelte';

    export let data;
    
</script>

<Card
    data={data}>
    <!-- timestamp -->
    <Font
        font={0}
        size={0.75}
        color="rgb(100, 99, 99)"
        style="margin-bottom: var(--s5px);">
        <Timestamp time={data.createdOn}/>
    </Font>
    <!-- title -->
    <Font 
        font={1}
        size={1.25}
        style="
            font-weight: bold;">
        <Content
            data={data}
            contentField={'title'}/>
    </Font>
    <!-- author -->
    <Font 
        font={3}
        size={0.75}
        color="rgb(55, 55, 55);"
        style="margin-bottom: var(--s10px);">
        {data.createdByName}
    </Font>
    <!-- description -->
    <Font
        font={0}
        size={0.9}
        color="rgb(57, 56, 56);">
        <Preview
            data={data}
            contentField={'description'}
            limit={60}
            expanded={data._expanded}
            on:expandPost={() => data._expanded = true}/>
    </Font>
    <!-- post tags -->
    <Tags 
        tags={data.tags}
        style="margin-top: var(--s10px)"/>
    <!-- machine translated indication
    ---- the _viewOriginal property of data has to be updated
    ---- from the viewOriginal event so that svelte can reactively
    ---- update the content of other components
    --->
    <MT data={data}
        on:viewOriginal={e => data._viewOriginal = e.detail}/>
    <!-- post toolbar -->
    <Toolbar 
        data={data}
        on:toggleExpanded={(e) => data._expanded = e.detail}/>
</Card>
