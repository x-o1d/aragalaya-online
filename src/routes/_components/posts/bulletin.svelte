<script>
    import { _lang } from '$lib/services/store';
    
    import Timestamp from '$lib/components/display/timestamp.svelte';
    import Font from '$lib/components/display/font.svelte';
    import Preview from '$lib/components/display/preview.svelte';
    import Card from '$lib/components/util/card.svelte';

    export let data;

    let minimized = true;
    
</script>

<Card slideInTop={data._slideInTop}>
    <!-- adding the _clickable  class makes the cursor
    ---- into a pointer to indicate that the content is
    ---- clickable. 
    ---- the on:click event toggles the minimized flag
    ---- which toggles the Preview component between the 
    ---- cropped/full states -->
    <div 
        class='_clickable'
        on:click={() => (minimized = !minimized)}>
        <!-- timestamp -->
        <Font
            font={0}
            size={0.75}
            color="
                rgb(100, 99, 99);
                padding: 0 0 var(--s5px) 0;">
            <Timestamp time={data.createdOn}/>
        </Font>
        <!-- title -->
        <Font 
            font={1}
            size={1.25}
            style="
                font-weight: bold;">
            {data.title[$_lang]}
        </Font>
        <!-- author -->
        <Font 
            font={3}
            size={0.75}
            color="rgb(55, 55, 55);">
            {data.createdByName}
        </Font>
        <!-- description -->
        <Font
            font={0}
            size={0.9}
            color="rgb(57, 56, 56);">
            <Preview
                content={data.description}
                limit={100}
                preview={minimized}/>
        </Font>
    </div>
</Card>


<style>

</style>