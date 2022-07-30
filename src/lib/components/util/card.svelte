<script>
    import { tweened } from "svelte/motion";
    import { quartOut, backInOut } from 'svelte/easing';
    import { onMount } from "svelte";

    export let slideInTop = false;
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
                // so that mex-height get's reset to non
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
        padding: var(--theme-cardseperationhalf)
    }
    .card {
        max-height: -20px;
        width: 100%;
        border-radius: var(--s3px);
        background-color: white;
        padding: var(--s10px);
        overflow: hidden;
    }
</style>