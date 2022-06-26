<script>
    import { onMount } from 'svelte';
    import { COLUMNS } from '../../data/columns';
    import { tweened } from "svelte/motion";
    import { circIn, quartOut } from "svelte/easing";
    import { themes, current } from '$lib/utils/theme';
    import events from '$lib/services/events';
    import { _lang } from '$lib/services/store';

    const _count = COLUMNS.length;

    const height = tweened((_count + 1) * 70, {
        duration: 350,
        easing: circIn
    });

    let scrollHeight = 0;

    onMount(() => {
        scrollHeight = (_count * 70) / 
            (_count * 500) * window.innerWidth;
    })
    
    const scrollPosition = tweened(0, {
        duration: 350,
        easing: quartOut
    });

    events.register('h-scroll').subscribe(v => {
        scrollPosition.set(v/(_count * 500)*(_count * 70));
    });

    let hidden = false;
    let showNames = true;

    function showHide() {
        if(hidden) {
            height.set((_count + 1) * 70);
        } else {
            height.set(0);
        }
        hidden = !hidden;
    }

</script>

<div 
    class="navigation"
    style="--background: {themes[$current].background}">
    <div class="animated">
        <div 
            class="icons"
            style="max-height: {$height}px">
            {#each COLUMNS as column, _i}
                <div 
                    style="color: {themes[$current].nav[_i]}"
                    class="icon"
                    on:click={() => events.emit('nav-click', _i)}>
                    <i class={column.icon}/>
                </div>
            {/each}
            <div 
                class="toggle icon" 
                on:click={() => showNames = !showNames}>
                {#if !showNames}
                    <i class="fa-solid fa-toggle-off"/>
                {:else}
                    <i class="fa-solid fa-toggle-on"/>
                {/if}
            </div>
            <div 
                class="scroll"
                style="
                    --theme-1: {themes[$current].columns[0]};
                    --theme-2: {themes[$current].columns[2]};
                    --theme-3: {themes[$current].columns[4]};
                    --theme-4: {themes[$current].columns[6]};
                    height: {scrollHeight}px;
                    top: {$scrollPosition}px;">
            </div>
        </div>
        {#if showNames}
        <div 
            class="titles"
            style="max-height: {$height}px">
            {#each COLUMNS as column, _i}
            <div class="title_c">
                <div class="title">
                    {column.title[$_lang]}
                </div>
            </div>
            {/each}
            <div class="title_c">
                <div class="title">
                </div>
            </div>
        </div>
        {/if}
    </div>
    
    <div 
        on:click={showHide}
        class="icon show-hide">
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
        border-radius: var(--s3px);
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
        width: var(--s70px);
        height: var(--s70px);

        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--nav-buttons);
        font-size: var(--s22px);
    }
    .icon:hover {
        cursor: pointer;
    }
    .toggle {
        color: white;
    }
    .show-hide {
        background-color: black;
        z-index: 1;
        color: white;
        border-radius: var(--s3px);
    }
    .scroll {
        position: absolute;
        right: 0;
        width: var(--s4px);
        background: var(--theme-1);
        background: radial-gradient(
            circle at bottom right, 
            var(--theme-1) 25%, 
            var(--theme-2) 50%,
            var(--theme-3) 75%, 
            var(--theme-4) 100%);
        border-radius: var(--s3px);
    }

    .titles{
        position: absolute;
        bottom: 0;
        right: var(--s70px);
        width: var(--s300px);
        overflow: hidden;
    }
    .title_c {
        position: relative;
        height: var(--s70px);
    }
    .title {
        position: absolute;
        bottom: 0;
        right: 0;
        font-size: 1.06rem;
        font-weight: bold;
        color: black;
        padding: var(--s2px) var(--s5px);
        background-color: var(--background);
    }

</style>