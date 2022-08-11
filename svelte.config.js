import firebase from 'svelte-adapter-firebase';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: firebase(),
		methodOverride: {
			allowed: ['PATCH', 'DELETE']
		},
        files: {
            assets: 'static',
		},
	}
};

export default config;
