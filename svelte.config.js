import firebase from 'svelte-adapter-firebase';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: firebase(),

		// Override http methods in the Todo forms
		methodOverride: {
			allowed: ['PATCH', 'DELETE']
		},
        files: {
            assets: 'src/lib/assets',
			lib: 'src/lib',
		},
	}
};

export default config;
