<script>
    // npm modules
	import { onMount, onDestroy } from 'svelte';

    // services
    import { _themes } from '$lib/services/theme';
    import { _eventListener, _emitEvent } from '$lib/services/events';
    import { _currentTheme } from '$lib/services/store';

    let themeSelect;
    let themePanel;

    let showPanel = false;

    // listen to global click events and hide the theme options
    // if you click anywhere else on the screen the theme options should collapse
    const globalClickEvent = _eventListener('global-click').subscribe((event) => {
        // if the source isn't the theme button hide the theme options
        if(event.srcElement.id != 'theme-button') {
            showPanel = false;
        }
    });
    // clear subscription
    onDestroy(() => globalClickEvent.unsubscribe());

    const togglePanel = () => {
        if(!showPanel) {
            const position = themeSelect.getBoundingClientRect();
            themePanel.style.top = position.bottom + 5 + 'px';
            themePanel.style.left = position.left + 'px';
            showPanel = true;
        } else {
            showPanel = false;
        }
    }

    const selectTheme = (index) => {
        _currentTheme.set(index);
    }
</script>

<div 
    id="theme-button"
    bind:this={themeSelect}
    on:click={togglePanel}
    style="
        --theme-1: var(--theme-columns-0);
        --theme-2: var(--theme-columns-2);
        --theme-3: var(--theme-columns-4);
        --theme-4: var(--theme-columns-6);">
</div>

<span 
    bind:this={themePanel}
    style="display: {showPanel? 'block': 'none'};">

    {#each _themes as theme, _i}
    {#if (_i != ($_currentTheme || 0))}
    <div 
        on:click={() => selectTheme(_i)}
        style="
            --theme-1: {theme.columns[0]};
            --theme-2: {theme.columns[2]};
            --theme-3: {theme.columns[4]};
            --theme-4: {theme.columns[6]};">
    </div>
    {/if}
    {/each}
</span>


<style>
    span {
        position: fixed;
        z-index: 10000;
    }
    div {
        width: var(--s30px);
        height: var(--s30px);
        background: var(--theme-1);
        background: radial-gradient(
            circle at bottom right, 
            var(--theme-1) 25%, 
            var(--theme-2) 50%,
            var(--theme-3) 75%, 
            var(--theme-4) 100%);
        border-radius: var(--s3px);
        border: 0.0520vw solid black;
        cursor: pointer;
    }
    span div {
        margin-bottom: var(--s5px);
    }
</style>