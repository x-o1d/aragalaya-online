<script>
    import { themes, current } from '$lib/utils/theme';
    import { COLUMNS } from '../../data/columns'; 

    let themeSelect;
    let themePanel;

    let showPanel = false;

    function togglePanel() {
        if(!showPanel) {
            const position = themeSelect.getBoundingClientRect();
            themePanel.style.top = position.bottom + 5 + 'px';
            themePanel.style.left = position.left + 'px';
            showPanel = true;
        } else {
            showPanel = false;
        }
    }

    function selectTheme(index) {
        current.set(index);
        showPanel = false;
    }
</script>

<div 
    bind:this={themeSelect}
    on:click={togglePanel}
    style="
        --theme-1: {themes[$current].columns[0]};
        --theme-2: {themes[$current].columns[2]};
        --theme-3: {themes[$current].columns[4]};
        --theme-4: {themes[$current].columns[6]};">
</div>

<span 
    bind:this={themePanel}
    style="display: {showPanel? 'block': 'none'};">

    {#each themes as theme, _i}
    {#if (_i != $current)}
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
        z-index: 1000;
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