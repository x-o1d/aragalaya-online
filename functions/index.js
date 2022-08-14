const functions = require('firebase-functions');

const runtimeOpts = {
    timeoutSeconds: 300,
    memory: (process.env.MODE == 'prod')? '512MB': '256MB',
    mode: process.env.MODE,
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

exports.addpost = require('./api/index').addpost;
exports.admingetuser = require('./api/index').admingetuser;
exports.adminchangerole = require('./api/index').adminchangerole;

