<script>
	import Nav from './_components/Nav.svelte'
	import ThemeSelector from './_components/ThemeSelector.svelte';
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
		<li> සිංහල </li>
		<li> English </li>
		<li> தமிழ் </li>
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
	:global(body) {
		margin: 0;
		/* font-family: 'Abhaya Libre', serif;
		font-family: 'Catamaran', sans-serif; */
		font-family: 'Roboto', sans-serif;
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
		font-size: 2.2rem;
		line-height: 1.6rem;
		font-weight: bold;
		font-family: 'Gemunu Libre', sans-serif;
	}
	.online {
		display: inline-block;
		font-size: 1.2rem;
	}

	.nav-right li {
		font-size: 0.9rem;
		line-height: 0.9rem;
		padding: 0 5px;
	}
	.nav-right:last-child {
		margin-right: 5px;
	}
	.login {
		margin-left: 30px;
	}
	.fa-user-astronaut {
		font-size: 1.3rem;
		margin-right: 10px;
	}

	/* route viewport */
	main {
		position: relative;
		margin: 0 auto;
		overflow: hiden;
	}
	</style>
	