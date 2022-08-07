<!-- this component is an empty post component and can be used 
---- as the initial template for building any post 
--->
<script>
    // the Card component defines the boundary of any post.
    // it can also be used to provide transition animations on post creation/deletion
	import Card from '$lib/components/util/card.svelte';

    import { _lang } from '$lib/services/store';
    import Preview from '$lib/components/display/preview.svelte';

    // --
    // the post can utilize any of the components in src/lib/components/
    // how to use these components is described in each component file
    // --

	// every post receives a data object that contains the data
    // that was created by the post creation form.
    // the schema of this data has to be specifed in post-config.js.
	export let data;

    // console.log(data);

    let minimized = false;
    
</script>

<div class="proposals">
    <Card>
        <!-- START: post content -->
            <div 
                class="_clickable"
                on:click={() => {
                    minimized = !minimized;
                }}>
                <Preview
                    data={data}
                    contentField={'title'}
                    limit={10}
                    preview={minimized}>
                </Preview>
            </div>
            
        <!-- END: post content -->
    </Card>
</div>

<style>
    .proposals {
        width: 100%;


    }
</style>