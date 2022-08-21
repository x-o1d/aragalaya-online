<!-- this component -->
<script>
    // configs
    import { COLUMNS, COLUMN_COUNT } from '$lib/config/column-config';

    // npm modules
    import { onDestroy, onMount } from 'svelte';
    import { tweened } from "svelte/motion";
    import { circIn, quartOut } from "svelte/easing";
    
    // services
    import { _emitEvent, _eventListener } from '$lib/services/events';
    import { _lang } from '$lib/services/store';
    import { _getSizeConfig, _isMobile } from '$lib/services/theme';
    import { _setupNavAnimations } from '$lib/services/scroll';

    // components
    import Font from '$lib/components/display/font.svelte';

    const height = tweened((COLUMN_COUNT + 1) * 70, {
        duration: 350,
        easing: circIn
    });

    let scrollBarHeight = 0;
    let scrollBarElement;

    onMount(() => {
        const sizeConfig = _getSizeConfig();

        scrollBarHeight = (COLUMN_COUNT * sizeConfig.navSize) / 
            (COLUMN_COUNT * sizeConfig.columnWidth) * window.innerWidth;

        _setupNavAnimations(scrollBarElement);
        
    })

    // subscribe to the vertical-scroll event
    const vScrollEvent = _eventListener('hide-nav-menu').subscribe(v => {
        if($_isMobile) {
            if(!hidden) {
                showHide();
            }
        }
    });
    // clear subscription
    onDestroy(() => vScrollEvent.unsubscribe());

    // nav bar hidden flag
    let hidden = false;
    
    function showHide() {
        if(hidden) {
            height.set((COLUMN_COUNT + 1) * _getSizeConfig().navSize);
        } else {
            height.set(0);
        }
        hidden = !hidden;
    }
</script>

<div class="navigation">
    <div class="animated">
        <div 
            class="icons"
            style="max-height: {$height}px">
            {#each COLUMNS as column, _i}
                <div 
                    style="color: var(--theme-navigation-{_i})"
                    class="icon _clickable"
                    on:click={() => _emitEvent('nav-click', _i)}>
                    <i class={column.icon}/>
                </div>
            {/each}
            <div 
                bind:this={scrollBarElement}
                class="scroll"
                style="height: {scrollBarHeight}px;">
            </div>
        </div>
    </div>
    <div 
        on:click={showHide}
        class="icon show-hide _clickable">
        {#if !hidden}
            <i class="fa-solid fa-angles-down"/>
        {:else}
             <i class="fa-solid fa-angles-up"/>
        {/if}
    </div>
</div>

<style>
    .navigation {
        position: fixed;
        right: var(--s5px);
        bottom: var(--s5px);
        z-index: 100;

        display: flex;
        align-items: center;
        flex-direction: column;
        background-color: black;
        border-radius: var(--s6px);
        border: var(--s0_5px) solid white;
    }
    .animated {
        position: relative;
    }
    .icons {
        position: relative;
        overflow: hidden;
    }
    .icon {
        position: relative;
        width: var(--theme-navsize);
        height: var(--theme-navsize);

        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--nav-buttons);
        font-size: var(--theme-naviconsize);
    }
    .toggle {
        color: white;
    }
    .show-hide {
        background-color: black;
        z-index: 1;
        color: white;
        border-radius: var(--s6px);
    }
    .scroll {
        position: absolute;
        right: 0;
        width: var(--s4px);
        background: var(--theme-columns-0);
        background: radial-gradient(
            circle at bottom right, 
            var(--theme-columns-7) 25%, 
            var(--theme-columns-5) 50%,
            var(--theme-columns-3) 75%, 
            var(--theme-columns-1) 100%);
        border-radius: var(--s6px);
    }
</style>