<!-- Card component sets the boundary for all post components
--->
<script>
    import { _user } from '$lib/services/store';
    import { _updatePost } from '$lib/services/database';
    import { _emitEvent } from '$lib/services/events'

    import Input from "$lib/components/input/text-input.svelte";
    import { _addComment } from '$lib/services/functions';
    import { onMount } from 'svelte';

    export let data = undefined;
    if(!data.comments) {
        data.comments = [];
    }
    
    let comment = {};
    let focused = false;

    let submitButton;
    let submitButtonWidth = 34;

    onMount(() => {
        submitButtonWidth = submitButton.clientHeight + 2;
    });

    const submitComment = async () => {
        console.log(submitComment);
        // construct the comment object
        comment.createdBy = $_user.uid;
        comment.createdByName = $_user.name;
        comment.createdOn = (new Date()).getTime();
        comment.id = data.id;
        // update post
        const result = await _addComment({
            id: data.id,
            comment,
        });
        if(!result.error) {
            data.comments.push(comment);
            comment = {};
            _emitEvent('update-post');
        }
    }
</script>

<div class="card-container">
    <div class="card">
        <slot/>
        {#if data}
        {#if data.comments.length}
        <div style="margin-top: 12px;">
        {#each data.comments as comment}
            <div style="
                    margin-top: var(--s9px);
                    border-left: 1px solid rgb(240, 240, 240);
                    padding-left: 3px;">
                <div class="comment-author">
                    <div class="author-name">{comment.createdByName}</div>
                </div>
                <div class="comment">{comment.text}</div>
            </div>
        {/each}
        </div>
        {/if}
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
                    on:focus={() => focused = true}
                    on:blur={() => focused = false}
                    on:enter={submitComment}/>
                <div 
                    class="submit-button _clickable"
                    bind:this={submitButton}
                    style="
                        width: {submitButtonWidth}px;
                        background-color: {focused? '#e1e1e1': '#f1f1f1'};"
                    on:click={submitComment}>
                    <i class="fa-solid fa-location-arrow"></i>
                </div>
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
    .comment-author {
        display: flex;
        align-items: baseline;
        justify-content: flex-start;
    }
    .author-name {
        font-size: var(--s11px);
        /* padding-left: var(--s3px); */
        color: black;
        font-weight: bold;
    }
    .comment {
        display: inline-flex;
        font-size: var(--s12px);
        padding: 2px 0px 0 0;
        border-radius: 4px;
        color: rgb(57, 56, 56);
        /* background-color: #f9f9f9; */
    }
    .comment-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        margin-top: var(--theme-cardseparation);
    }
    .comment-text {
        position: relative;
        display: inline-flex;
        width: 100%;
    }
    .submit-button {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;

        z-index: 100;

        top: 0;
        right: 0;
        height: 100%;
        width: var(--s33px);
        background-color: #f5f5f5;
        color: white;

        border-top-right-radius: var(--s3px);
        border-bottom-right-radius: var(--s3px);
    }
</style>