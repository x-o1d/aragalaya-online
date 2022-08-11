<!-- this component creates a new route called post_preview 
---- localhost:3000/post_preview
---- this route can be used to preview any post that you're currently
---- working on 
--->
<script>
    // import the post you want to preview
    import Proposals from './_components/posts/proposal.svelte';

    // mock data for the post you want to preview can be
    // set in the below array.
    // each element creates a new card in the preview.
    // createdOn, createdBy and createdByName are standard
    // post properties which are automatically added by
    // the post creation form.
    let mockColumnData = [{
        createdOn: (new Date()).getTime(),
        createdBy: 123,
        createdByName: 'malith',

        title: [
            'යෝජනාවක් එකතු කරන්න',
            'add a proposal asfsadfasdfsdfffffffffffffffffffffffffffffffffffffffffffffff',
            'ஒரு திட்டத்தைச் சேர்க்கவும்',
        ]
    }]

</script>

<div class="preview">
    <div class="column-container">
        <div class="column">
            {#each mockColumnData as data}
            <!-- the component you're previewing has be passed to the
            ---- 'this' attribute below
            --->
            <svelte:component 
                this={Proposals}
                data={data}/>
            {/each}
        </div>
    </div>
</div>

<style>
    .preview {
        display: flex;
        justify-content: center;

        background-color: var(--theme-columnbackground);

        width: 100%;
        height: 100vh;
    }
    .column-container {
        padding: var(--theme-cardseparationhalf);
        
        height: 100%;
    }
    .column {
        display: flex;
        align-items: center;
        justify-content: center;
        
        flex-direction: column;

        width: var(--theme-columnwidth);
        height: 100%;

        padding: 0 var(--theme-cardseparationhalf);
    }
</style>