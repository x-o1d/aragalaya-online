import { getPosts } from '$lib/services/database';
import { COLUMNS } from '../data/columns'


export const get = async () => {
    const columnData = [];
    for(column of COLUMNS) {
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