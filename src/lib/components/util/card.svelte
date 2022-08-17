<!-- Card component sets the boundary for all post components
--->
<script>
    import Input from "$lib/components/input/text-input.svelte";
    import { onMount } from "svelte";

    export let data = undefined;

    let comment = {};
    
</script>

<div class="card-container">
    <div class="card">
        <slot/>
        {#if data}
        <div 
            class="comment-box">
            <div 
                class="comment-text">
                <Input
                    data={comment}
                    config={{
                        name: 'text',
                        maxlength: 300,
                        placeholder: [
                            'අදහස් දක්වන්න..',
                            'comment..',
                            'கருத்து..'
                        ]
                    }}
                    style=""/>
            </div>
        </div>
        {/if}
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
    .comment-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;

        margin-top: var(--theme-cardseparationhalf);
    }
    .comment-text {
        display: inline-flex;
        width: 100%;
    }
</style>