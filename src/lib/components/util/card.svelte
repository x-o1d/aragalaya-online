<!-- Card component sets the boundary for all post components
--->
<script>
    import { _eventListener, _emitEvent } from '$lib/services/events'

    export let id = undefined;

</script>

<div class="card-container">
    <slot/>
</div>

<style>
    .card-container {
        padding: var(--theme-cardseparationhalf);
    }
</style>