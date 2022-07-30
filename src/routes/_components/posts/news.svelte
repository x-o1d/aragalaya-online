<script>
    import Card from "$lib/components/util/card.svelte";
    import Youtube from "$lib/components/display/youtube.svelte";

    export let data;

</script>

<Card>
    <Youtube videoId={data.videoId}/>
</Card>