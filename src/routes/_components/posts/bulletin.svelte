<script>
    import { _lang } from '$lib/services/store';
    
    import Date from '$lib/components/display/date.svelte';
    import Font from '$lib/components/display/font.svelte';
    import Preview from '$lib/components/display/preview.svelte';
    import Card from '$lib/components/util/card.svelte';

    export let data;
    
    let minimized = true;
    
</script>

<Card>
    <div 
        class='_clickable'
        on:click={() => (minimized = !minimized)}>
        <div class="timestamp">
            <Date date={data.createdOn}/>
        </div>
        <div class="title">
            <Font 
                group={1}
                remSize={1.4}>
                {data.title[$_lang]}
            </Font>
        </div>
        <div class="author">
            <Font 
                group={3}
                remSize={0.9}>
                {data.createdByName}
            </Font>
        </div>
        <div class="description">
            <Preview
                data={data.description}
                limit={150}
                preview={minimized}/>
        </div>
    </div>
</Card>


<style>
    .timestamp {
        font-size: 0.9rem;
        color: rgb(100, 99, 99);
    }
    .title {
        font-size: 1.5rem;
        font-weight: bold;
        padding: var(--s7px) 0 0 0;
        letter-spacing: -0.016rem;
    }
    .author {
        padding: 0 0 var(--s7px) 0;
        color: rgb(55, 55, 55);
    }
    .description {
        font-size: 1rem;
        padding: var(--s7px) 0;
        color: rgb(57, 56, 56);
        letter-spacing: 0px;
    }
    :global(.description img) {
        width: 100%;
        border-radius: 3px;
    }

</style>