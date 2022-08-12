<script>
    import { onMount } from "svelte";
    import { _redirected, _shareURL } from '$lib/services/store';

    export let postId;

    onMount(() => {
        let redirectURL = `https://www.facebook.com/dialog/share?app_id=420214326726915&display=popup&href=${_shareURL}${postId}`;
        location.href = redirectURL;
        _redirected.set(true);
    });
</script>

<div class="redirect">Redirecting to facebook..</div>

<style>
    .redirect {
        display: flex;
        align-items: center;
        justify-content: center;

        width: 100%;
        height: 100vh;
    }
</style>