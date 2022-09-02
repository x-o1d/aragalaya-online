<!-- the Image component shows an uploaded image
---- with tags
--->
<script>
    import { _getImageURL } from '$lib/services/storage';
    // the Card component defines the boundary of any post.
    // it can also be used to provide transition animations on post creation/deletion
	import Card from '$lib/components/util/card.svelte';
    import Toolbar from '$lib/components/util/toolbar.svelte';
    import Tags from '$lib/components/util/tags.svelte';
    import Content from '$lib/components/display/content.svelte';
    import Font from '$lib/components/display/font.svelte';
    
	export let data;

</script>

<Card>
    <!-- post image -->
	<img src={_getImageURL(data.image.url)} alt="newspaper cartoon">
    <Font 
        font={0}
        size={1}>
        <Content
            data={data}
            contentField={'source'}/>
    </Font>
    <!-- post tags -->
    <Tags 
        tags={data.tags}/>
    <!-- post toolbar -->
    <Toolbar 
        data={data}
        on:toggleExpanded={(e) => data._expanded = e.detail}/>
</Card>

<style>
   
</style>