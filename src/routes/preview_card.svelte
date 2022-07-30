<script>
    import Youtube from "$lib/components/display/youtube.svelte";
    import Card from "$lib/components/util/card.svelte";

    // let data = {
    //     videoId: 'ueYFyWW8e5I'
    // }
</script>

<div class="preview">
    <div class="column-container">
        <div class="column">
            <Card>
                <Youtube videoId={'ueYFyWW8e5I'}/>
            </Card>
            <Card>
                <Youtube videoId={'4u5I8GYB79Y'}/>
            </Card>
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
        padding: var(--theme-cardseperationhalf);

        height: 100%;
    }
    .column {
        display: flex;
        align-items: center;
        justify-content: center;
        
        flex-direction: column;

        width: var(--theme-columnwidth);
        height: 100%;

        padding: 0 var(--theme-cardseperationhalf);
    }
    .card-container {
        padding: var(--theme-cardseperationhalf);
    }
</style>