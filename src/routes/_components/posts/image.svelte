<!-- the Image component shows an uploaded image
---- with tags
--->
<script>
    // the Card component defines the boundary of any post.
    // it can also be used to provide transition animations on post creation/deletion
	import Card from '$lib/components/util/card.svelte';
    import Toolbar from '$lib/components/util/toolbar.svelte';
    import Tags from '$lib/components/util/tags.svelte';
    
	export let data;

</script>

<Card>
    <!-- post image -->
	<img src={data.image.url} alt="newspaper cartoon">
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