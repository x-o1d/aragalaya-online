<script>
    import { _lang } from '$lib/services/store';
    
    import Date from '$lib/components/display/date.svelte';
    import Font from '$lib/components/display/font.svelte';
    import Preview from '$lib/components/display/preview.svelte';
    import Card from '$lib/components/util/card.svelte';

    export let data;
    
    let minimized = true;
    
</script>

<Card slideInTop={data._slideInTop}>
    <div 
        class='_clickable'
        on:click={() => (minimized = !minimized)}>
        <div class="timestamp">
            <Font
                group={0}
                remSize={0.75}>
                <Date date={data.createdOn}/>
            </Font>
        </div>
        <div class="title">
            <Font 
                group={1}
                remSize={1.25}>
                {data.title[$_lang]}
            </Font>
        </div>
        <div class="author">
            <Font 
                group={3}
                remSize={0.75}>
                {data.createdByName}
            </Font>
        </div>
        <div class="description">
            <Font
                group={0}
                remSize={0.9}>
                <Preview
                    data={data.description}
                    limit={100}
                    preview={minimized}/>
            </Font>
        </div>
    </div>
</Card>


<style>
    .timestamp {
        color: rgb(100, 99, 99);
    }
    .title {
        font-weight: bold;
        padding: var(--s5px) 0 0 0;
        /* TODO: set letter spacing variable for different fonts */
        /* letter-spacing: -1px; */
    }
    .author {
        margin: 0;
        color: rgb(55, 55, 55);
    }
    .description {
        padding: var(--s7px) 0;
        color: rgb(57, 56, 56);
    }
    :global(.description img) {
        width: 100%;
        border-radius: 3px;
    }

</style>