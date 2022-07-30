<script>
	import { onMount } from 'svelte';
    import { _columnWidth, _cardSeperation } from '$lib/services/theme';

    export let videoId;

	onMount(() => {
		const executeOnApi = () => {
			if (window.YTapiReady) {
				const player = new YT.Player('player-' + videoId, {
					height: '300',
					width: (_columnWidth - _cardSeperation - 20).toString(),
					videoId: videoId,
					playerVars: {
						playsinline: 1
					},
					events: {
						onReady: () => console.log('on ready'),
						onStateChange: () => console.log('on state change')
					}
				});
			} else {
				setTimeout(executeOnApi, 100);
			}
		};
		executeOnApi();
	});
</script>

<div class="youtube">
	<div id="player-{videoId}" />
</div>

<style>
    .youtube {
        border-radius: 3px;
        overflow: hidden;
        height: 300px;
    }
    :global(iframe) {
        
    }
</style>