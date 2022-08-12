<script>
	import { onMount } from 'svelte';
    import { _getSizeConfig } from '$lib/services/theme';

    export let data;
    export let style = '';

    let preview = true;

    let player;
    let playerLoaded = false;
    let youtubeStyles = style + `;--thumbnail: url(${data.videoId_images && data.videoId_images[0].href})`;

    const loadPlayer = () => {
        const sizeConfig = _getSizeConfig();
        if (window.YTapiReady) {
            playerLoaded = true;
            player = new YT.Player('player-' + data.id, {
                height: sizeConfig.previewHeight.toString(),
                width: (sizeConfig.columnWidth
                        - sizeConfig.cardSeparation 
                        - sizeConfig.cardPadding*2
                        ).toString(),
                videoId: data.videoId,
                playerVars: {
                    playsinline: 1
                },
                events: {
                    onReady: () => {
                        preview = false;
                        player.playVideo();
                    },
                    onStateChange: (event) => {
                        if(event.data == 2) {
                            preview = true;
                        }
                    }
                }
            });
            
        } else {
            setTimeout(loadPlayer, 100);
        }
    };

</script>

<div 
    class="youtube"
    class:youtube-preview={preview}
    style={youtubeStyles}>
	<div id="player-{data.id}" />
    {#if preview}
    <div 
        class="youtube-overlay"
        on:click={() => {
            if(!playerLoaded) {
                loadPlayer();
            } else {
                preview = false;
                player.playVideo();
            }
        }}>
        <i class="fa-solid fa-play"></i>
    </div>
    {/if}
</div>

<style>
    .youtube {
        position: relative;
        border-radius: var(--s3px);
        overflow: hidden;
        height: var(--theme-previewheight);
        width: 100%;
    }
    .youtube-preview {
        background-image: var(--thumbnail);
        background-color: #7b7b7b; 
        height: var(--theme-previewheight);
        width: 100%;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        filter: grayscale(0.6);
    }
    .youtube-overlay {
        position: absolute;
        top: 0;
        left: 0;

        display: flex;
        align-items: center;
        justify-content: center;

        color: white;
        font-size: var(--s35px);

        height: var(--theme-previewheight); 
        width: 100%;
        
        background-color: rgba(0,0,0, var(--theme-previewopacity));
        border-radius: 3px;
    }
</style>