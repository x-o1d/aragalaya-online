<script>
    // npm modules
	import { onMount, onDestroy } from 'svelte';

    // services
	import { _lang } from '$lib/services/store';
	import { _registerEvent, _emitEvent } from '$lib/services/events';
    import { _setUserTheme } from '$lib/services/database';
    import { _themes, _fontGroups, _fontSizes } from '$lib/services/theme';

    // components
	import Login from './_components/fixed/login.svelte';
	import Form from './_components/fixed/form.svelte';
	import ThemeSelector from '$lib/components/util/theme-selector.svelte';

    // listen to if the user is signed in
    const userReady = _registerEvent('user-ready');
	$: user = $userReady;

	// set all the theme variables as css variables
    // refer theme.js comments
    const setThemeProps = (object, styleName) => {
        Object.keys(object).map(prop => {
            const newStyleName = styleName + '-' + prop.toLowerCase();
            if(typeof object[prop] != 'object') {
               document.documentElement.style.setProperty(newStyleName, object[prop]);
            } else {
                setThemeProps(object[prop], newStyleName);
            }
        })
    }
    // set default theme color properties
	onMount(() => {
        setThemeProps(_themes[0], '--theme');
	})
    // set theme color properties on theme change
    const themeChangedEvent = _registerEvent('theme-changed').subscribe(value => {
        setThemeProps(_themes[value], '--theme');
        if(user) {
            _setUserTheme(user, value);
        }
    })
    // clear subscription
    onDestroy(() => themeChangedEvent.unsubscribe());

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
	});
</script>

<!-- Login, Form and Nav are fixed overlay components -->
<!-- they are shown and hidden using the events service -->
<Login/>
<Form/>

<div 
	class="header">
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
			{#if !user}
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

<style>
	:global(html) {
		font-family: 'Roboto', sans-serif;
	}
	:global(body) {
		margin: 0;
		overflow: hidden;
	}
	:global(*) {
		box-sizing: border-box;
	}
    :global(._clickable:hover) {
		cursor: pointer;
	}
    /* applies to paragraph elements added by the tiptap-editor */
    :global(p) {
        margin: 0px;
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
        background-color: var(--theme-header-background);
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
    .fa-user-nurse {
        color: green;
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
	
