import { COLUMNS } from '$lib/config/column-config';
import { _getPost, _getPosts } from '$lib/services/database';

const IMPLEMENTED_TYPES = ['bulletin', 'newsx', 'bulletinx'];

export const GET = async ({ url }) => {
    // if a post id is specified in the url (?post=<post_id>)
    // fetch the post data in SSR
    // index.svelte route will automatically display the post data in
    // an overlay
    let postData;
    if(url.search.includes('=')) {
        let postId = url.search.split('=')[1];
        postData = await _getPost(postId);
    }
    // fetch the initial column data
    const columnData = [];
    for(let column of COLUMNS) {
        let data;
        // get data for the column
        if(IMPLEMENTED_TYPES.includes(column.type)) {
            data = await _getPosts(column.type);
        } else {
            // if the column type is not implemented
            // fill it with empty objects with an id field.
            // id is neccessary since the #each block is
            // keyed on the id.
            // mock: true, ensures that an empty card is rendered
            data = Array(10).fill(true).map((_, i) => {
                return {id: i, type: 'empty', height: column.height};
            });
        }
        columnData.push(data || []);
    }
    return {
        status: 200,
        headers: {},
        body: { 
            columnData,
            postData
        }
    };
}