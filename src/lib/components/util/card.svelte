<!-- Card component sets the boundary for all post components
--->
<script>
    import { tweened } from "svelte/motion";
    import { backInOut } from 'svelte/easing';
    import { onMount } from "svelte";

    // setting slideInTop prop to true would cause it to animate 
    // as sliding from top when initialized.
    export let slideInTop = false;
    // delay sets the time to start the animation from component 
    // initialization
    export let delay = 500;

    let duration = 2000;
    const slideIn = tweened(-20, {
        duration: duration,
        easing: backInOut
    });

    onMount(() => {
        if(slideInTop) {
            setTimeout(() => {
                slideIn.set(450);
                // set slideInTop to false after the animation is done
                // so that mex-height get's reset to 'none'
                setTimeout(() => (slideInTop = false), duration);
            }, delay);
        }
    });

    $: maxHeight = slideInTop? $slideIn + 'px': 'none';
</script>

<div class="card-container">
    <div 
        class="card"
        style="max-height: {maxHeight}">
        <slot/>
    </div>
</div>

<style>
    .card-container {
        padding: var(--config-cardseparationhalf);
    }
    .card {
        max-height: -20px;
        width: 100%;
        border-radius: var(--s3px);
        background-color: white;
        padding: var(--config-cardpadding);
        overflow: hidden;
    }
</style>