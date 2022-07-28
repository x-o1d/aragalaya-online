import { getPosts } from '$lib/services/database';
import COLUMNS from '$lib/config/columns-config';

export const get = async () => {
    const columnData = [];
    for(let column of COLUMNS) {
        if(column.type == 'bulletin') {
            columnData.push(await getPosts(column.type));
        } else {
            columnData.push(Array(10).fill(null));
        }
    }
    return {
        status: 200,
        headers: {},
        body: { 
            columnData
        }
    };
}