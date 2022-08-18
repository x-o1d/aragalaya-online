<!-- Card component sets the boundary for all post components
--->
<script>
    // node modules
    import { onDestroy } from 'svelte'; 
    import { v4 as uuid } from 'uuid';

    // services
    import { _appContentReady, _user, _admin, _anonymousId } from '$lib/services/store';
    import { _updatePost } from '$lib/services/database';
    import { _emitEvent } from '$lib/services/events'
    import { _addComment, _deleteComment } from '$lib/services/functions';

    // components
    import Input from "$lib/components/input/text-input.svelte";

    export let data = undefined;

    if(data && !data.comments) {
        data.comments = [];
    }
    
    let comment = {};
    let focused = false;

    let commentError = false;
    let deleteProgress = false;
    let submitProgress = false;

    let submitButton;
    let submitButtonWidth = 34;

    // NOTE: using _appContentReady to read the button height breaks HMR for
    // this component
    const appContentReadyUnsubscribe = _appContentReady.subscribe((value) => {
        if(value) {
            submitButtonWidth = submitButton.clientHeight + 2;
        }
    })
    onDestroy(appContentReadyUnsubscribe);

    const submitComment = async () => {
        if(submitProgress) return;
        submitProgress = true;
        if(!comment.text) {
            submitProgress = false;
            commentError = true;
            return;
        }
        // construct the comment object
        comment.createdBy = ($_user && $_user.uid ) || _anonymousId;
        comment.createdByName = ($_user && $_user.name ) || 'anonymous';
        comment.createdOn = (new Date()).getTime();
        // create a unique id for the 
        comment.id = uuid();
        // update post
        const result = await _addComment({
            id: data.id,
            comment
        });
        if(!result.data.error) {
            data.comments.push(comment);
            comment = {};
            // for reactive update
            data.comments = data.comments;
        }
        submitProgress = false;
    }

    const deleteComment = async (comment, fromButton) => {
        if(deleteProgress) return;
        deleteProgress = true;
        if(!(comment.createdBy == ($_user && $_user.uid)) &&
            !(comment.createdBy == _anonymousId) && 
            !$_admin) 
        {
            deleteProgress = false;
            return;
        }
        if(!fromButton) {
            comment._delete = true;
            // for reactive update
            data.comments = data.comments;
            setTimeout(() => {
                if(deleteProgress) return;
                comment._delete = false;
                // for reactive update
                data.comments = data.comments;
            }, 3000);
        } else {
            // strip _delete local variable from the comment before
            // sending to the backend
            let modifiedComment = JSON.parse(JSON.stringify(comment));
            delete modifiedComment._delete;
            const result = await _deleteComment({
                id: data.id,
                comment: modifiedComment
            });
            if(!result.data.error) {
                const commentIndex = data.comments
                    .findIndex(c => c.id == comment.id);
                data.comments.splice(commentIndex, 1);
                // for reactive update
                data.comments = data.comments;
            }
            comment._delete = false;
        }
        deleteProgress = false;
    }
</script>

<div class="card-container">
    <div 
        class="card"
        style="--comment-button-size: {submitButtonWidth}px">
        <slot/>
        {#if data}
        {#if data.comments.length}
        <div style="margin-top: 12px;">
        {#each data.comments as comment}
            <div 
                class="comment-container"
                class:_clickable={(comment.createdBy == ($_user && $_user.uid)) ||
                    (comment.createdBy == _anonymousId)}
                on:click={() => deleteComment(comment, false)}>
                <div class="comment-author">
                    <div class="author-name">{comment.createdByName}</div>
                </div>
                <div class="comment">{comment.text}</div>
                {#if comment._delete}
                <div 
                    class="delete-button _clickable"
                    class:progress={deleteProgress}
                    style="width: {submitButtonWidth}px;"
                    on:click={() => deleteComment(comment, true)}>
                    <i class="fa-solid fa-trash-can"></i>
                </div>
                {/if}
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
                    error={commentError}
                    on:focus={() => focused = true}
                    on:blur={() => focused = false}
                    on:enter={submitComment}/>
                <div 
                    class="submit-button _clickable"
                    class:progress={submitProgress}
                    bind:this={submitButton}
                    style="background-color: {focused? '#e1e1e1': '#f9f9f9'};"
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
    .comment-container {
        position: relative;
        margin-top: var(--s9px);
        border-left: var(--s1px) solid #f0f0f0;
        padding-left: var(--s3px);
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

        z-index: 1;

        top: 0;
        right: 0;
        height: 100%;
        width: var(--comment-button-size);
        background-color: #f5f5f5;
        color: white;

        border-top-right-radius: var(--s3px);
        border-bottom-right-radius: var(--s3px);
    }
    .progress {
        animation: progress;
        animation-duration: 500ms;
        animation-iteration-count: infinite;
    }
    .delete-button {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;

        z-index: 1;

        top: 0;
        right: 0;
        height: var(--comment-button-size);
        width: var(--comment-button-size);
        background-color: #e1e1e1;
        color: white;

        border-radius: var(--s3px);
    }

    @keyframes progress {
        from {background-color: #e1e1e1;}
        to {background-color: #f5f5f5;}
    }
</style>