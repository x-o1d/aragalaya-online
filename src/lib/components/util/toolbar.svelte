<!-- Toolbar component adds below functionalities to a post: 
---- - expand/minimize 
---- - view single post
---- - share to facebook
---- - share to twitter
---- - verified/not verified indication
--->
<script>
    import { _lang } from '$lib/services/store';
    import _strings from './toolbar-strings';

    import Font from '$lib/components/display/font.svelte';
</script>

<div class="toolbar">
    <div class="toolbar-left">
        <div class="icon _clickable">
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