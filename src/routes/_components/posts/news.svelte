<script>
    import { _lang } from "$lib/services/store";

    import Card from "$lib/components/util/card.svelte";
    import Youtube from "$lib/components/display/youtube.svelte";
    import Font from "$lib/components/display/font.svelte";
    import Timestamp from "$lib/components/display/timestamp.svelte";
    import Preview from "$lib/components/display/preview.svelte";

    export let data;

    let minimized = true;
</script>

<Card>
    <!-- timestamp -->
    <Font
        font={0}
        size={0.75}
        color="
            rgb(100, 99, 99);
            margin-bottom: var(--s7px);">
        <Timestamp time={data.createdOn}/>
    </Font>
    <!-- youtube video -->
    <Youtube 
        videoId={data.videoId}
        style="margin-bottom: var(--s7px);"/>
    <!-- title -->
    <Font 
        font={1}
        size={1.25}
        style="
            font-weight: bold;
            margin-bottom: var(--s3px);">
        {data.title[$_lang]}
    </Font>
    <!-- short description -->
    <Font
        font={0}
        size={0.9}
        color="rgb(57, 56, 56);">
        <Preview
            content={data.shortDescription}
            limit={100}
            preview={minimized}
            on:click={() => (minimized = !minimized)}/>
    </Font>
</Card>

