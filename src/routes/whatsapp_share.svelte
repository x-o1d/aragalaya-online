<script>
    import { onMount } from "svelte";

    export let postId;

    onMount(() => {
        let redirectURL = `https://wa.me/?text=https%3A%2F%2Faragalaya-online.web.app%2F%3Fpost%3D${postId}`;
        location.href = redirectURL;
        // check if redirect failed, happens if whatsapp desktop is not connected
        // to the browser.
        // redirect to whatsapp web.
        // setTimeout(() => {
        //     if(location.href.includes('whatsapp_share?post')) {
        //         location.href = `https://wa.me/?text=https%3A%2F%2Faragalaya-online.web.app%2F%3Fpost%3D${postId}`;
        //     } else {
        //         window.opener = self;
        //         window.close();
        //     }
        // }, 3000);
    });
</script>

<div class="facebook-share">Redirecting to whatsapp..</div>

<style>
    .facebook-share {
        display: flex;
        align-items: center;
        justify-content: center;

        width: 100%;
        height: 100vh;
    }
</style>