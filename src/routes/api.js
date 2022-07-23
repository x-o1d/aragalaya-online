import { getPosts } from '$lib/services/database';
 
export async function get() {

    const bulletins = await getPosts('bulletin');

    if (bulletins) {
        return {
            status: 200,
            headers: {},
            body: { bulletins }
        };
    }
 
    return {
        status: 404
    };
}