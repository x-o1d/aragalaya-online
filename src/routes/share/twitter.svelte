<script>
    import { onMount } from "svelte";
    import { _redirected, _shareURL } from '$lib/services/store';

    export let postId;

    onMount(() => {
        let redirectURL = `https://twitter.com/intent/tweet/?url=${_shareURL}${postId}`;
        location.href = redirectURL;
        _redirected.set(true);
    });
</script>

<div class="redirect">Redirecting to twitter..</div>

<style>
    .redirect {
        display: flex;
        align-items: center;
        justify-content: center;

        width: 100%;
        height: 100vh;
    }
</style>