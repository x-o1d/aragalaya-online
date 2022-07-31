import { _getPosts } from '$lib/services/database';
import { COLUMNS } from '$lib/config/column-config';

const IMPLEMENTED_TYPES = ['bulletin', 'newsx'];

export const get = async () => {
    const columnData = [];
    for(let column of COLUMNS) {
        let data;
        // get data for the column
        if(IMPLEMENTED_TYPES.includes(column.type)) {
            data = await _getPosts(column.type);
        }

        // if the column type does not have data
        // fill it with empty objects with an id field.
        // id is neccessary since the #each block is
        // keyed on the id.
        // mock: true, ensures that an empty card is rendered
        if(!data || (data && !data.length)) {
            data = Array(10).fill(true).map((_, i) => {
                return {id: i, type: 'empty', height: column.height};
            });
        }
        
        columnData.push(data);
    }
    return {
        status: 200,
        headers: {},
        body: { 
            columnData
        }
    };
}