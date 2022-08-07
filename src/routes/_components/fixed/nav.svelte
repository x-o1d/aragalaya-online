<script>
    import { COLUMNS, COLUMN_COUNT } from '$lib/config/column-config';

    import { onDestroy, onMount } from 'svelte';
    import { tweened } from "svelte/motion";
    import { circIn, quartOut } from "svelte/easing";
    
    import { _emitEvent, _eventListener } from '$lib/services/events';
    import { _lang } from '$lib/services/store';
    import { _getSizeConfig, _isMobile } from '$lib/services/theme';

    import Font from '$lib/components/display/font.svelte';

    const height = tweened((COLUMN_COUNT + 1) * 70, {
        duration: 350,
        easing: circIn
    });

    let scrollBarHeight = 0;

    onMount(() => {
        scrollBarHeight = (COLUMN_COUNT * _getSizeConfig().navSize) / 
            (COLUMN_COUNT * _getSizeConfig().columnWidth) * window.innerWidth;
        devicePixelRatio = window.devicePixelRatio;
    })
    
    const scrollPosition = tweened(0, {
        duration: 350,
        easing: quartOut
    });

    // subscribe to the horizontal scroll event
    const hScrollEvent = _eventListener('h-scroll').subscribe(v => {
        scrollPosition.set(v/(COLUMN_COUNT * _getSizeConfig().columnWidth)*(COLUMN_COUNT * _getSizeConfig().navSize));
    });
    // clear subscription
    onDestroy(() => hScrollEvent.unsubscribe());

    // subscribe to the vertical-scroll event
    const vScrollEvent = _eventListener('update-vscroll').subscribe(v => {
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
    // nav item names hidden flag
    let showNames = false;

    // temporarily hide names until transition is complete
    let namesHidden = false;
    
    function showHide() {
        if(hidden) {
            height.set((COLUMN_COUNT + 1) * _getSizeConfig().navSize);
            setTimeout(() => namesHidden = false, 350);
        } else {
            height.set(0);
            namesHidden = true;
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
            <!-- <div 
                class="toggle icon _clickable" 
                on:click={() => showNames = !showNames}>
                {#if !showNames}
                    <i class="fa-solid fa-toggle-off"/>
                {:else}
                    <i class="fa-solid fa-toggle-on"/>
                {/if}
            </div> -->
            <div 
                class="scroll"
                style="
                    height: {scrollBarHeight}px;
                    top: {$scrollPosition}px;">
            </div>
        </div>
        {#if showNames && !namesHidden}
        {#each COLUMNS as column, _i}
        <div 
            on:click={() => showNames = !showNames}
            class="title_c _clickable"
            style="
                right: {(_getSizeConfig().navSize+5)}px;
                bottom: {(_getSizeConfig().navSize*(COLUMN_COUNT+1-_i)+5)}px">
            <div class="title">
                <Font
                    font={1}
                    size={1}>
                    {column.title[$_lang]}
                </Font>
            </div>
        </div>
        {/each}
        {/if}
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


    .title_c {
        position: fixed;
    }
    .title {
        font-weight: bold;
        color: rgb(85, 85, 85);
        padding: var(--s0px) var(--s5px);
        background-color: white; 
    }

</style>