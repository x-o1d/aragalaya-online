const functions = require('firebase-functions');

const runtimeOpts = {
    timeoutSeconds: 300,
    memory: '512MB',
};

let ssrServerServer;
exports.ssrServer = functions.region('us-central1').runWith(runtimeOpts).
        https.onRequest(async (request, response) => {
    if (!ssrServerServer) {
        functions.logger.info('Initialising SvelteKit SSR entry');
        ssrServerServer = require('./ssrServer/index').default;
        functions.logger.info('SvelteKit SSR entry initialised!');
    }
    functions.logger.info('Requested resource: ' + request.originalUrl);
    return ssrServerServer(request, response);
});

exports.add_post = require('./api/index').add_post;
exports.admin_get_user = require('./api/index').admin_get_user;
exports.admin_change_role = require('./api/index').admin_change_role;
exports.admin_toggle_verified = require('./api/index').admin_toggle_verified;

