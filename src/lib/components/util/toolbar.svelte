<!-- Toolbar component adds below functionalities to a post: 
---- - expand/minimize 
---- - view single post
---- - share to facebook
---- - share to twitter
---- - verified/not verified indication
---- below snippet has to be added to a post to add the toolbar to a post
EXAMPLE:
<Toolbar 
    data={data}
    on:toggleExpanded={(e) => data._expanded = e.detail}/>
--->
<script>
    // npm modules
    import { createEventDispatcher } from 'svelte';

    // services
    import { _lang } from '$lib/services/store';
    import _strings from './toolbar-strings';

    // components
    import Font from '$lib/components/display/font.svelte';

    // component props
    export let data;

    // event dispatcher
    const dispatch = createEventDispatcher();

    const toggleExpanded = () => {
        dispatch('toggleExpanded', !data._expanded)
    }
</script>

<div class="toolbar">
    <div class="toolbar-left">
        <div 
            class="icon _clickable"
            class:on={data._expanded}
            on:click={toggleExpanded}>
            <i class="fa-solid fa-up-down"></i>
        </div>
        <div class="icon _clickable">
            <i class="fa-solid fa-up-right-and-down-left-from-center"></i>
        </div>
        <div class="icon _clickable">
            <i class="fa-brands fa-facebook"></i>
        </div>
        <div class="icon _clickable">
            <i class="fa-brands fa-twitter"></i>
        </div>
    </div>
    <div class="toolbar-right">
        <Font
            font={0}
            size={0.75}
            style="margin-right: var(--s5px);">
            {_strings['verified'][$_lang]}
        </Font>
        <div class="icon verified">
            <i class="fa-solid fa-check"></i>
        </div>
    </div>
</div>

<style>
    .toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: var(--s10px);
    }
    .toolbar-left {
        display: inline-flex;
    }
    .toolbar-right {
        display: inline-flex;
        align-items: center;
    }
    .icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;

        width: var(--s20px);
        height: var(--s20px);

        margin-right: var(--s5px);

        font-size: var(--s13px);
        background-color: rgb(226, 230, 230);
        border-radius: 3px;
    }
    .on {
        background-color: rgb(124, 124, 124);
        color: white;
    }
    .verified {
        background-color: #85e757;
        color: white;
        margin-right: 0;
    }
    .fa-facebook {
        color: #165baf;
    }
    .fa-twitter {
        color: #1da1f2;
    }
</style>