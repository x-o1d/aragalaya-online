<!-- Card component sets the boundary for all post components
--->
<script>
    import { tweened } from "svelte/motion";
    import { backInOut } from 'svelte/easing';
    import { onMount, onDestroy } from "svelte";

    import { _eventListener, _emitEvent } from '$lib/services/events'

    export let id = undefined;
    // setting slideInTop prop to true would cause it to animate 
    // as sliding from top when initialized.
    export let slideInTop = false;
    // delay sets the time to start the animation from component 
    // initialization
    export let delay = 500;
    // duration sets the duration of the animation
    let duration = 2000;
    let blur = false;

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
    <div class:card-blur-2={blur}>
        <div 
            class="card"
            style="max-height: {maxHeight}"
            class:card-blur={blur}>
            <slot/>
        </div>
    </div>
</div>

<style>
    .card-container {
        padding: var(--theme-cardseparationhalf);
    }
    .card {
        position: relative;

        max-height: -20px;
        width: 100%;
        border-radius: var(--s3px);
        background-color: white;
        padding: var(--theme-cardpadding);
        overflow: hidden;
    }
    .card-blur {
        filter: grayscale(1);
    }
    .card-blur-2 {
        filter: blur(0.7px);
    }
</style>