<script>
	import Nav from './_components/Nav.svelte'
	import ThemeSelector from './_components/ThemeSelector.svelte';
	import { _lang } from '$lib/services/store';
	import { _langFonts, _langFontSize } from '$lib/utils/theme';
	import { onMount } from 'svelte';

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
				.setProperty('--lang-font-size', _langFontSize[v] + 'px');
		});
	})
	
</script>

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
		height: 50px;
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
		padding: 10px 10px;
		align-items: baseline;
		padding-bottom: 10px;
	}
	.aragalaya {
		display: inline-block;
		font-size: 38px;
		line-height: 28px;
		font-weight: bold;
		font-family: 'Gemunu Libre', sans-serif;
	}
	.online {
		display: inline-block;
		font-size: 18px;
		font-family: 'Roboto', sans-serif;
	}

	.nav-right li {
		font-size: 14px;
		line-height: 14px;
		padding: 0 5px;
		font-family: 'Roboto', sans-serif;
	}
	.nav-right:last-child {
		margin-right: 5px;
	}
	.login {
		margin-left: 30px;
	}
	.fa-user-astronaut {
		font-size: 21px;
		margin-right: 10px;
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
	
