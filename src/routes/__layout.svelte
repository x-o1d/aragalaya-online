<script>
	import { onMount, onDestroy } from 'svelte';

	import { _lang } from '$lib/services/store';
	import { _registerEvent, _emitEvent } from '$lib/services/events';
	import { _themes, _current, _fontGroups, _fontSizes } from '$lib/services/theme';

	import Login from './_components/fixed/login.svelte';
	import Form from './_components/fixed/form.svelte';
	import Nav from './_components/fixed/nav.svelte'

	import ThemeSelector from '$lib/components/util/theme-selector.svelte';

	let cssReady = false;
	let userReady = false;

    // TODO: try automatic subscriptions
	const userReadyEvent =_registerEvent('user-ready').subscribe(() => (userReady = true));
    // clear subscription
    onDestroy(() => {
        userReadyEvent.unsubscribe();
    })

	// listen to language changes and set root font-family and font sizes.
	// fonts in different languages have different display sizes for the 
	// same pixel value.
	// this is managed by setting a correction font size on the root element
	// and using rem font sizes throughout the app.
	onMount(() => {
		_lang.subscribe((v) => {
			document.documentElement.style
				.setProperty('--lang-font', _fontGroups[0][v]);
			document.documentElement.style
				.setProperty('--lang-font-size', (_fontSizes[0][v]/window.devicePixelRatio) + 'px');
		});
	})

	// in css throughout the app var(--s(n)px) values are automatically 
	// scaled as per the device pixel ratio.
	// any value from -10px to 500px with increments of 0.25px can be specified
	// like this.
	// this is achieved by settings corrected pixel values in the below hook.
	//
	// DESCRIPTION:: 
	// pixel ratio on windows devices (125%/150% scaling) results the app
	// to look zoomed in and doesn't look pretty.
	// to overcome this we're calculating pixel values divided by 
	// devicePixelRatio and setting them as css variables to use throught
	// the app.
	// this ensures that the app looks consistent on all browsers regardless
	// of window scaling.
	//
	// NOTE: mobile browser behavior not tested
	// NOTE: performance cost not measured, so far so good
	onMount(() => {
		document.documentElement.style
			.setProperty('--pixel-ratio', window.devicePixelRatio);
			
		const pixelValues = Array(512*4).fill(0).map((_, _i) => (_i/4-10));
		pixelValues.map(p => {
			const absP = Math.abs(p);
			const cssVar = '--s' + ((p<0)? '-': '') +
					String(absP).replace('.','_') + 'px';
			const cssVal = p/window.devicePixelRatio + 'px';
			document.documentElement.style.setProperty(cssVar, cssVal);
		})
		cssReady = true;
	});
    console.log(_themes);
</script>

<!-- Login, Form and Nav are fixed overlay components -->
<!-- they are shown and hidden using the events service -->
<Login/>
<Form/>
<Nav/>

{#if cssReady}
<div 
	class="header"
    style="
            background-color: {_themes[$_current].headerBackground};
            --theme-1: {_themes[$_current].navigation[0]};
            --theme-2: {_themes[$_current].navigation[1]};
            --theme-3: {_themes[$_current].navigation[2]};
            --theme-4: {_themes[$_current].navigation[3]};
            --theme-5: {_themes[$_current].navigation[4]};
            --theme-6: {_themes[$_current].navigation[5]};
            --theme-7: {_themes[$_current].navigation[6]};
            --theme-button: {_themes[$_current].button}
            --theme-button-darker: {_themes[$_current].button}">
	<div class="logo">
		<div class="aragalaya">
			අරගලය
		</div>
		<div class="online">
			.online
		</div>
	</div>
	<ul class="header-right">
		<li on:click={() => _lang.set(0)}> 
			සිංහල 
		</li>
		<li on:click={() => _lang.set(1)}> 
			English 
		</li>
		<li on:click={() => _lang.set(2)}> 
			தமிழ் 
		</li>
		<li 
			on:click={() => _emitEvent('show-hide-login', true)}
			class="login">
			{#if !userReady}
			<i class="fa-solid fa-user-astronaut"></i>
			{:else}
			<i class="fa-solid fa-user-nurse"></i>
			{/if}
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
	ul {
		display: inline-flex;
		align-items: center;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	li {
		display: inline-flex;
	}

	:global(._clickable:hover) {
		cursor: pointer;
	}

	/* applies to paragraph elements added by content-editables */
    :global(p) {
        margin: 0px;
    }

	/* nav bar */
	.header {
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
		font-family: var(--font);
		transition: transform 0.2s;
		user-select: none;
		padding: 0;
	}

	.logo {
		display: flex;
		padding: var(--s10px) var(--s7px);
		align-items: baseline;
		padding-bottom: var(--s10px);
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

	.header-right li {
		font-size: var(--s14px);
		line-height: var(--s14px);
		padding: 0 var(--s5px);
		font-family: 'Roboto', sans-serif;
	}
	.header-right:last-child {
		margin-right: var(--s5px);
	}
	.login {
		margin-left: var(--s30px);
	}
	.fa-solid {
		font-size: var(--s21px);
		margin-right: var(--s5px);
	}
	.header-right li {
		cursor: pointer;
	}

	/* route viewport */
	main {
		position: relative;
		margin: 0 auto;
		overflow: hiden;
	}
	</style>
	
