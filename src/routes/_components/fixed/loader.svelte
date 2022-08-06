<script>
    // npm modules
    import { onMount } from "svelte";
    // services
    import { _registerEvent } from "$lib/services/events";
    import { _themeColorsReady, _themeSizesReady, _scaledPixelsReady } from "$lib/services/store";
    // components
    import PreloadingIndicator from "$lib/components/util/preloading-indicator.svelte";
    import Logo from "$lib/assets/logo-tiny.png"

    // css loaded variables
    let fontsLoaded = false;
    let faV4FontFaceLoaded = false;
    let faV5FontFaceLoaded = false;
    let faV4ShimsLoaded = false;
    let faMainLoaded = false;

    // app ready for display
    let loadingComplete = false;

    onMount(() => {
        const checkLoadedInterval = setInterval(() => {
            var ss = document.styleSheets;
            for(var i = 0, max = ss.length; i < max; i++) {
                if(ss[i].href == "https://fonts.googleapis.com/css2?family=Gemunu+Libre:wght@600&family=Mukta+Malar:wght@300;400&family=Noto+Sans+Sinhala:wght@300;400&family=Open+Sans:wght@300;400&family=Abhaya+Libre:wght@400;500&family=Hind+Madurai:wght@300;600&family=Noto+Serif+Sinhala:wght@300;600&family=Nunito:wght@400;500&family=Pavanam&family=Source+Sans+Pro:wght@300;600&family=Roboto&display=swap") {
                    fontsLoaded = true;
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
                faV4FontFaceLoaded && 
                faV5FontFaceLoaded && 
                faV4ShimsLoaded && 
                faMainLoaded &&
                // if theme color css variables have been set
                $_themeColorsReady &&
                // if theme size css variables have been set
                $_themeSizesReady &&
                // if scaled pixel value css variables have been set
                $_scaledPixelsReady
            ) {
                setTimeout(() => {
                    loadingComplete = true;
                    clearInterval(checkLoadedInterval);
                }, 200);
            }
        }, 800);
    });
</script>

{#if !loadingComplete}
<div class="loader">
    <div class="title">
        <img src={Logo} alt="අරගලය.online">
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
        z-index: 1000;

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