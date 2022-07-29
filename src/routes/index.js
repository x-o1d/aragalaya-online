import { _getPosts } from '$lib/services/database';
import { COLUMNS } from '$lib/config/columns-config';

export const get = async () => {
    const columnData = [];
    for(let column of COLUMNS) {
        if(column.type == 'bulletin') {
            columnData.push(await _getPosts(column.type));
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