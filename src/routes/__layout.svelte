<script>
	import Nav from './_components/Nav.svelte'
	import ThemeSelector from './_components/ThemeSelector.svelte';
	import { _lang } from '$lib/services/store';
	import { _langFonts, _langFontSize } from '$lib/utils/theme';
	import { onMount } from 'svelte';

	let cssReady = false;

	// listen to language changes and set root font-family and font sizes
	// fonts in different languages have different display sizes for the 
	// same pixel value.
	// this is managed by setting a correction font size on the root element
	// and using rem font sizes throughout the app
	onMount(() => {
		_lang.subscribe((v) => {
			document.documentElement.style
				.setProperty('--lang-font', _langFonts[v]);
			document.documentElement.style
				.setProperty('--lang-font-size', (_langFontSize[v]/window.devicePixelRatio) + 'px');
		});
	})

	// pixel ratio on windows devices (125%/150% scaling) results the app
	// to look zoomed in and doesn't look pretty
	// to overcome this we're calculating pixel values devided by 
	// devicePixelRatio and setting them as css variables to use throught
	// the app.
	// this ensures that the app looks consistent on all browsers regardless
	// of window scaling.
	// NOTE: mobile browser behavior not tested
	// NOTE: performance cost not measured, so far so good
	// NOTE: ALWAYS use var(--s5px) instead of 5px in absolute lengths (5 = any number)
	// make sure the specified value is in the below pixelValues array
	// var(--s(n)px) values are automatically scaled as per the device
	// pixel ratio
	onMount(() => {
		document.documentElement.style
			.setProperty('--pixel-ratio', window.devicePixelRatio);

		const pixelValues = [
			-3.75, 1, 2, 3, 4, 3.75, 5, 7.5, 10, 14, 15, 17, 18, 21, 22 ,24, 28, 
			30, 36, 38, 50, 70, 100, 300, 500
		];
		pixelValues.map(p => {
			const absP = Math.abs(p);
			const cssVar = '--s' + ((p<0)? '-': '') +
					String(absP).replace('.','_') + 'px';
			const cssVal = p/window.devicePixelRatio + 'px';
			document.documentElement.style.setProperty(cssVar, cssVal);
		})
		cssReady = true;
	});
	
</script>

{#if cssReady}
<Nav/>

<div class="nav">
	<div class="nav-logo">
		<div class="aragalaya">
			අරගලය
		</div>
		<div class="online">
			.online
		</div>
	</div>
	<ul class="nav-right">
		<li on:click={() => _lang.set(0)}> 
			සිංහල 
		</li>
		<li on:click={() => _lang.set(1)}> 
			English 
		</li>
		<li on:click={() => _lang.set(2)}> 
			தமிழ் 
		</li>
		<li class="login">
			<i class="fa-solid fa-user-astronaut"></i>
		</li>
		<li>
			<ThemeSelector/>
		</li>
	</ul>
</div>

<main id="main">
	<slot />
</main>

{/if}

<style>

	:global(html) {
		font-family: var(--lang-font);
		font-size: var(--lang-font-size);
	}

	:global(body) {
		margin: 0;
		overflow: hidden;
	}

	:global(*) {
		box-sizing: border-box;
	}

	/*inline lists */
	:global(ul) {
		display: inline-flex;
		align-items: center;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	:global(li) {
		display: inline-flex;
	}

	/* nav bar */
	.nav {
		--text: rgb(163, 47, 47);
		--shadow-height: 0.5rem;
		--shadow-gradient: linear-gradient(
			to bottom,
			rgba(0, 0, 0, 0.3) 0%,
			rgba(0, 0, 0, 0.1) 30%,
			transparent 100%
		);
		height: var(--s50px);
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100vw;
		margin: 0;
		background-color: #e6e6e6;
		font-family: var(--font);
		transition: transform 0.2s;
		user-select: none;
		padding: 0;
	}

	.nav-logo {
		display: flex;
		padding: var(--s10px) var(--s10px);
		align-items: baseline;
		padding-bottom: 10px;
	}
	.aragalaya {
		display: inline-block;
		font-size: var(--s36px);
		line-height: var(--s28px);
		font-weight: bold;
		font-family: 'Gemunu Libre', sans-serif;
	}
	.online {
		display: inline-block;
		font-size: var(--s18px);
		font-family: 'Roboto', sans-serif;
	}

	.nav-right li {
		font-size: var(--s14px);
		line-height: var(--s14px);
		padding: 0 var(--s5px);
		font-family: 'Roboto', sans-serif;
	}
	.nav-right:last-child {
		margin-right: var(--s5px);
	}
	.login {
		margin-left: var(--s30px);
	}
	.fa-user-astronaut {
		font-size: var(--s21px);
		margin-right: var(--s5px);
	}
	.nav-right li {
		cursor: pointer;
	}

	/* route viewport */
	main {
		position: relative;
		margin: 0 auto;
		overflow: hiden;
	}
	</style>
	
