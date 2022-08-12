<script>
    // npm modules
    import { onDestroy, onMount } from "svelte";
    // services
    import { _eventListener } from "$lib/services/events";
    import { _themeColorsReady, _themeSizesReady, _scaledPixelsReady, _appContentReady, _authStateChecked } from "$lib/services/store";
    // components
    import PreloadingIndicator from "$lib/components/util/preloading-indicator.svelte";

    // css loaded variables
    let fontsLoaded = false;
    let normalizeCssLoaded = false;
    let faV4FontFaceLoaded = false;
    let faV5FontFaceLoaded = false;
    let faV4ShimsLoaded = false;
    let faMainLoaded = false;

    // app ready for display
    let loadingComplete = false;

    let executionCount = 0;
    onMount(() => {
        let checkLoadedInterval = setInterval(() => {
            var ss = document.styleSheets;
            for(var i = 0, max = ss.length; i < max; i++) {
                if(ss[i].href && ss[i].href.includes('fonts.googleapis.com/css')) {
                    fontsLoaded = true;
                }
                if(ss[i].href && ss[i].href.includes('normalize.css')) {
                    normalizeCssLoaded = true;
                }
                if(ss[i].ownerNode.id == 'fa-v4-font-face') {
                    faV4FontFaceLoaded = true;
                }
                if(ss[i].ownerNode.id == 'fa-v5-font-face') {
                    faV5FontFaceLoaded = true;
                }
                if(ss[i].ownerNode.id == 'fa-v4-shims') {
                    faV4ShimsLoaded = true;
                }
                if(ss[i].ownerNode.id == 'fa-main') {
                    faMainLoaded = true;
                }
            }
            if(fontsLoaded && 
                normalizeCssLoaded &&
                faV4FontFaceLoaded && 
                faV5FontFaceLoaded && 
                faV4ShimsLoaded && 
                faMainLoaded &&
                // if theme color css variables have been set
                $_themeColorsReady &&
                // if theme size css variables have been set
                $_themeSizesReady &&
                // if scaled pixel value css variables have been set
                $_scaledPixelsReady &&
                // if the window 'load' event has been fired
                $_appContentReady &&
                // check if the auth state has been checked
                $_authStateChecked
            ) {
                loadingComplete = true;
                clearInterval(checkLoadedInterval);
            } 
            if(executionCount > 4) {
                if(!normalizeCssLoaded) {
                    console.log('normalize.css pending..');
                }
                if(!faV4FontFaceLoaded || !faV5FontFaceLoaded || !faV4ShimsLoaded || !faMainLoaded) {
                    console.log('font awesome pending..');
                }
                if(!$_themeColorsReady || !$_themeSizesReady || !$_scaledPixelsReady) {
                    console.log('css variables pending..');
                }
                if(!$_appContentReady) {
                    console.log('window onload() pending..');
                }
                if(!$_authStateChecked) {
                    console.log('auth state pending..');
                }
            }
            executionCount++;
        }, 800);
    });
</script>

{#if !loadingComplete}
<div class="loader">
    <div class="title">
        <img src="/logo-tiny.png" alt="අරගලය.online">
    </div>
    <div class="progress-bar">
        <PreloadingIndicator></PreloadingIndicator>
    </div>
</div>
{/if}

<style>
    .loader {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 10000;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        width: 100%;
        height: 100%;

        background-color: white;
    }
    .title {
        padding: 10px;
    }
    .progress-bar {
        position: relative;
        width: 90%;
    }
</style>