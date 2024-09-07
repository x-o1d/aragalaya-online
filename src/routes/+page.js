import { COLUMNS } from '$lib/config/column-config';
// import { _getPost, _getPosts } from '$lib/services/database';

const _getPost = () => {
    return {}
}

const _getPosts = () => {
    return [[]]
}

// export const GET = async ({ url }) => {
//     let promises = []
//     // if a post id is specified in the url (?post=<post_id>)
//     // fetch the post data in SSR
//     // index.svelte route will automatically display the post data in
//     // an overlay
//     let postData;
//     // find post id
//     const regex = /post=([^&;]+)/g;
//     const match = regex.exec(url.search);
//     if(match) {
//         promises.push(_getPost(match[1])
//             .then(result => { postData = result }));
//     }
//     // fetch the initial column data
//     const columnData = [];
//     for(const [index, column] of COLUMNS.entries()) {
//         let data;
//         // get data for the column
//         if((column.type == 'static')) {
//             columnData[index] = column.static;
//         } else {
//             promises.push(_getPosts(column.type).then(data => { 
//                     data.map(p => p._columnIndex = index);
//                     columnData[index] = data;
//             }));
//         }
//     }
//     await Promise.all(promises);
//     return {
//         status: 200,
//         headers: {},
//         body: { 
//             columnData: [
                
//             ],
//             postData
//         }
//     };
// }