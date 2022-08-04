<!-- this component is an empty post component and can be used 
---- as the initial template for building any post 
--->
<script>
    // the Card component defines the boundary of any post.
    // it can also be used to provide transition animations on post creation/deletion
	import Card from '$lib/components/util/card.svelte';

    // --
    // the post can utilize any of the components in src/lib/components/
    // how to use these components is described in each component file
    // --

	// every post receives a data object that contains the data
    // that was created by the post creation form.
    // the schema of this data has to be specifed in post-config.js.
	export let data;

</script>

<Card
    slideInTop={data._slideInTop}
    focused={data.id}>
	<!-- START: post content -->
	<div 
        class="empty-space"
        style="height: {data.height}"/>
	<!-- END: post content -->
</Card>

<style>
    .empty-space {
        width: 100%;
    }
</style>