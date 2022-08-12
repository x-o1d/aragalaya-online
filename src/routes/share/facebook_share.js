export const GET = async ({ url }) => {
    // if a post id is specified in the url (?post=<post_id>)
    // fetch the post data in SSR
    // index.svelte route will automatically display the post data in
    // an overlay
    let postId;
    if(url.search.includes('=')) {
        postId = url.search.split('=')[1];
    }
    return {
        status: 200,
        headers: {},
        body: { 
            postId,
        }
    };
}