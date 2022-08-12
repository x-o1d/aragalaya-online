<script>
    //services
    import { _lang } from '$lib/services/store';
    import _strings from './proposal-strings.js'

    // components
    import Card from '$lib/components/util/card.svelte';
    import Preview from '$lib/components/display/preview.svelte';
    import Toolbar from '$lib/components/util/toolbar.svelte';
    import Font from '$lib/components/display/font.svelte';
    import Timestamp from '$lib/components/display/timestamp.svelte';
    import Content from '$lib/components/display/content.svelte';
    import Tags from '$lib/components/util/tags.svelte';

	export let data;

</script>

<div class="proposals">
    <Card>
        <!-- timestamp -->
        <Font
            font={0}
            size={0.75}
            color="
                rgb(100, 99, 99);
                margin-bottom: var(--s5px);">
            <Timestamp time={data.createdOn}/>
        </Font>
        <!-- organization name -->
        <Font 
            font={1}
            size={1.25}
            style="
                font-weight: bold;
                margin-bottom: var(--s10px);">
            <Content
                data={data}
                contentField={'organization'}/>
        </Font>
        <!-- motive -->
        <Font 
            font={3}
            size={0.8}
            color="rgb(55, 55, 55);"
            style="
                margin-bottom: var(--s3px);
                font-weight: bold;">
            {_strings['motive'][$_lang]}
        </Font>
        <!-- motive statement -->
        <Font 
            font={0}
            size={0.9}
            color="rgb(57, 56, 56);"
            style="
                margin-bottom: var(--s10px);">
            <Content
                data={data}
                contentField={'motive'}/>
        </Font>
        <!-- proposal -->
        <Font 
            font={3}
            size={0.8}
            color="rgb(55, 55, 55);"
            style="
                margin-bottom: var(--s3px);
                font-weight: bold;">
            {_strings['proposal'][$_lang]}
        </Font>
        <!-- proposal statement -->
        <Font
            font={0}
            size={0.9}
            color="rgb(57, 56, 56);">
            <Preview
                data={data}
                contentField={'proposal'}
                limit={150}
                expanded={data._expanded}
                on:expandPost={() => data._expanded = true}/>
        </Font>
        <!-- post tags -->
        <Tags 
            tags={data.tags}
            style="margin-top: var(--s10px)"/>
        <!-- post toolbar -->
        <Toolbar 
            data={data}
            on:toggleExpanded={(e) => data._expanded = e.detail}/>
    </Card>
</div>