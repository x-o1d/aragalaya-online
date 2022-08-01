<script>
	import { onMount } from 'svelte';
    import { _getSizeConfig } from '$lib/services/theme';

    export let videoId;
    export let style = '';

    let preview = true;

    let player;

	onMount(() => {
        const sizeConfig = _getSizeConfig();
		const executeOnApi = () => {
			if (window.YTapiReady) {
				player = new YT.Player('player-' + videoId, {
					height: sizeConfig.previewHeight.toString(),
					width: (sizeConfig.columnWidth
                            - sizeConfig.cardSeparation 
                            - sizeConfig.cardPadding*2
                            ).toString(),
					videoId: videoId,
					playerVars: {
						playsinline: 1
					},
					events: {
						onReady: () => {},
						onStateChange: (event) => {
                            if(event.data == 2) {
                                preview = true;
                            }
                        }
					}
				});
			} else {
				setTimeout(executeOnApi, 100);
			}
		};
		executeOnApi();
	});
</script>

<div 
    class="youtube"
    style={style}>
	<div id="player-{videoId}" />
    {#if preview}
    <div 
        class="youtube-overlay"
        on:click={() => {
            preview = false;
            player.playVideo();
        }}></div>
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
    .youtube-overlay {
        position: absolute;
        top: 0;
        left: 0;

        height: var(--theme-previewheight); 
        width: 100%;
        
        background-color: black;
        opacity: var(--theme-previewopacity);
        border-radius: 3px;
    }
</style>