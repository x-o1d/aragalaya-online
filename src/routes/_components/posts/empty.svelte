<script>
    import Card from "$lib/components/util/card.svelte";
    export let data;
</script>

<Card>
    <div style='height: {data.height}'></div>
</Card>