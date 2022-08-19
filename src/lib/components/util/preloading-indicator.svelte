<script>
	import { onMount } from 'svelte';

    export let height;

	let p = 0.1;
	let visible = true;

	onMount(() => {
		function next() {
			visible = true;
			p += 0.08;

			const remaining = 1 - p;
			if (remaining > 0.15) setTimeout(next, 500 / remaining);
		}

		setTimeout(next, 250);
	});
</script>

{#if visible}
	<div 
        class="progress-container"
        style="--height: var(--s{height || 4}px)">
		<div class="progress" style="inline-size: {p * 100}%" />
	</div>
{/if}

<style>
	.progress-container {
		position: absolute;
		top: 0;
		left: 0;
		width: 80%;
		height: var(--height);
		z-index: 997;
	}

	.progress {
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		background-color: green;
		transition: width 0.4s;
	}


	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
