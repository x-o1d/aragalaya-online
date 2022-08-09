<!-- Toast component shows a little popup at the bottom of the screen and shows the
---- text content in the event data (data.text) if data.text is in array it shows
---- the value in current language.
---- if the click event is attached to data.event it will show the toast next to
---- where the click was mode, if not it will show the toast at the bottom of the page
EXAMPLE: (show toast next to the click)

const shareButtonClick = (e) => {
    _emitEvent('show-toast', { 
        text: 'Link copied!',
        event: e
    });
}
--->
<script>
    import { onDestroy } from 'svelte';

    import { _eventListener } from '$lib/services/events';
    import { _lang } from '$lib/services/store';

    import Font from '$lib/components/display/font.svelte';


    let showText = undefined; 
    let event = undefined;

    const showToastEvent = _eventListener('show-toast').subscribe((data) => {
        event = data.event;
        if(Array.isArray(data.text)) {
            showText = data.text[$_lang];
        } else {
            showText = data.text;
        }
        setTimeout(() => {
            showText = undefined;
        }, 2000);
    });
    // clear subscription
    onDestroy(() => showToastEvent.unsubscribe());
</script>

{#if showText}
<div 
    class="toast-container"
    class:event={event}
    style="
        --eventx: {event && (event.x+10)}px;
        --eventy: {event && event.y}px">
    <div class="toast">
        <Font
            font={2}
            size={0.9}>
            {showText}
        </Font>
    </div>
</div>

{/if}

<style>
    .toast-container {
        position: fixed;
        bottom: 0;
        left: 0;

        display: flex;
        justify-content: center;
        
        width: 100vw;
        z-index: 100;
    }
    .event {
        top: var(--eventy);
        left: var(--eventx);

        bottom: auto;
        width: auto;
        /* height: var(--s26px); */

        display: flex;
        justify-content: center;
    }
    .toast {
        display: inline-flex;
        max-width: var(--theme-columnwidth);
        padding: var(--s3px);
        border-radius: var(--s3px);
        border: var(--s1px) solid rgb(114, 114, 114);

        color: black;
        background-color: #ffffff;
        margin-bottom: var(--s5px);

        text-align: center;
    }
</style>