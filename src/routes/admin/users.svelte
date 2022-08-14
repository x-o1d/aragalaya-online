<script>
    import { _emitEvent } from "$lib/services/events";
    import { onMount } from "svelte";

    onMount(() => {
        _emitEvent('show-hide-login', 'admin');
    })
</script>

<div>hello</div>