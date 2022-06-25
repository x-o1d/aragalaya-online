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
        --theme-start: {themes[$current].columns[0]};
        --theme-end: {themes[$current].columns[COLUMNS.length - 1]};">
</div>

<span 
    bind:this={themePanel}
    style="display: {showPanel? 'block': 'none'};">

    {#each themes as theme, _i}
    {#if (_i != $current)}
    <div 
        on:click={() => selectTheme(_i)}
        style="
            --theme-start: {theme.columns[0]};
            --theme-end: {theme.columns[COLUMNS.length - 1]};">
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
        width: 30px;
        height: 30px;
        background: var(--theme-start);
        background: radial-gradient(
            circle at bottom right, 
            var(--theme-start) 20%, 
            var(--theme-end)) 100%; 
        border-radius: 3px;
        border: 1px solid black;
        cursor: pointer;
    }
    span div {
        margin-bottom: 5px;
    }
</style>