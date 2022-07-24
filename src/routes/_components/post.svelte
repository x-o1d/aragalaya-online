<script>
    export let data;
    export let component;
</script>

<div>
    <svelte:component 
        this={component}
        data={data}/>
</div>