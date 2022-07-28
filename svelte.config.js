import firebase from 'svelte-adapter-firebase';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: firebase(),
		prerender: {
			default: true
		},
		files: {
			lib: 'src/lib',
			routes: 'src/routes',
		},
	}
};

export default config;
