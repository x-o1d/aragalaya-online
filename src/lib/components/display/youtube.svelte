<script>
	import { onMount } from 'svelte';
    import { _getSizeConfig } from '$lib/config/size-config';

    export let videoId;
    export let style = '';

	onMount(() => {
        const sizeConfig = _getSizeConfig();
		const executeOnApi = () => {
			if (window.YTapiReady) {
				const player = new YT.Player('player-' + videoId, {
					height: '300',
					width: (sizeConfig.columnWidth - sizeConfig.cardSeparation - 20).toString(),
					videoId: videoId,
					playerVars: {
						playsinline: 1
					},
					events: {
						onReady: () => {},
						onStateChange: () => {}
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
</div>

<style>
    .youtube {
        border-radius: var(--s3px);
        overflow: hidden;
        height: var(--s300px);
        width: 100%;
    }
</style>