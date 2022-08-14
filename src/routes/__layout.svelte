<script>
    // npm modules
	import { onMount, onDestroy } from 'svelte';

    // services
	import { _lang, _themeColorsReady, _themeSizesReady, _scaledPixelsReady, _appContentReady, _authStateChecked, _currentTheme } from '$lib/services/store';
	import { _eventListener, _emitEvent } from '$lib/services/events';
    import { _setUserLanguage, _setUserTheme } from '$lib/services/database';
    import { _userLogout } from '$lib/services/auth';
    import { _themes, _fontGroups, _fontSizes, _getSizeConfig, _isMobile } from '$lib/services/theme';
    
    // components
	import Login from './_components/fixed/login.svelte';
	import Form from './_components/fixed/form.svelte';
	import ThemeSelector from '$lib/components/util/theme-selector.svelte';
    import Loader from './_components/fixed/loader.svelte';
    import Toasts from './_components/fixed/toasts.svelte';


    let user;
    // update user status on auth state change
    // if a user record is found set language and theme to user preference
    const userReadyEvent = _eventListener('user-changed').subscribe((userData) => {
        user = userData;
        if(user) {
            // change the theme to user's default
            _currentTheme.set(user.theme);
            // set the user's languages
            _lang.set(user.language);
        } 
    });
    onDestroy(() => userReadyEvent.unsubscribe());

	// set all the theme variables as css variables
    // refer theme.js comments
    const setThemeColors = (object, styleName) => {
        Object.keys(object).map(prop => {
            const newStyleName = styleName + '-' + prop.toLowerCase();
            if(typeof object[prop] != 'object') {
                if(typeof object[prop] == 'string') {
                    document.documentElement.style.setProperty(newStyleName, object[prop]);
                }
            } else {
                setThemeColors(object[prop], newStyleName);
            }
        })
    }
    // set default theme color properties
	onMount(() => {
        // if a theme isn't stored in local storage default to 0
        let localStorageTheme = localStorage.getItem('theme') || 0;
        _currentTheme.set(localStorageTheme);

        setThemeColors(_themes[localStorageTheme], '--theme');
        // let the Loader component know that theme color variables have
        // been set
        _themeColorsReady.set(true);
	})

    // set default language
    onMount(() => {
        // if a language isn't stored in local storage default to sinhala
        let localStorageLanguage = localStorage.getItem('language') || 0;
        _lang.set(localStorageLanguage);
    })

    // set theme color properties and update user default theme on theme change
    const currentThemeUnsubscribe = _currentTheme.subscribe(value => {
        // ignore _currentTheme store triggers in ssr
        // in ssr _currentTheme remains undefined
        if(value !== undefined) {
            setThemeColors(_themes[value], '--theme');
            localStorage.setItem('theme', value);
            _setUserTheme(user, value);
        }
    })
    // clear subscription
    onDestroy(currentThemeUnsubscribe);

    // update user default language on language change
    // subscribing inside an onMount to prevent local storage access
    // in ssr
    // NOTE: this subscription isn't unsubscribed, should be fine since it's
    // only subscribed once per layout, should look into a better solution
    onMount(() => {
        _lang.subscribe((language) => {
            if(language !== undefined) {
                localStorage.setItem('language', language);
                _setUserLanguage(user, language);
            }
        });
    });


    // set all size configuration values as css variables
    const setThemeSizes = (object, styleName) => {
        Object.keys(object).map(prop => {
            if(typeof object[prop] == 'number') {
                const newStyleName = styleName + '-' + prop.toLowerCase();
                document.documentElement.style.setProperty(newStyleName, object[prop] + 'px');
            }
        })
    }
    onMount(() => {
        // set size variables in css
        setThemeSizes(_getSizeConfig(), '--theme');
        // let the Loader component know that theme size variables have
        // been set
        _themeSizesReady.set(true);
        // reset style variables in css if screen size is changed
        addEventListener('resize', (event) => {
            setThemeSizes(_getSizeConfig(), '--theme');
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
        const MAX_SPX = 500;
        const MIN_SPX = -50;

        let devicePixelRatio = (window && window.innerWidth > 600)
            ? window.devicePixelRatio: 1
			
		const pixelValues = Array((MAX_SPX-MIN_SPX)*4+1).fill(0).map((_, _i) => (_i/4+MIN_SPX));
		pixelValues.map(p => {
			const absP = Math.abs(p);
			const cssVar = '--s' + ((p<0)? '-': '') +
					String(absP).replace('.','_') + 'px';
			const cssVal = p/devicePixelRatio + 'px';
			document.documentElement.style.setProperty(cssVar, cssVal);
		})
        // let the Loader component know that scaled pixel variables have
        // been set
        _scaledPixelsReady.set(true);
	});

    // let the Loader component know that all content and resources has been loaded
    onMount(() => {
        addEventListener('load', (event) => _appContentReady.set(true));
    })

    // setup a global click event listener to capture any events that are not
    // blocked by stopPropogation
    onMount(() => {
        document.addEventListener("click", (event) => {
            _emitEvent('global-click', event);
        });
    })

    // language select selection flag for mobile
    let showLanguageSelect = false;

    // listen to global click events and hide the language option
    const globalClickEvent = _eventListener('global-click').subscribe((event) => {
        // if the source isn't the language button hide the language options
        if((event.target.id != 'language-button') && 
            ((event.target.parentElement && event.target.parentElement.id) != 'language-button')) {
            showLanguageSelect = false;
        }
    });
    // clear subscription
    onDestroy(() => globalClickEvent.unsubscribe());

    const userClick = () => {
        if(!user) {
            _emitEvent('show-hide-login', true);
        } else {
            _userLogout();
        }
           
    }
</script>

<!-- Loader, Login and Form are fixed overlay components -->
<!-- they are shown and hidden using the events service -->
<Loader/>
<Login/>
<Form/>
<Toasts/>

<div 
	class="header">
	<div class="logo">
		<div class="aragalaya">
			අරගලය
		</div>
		<div class="online">
			.online
		</div>
        <div class="beta">
            {import.meta.env.MODE == 'prod'? '(beta)': '(dev-beta)'}
        </div>
	</div>
	<ul class="header-right">
        {#if !$_isMobile}
		<li on:click={() => _lang.set(0)}> 
			සිංහල 
		</li>
		<li on:click={() => _lang.set(1)}> 
			English 
		</li>
		<li on:click={() => _lang.set(2)}> 
			தமிழ் 
		</li>
        {/if}
		<li 
			on:click={userClick}
			class="login">
			{#if !user}
			<i class="fa-solid fa-user-plus"></i>
			{:else}
            <i class="fa-solid fa-user-minus"></i>
			{/if}
		</li>
        {#if $_isMobile}
        <li>
            <div class="language-select">
                <div 
                    class="language-button"
                    id="language-button"
                    on:click={() => showLanguageSelect = !showLanguageSelect}>
                    <i class="fa-solid fa-globe"></i>
                </div>
                {#if showLanguageSelect}
                <div class="languages">
                    <div on:click={() => {
                            _lang.set(0);
                        }}> 
                        සිංහල 
                    </div>
                    <div on:click={() => {
                            _lang.set(1);
                        }}> 
                        English 
                    </div>
                    <div on:click={() => {
                            _lang.set(2);
                        }}> 
                        தமிழ் 
                    </div>
                </div>
                {/if}
            </div>
            
        </li>
        {/if}
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
		height: var(--theme-layoutheaderheight);
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100vw;
		margin: 0;
		font-family: var(--font);
		transition: transform 0.2s;
		user-select: none;
		padding: 0;
        background-color: var(--theme-headerbackground);
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
    .beta {
        padding: var(--s5px);
        font-size: var(--s9px);
        font-weight: bold;
        color: green;
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
	.login .fa-solid {
		font-size: var(--s19px);
		margin-right: var(--s3px);
	}
	.header-right li {
		cursor: pointer;
	}

    .language-select {
        position: relative;
    }
    .language-button {
        display: flex;
        align-items: center;
        justify-content: center;

        width: var(--s30px);
        height: var(--s30px);
        background: white;
        color: black;
        font-size: 18px;
        border-radius: var(--s3px);
        border: 0.0520vw solid black;
        cursor: pointer;
    }
    .languages {
        position: absolute;
        top: var(--s35px);
        right: var(--s-22_5px);

        z-index: 10;
        width: var(--s80px);

        border-radius: var(--s3px);
        border: 0.0520vw solid black;
    }
    .languages > div {
        padding: var(--s10px);
        background-color: white;
        text-align: center;
    }

	/* route viewport */
	main {
		position: relative;
		margin: 0 auto;
		overflow: hiden;
	}
	</style>
	
