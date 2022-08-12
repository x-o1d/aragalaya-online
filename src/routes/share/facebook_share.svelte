<script>
    import { onMount } from "svelte";

    export let postId;

    onMount(() => {
        let redirectURL = `https://www.facebook.com/dialog/share?app_id=420214326726915&display=popup&href=https%3A%2F%2Faragalaya-online.web.app%2F%3Fpost%3D${postId}`;
        location.href = redirectURL;
    });
</script>

<div class="facebook-share">Redirecting to facebook..</div>

<style>
    .facebook-share {
        display: flex;
        align-items: center;
        justify-content: center;

        width: 100%;
        height: 100vh;
    }
</style>