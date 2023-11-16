import { redirect } from '@sveltejs/kit';
import { PUBLIC_AUTH_URL } from '$env/static/public'

let passCollections
let userId

/*

create template
to create page(s), link a template with some data
do recipes to test
allow dragging below, to left, to right, and above existing elements. can adjust spacing in x increment by arrow keys?
when click, can center left right or center
*/
export async function load({ parent, locals: { supabase } }) {
    const { session } = await parent()
    if (!session) throw redirect(303, PUBLIC_AUTH_URL)

    userId = session.user.id

    const [{ data: collections }, { data: pages }] = await Promise.all([
        supabase
            .from('collections')
            .select('*'),
        supabase
            .from('pages')
            .select('*')
    ])

    passCollections = collections

    return {
        collections,
        pages
    }
}

export const actions = {
    data: async ({ request, locals: { supabase } }) => {
        const data = await request.formData();
        const collectionData = []
        for (let i = 1; data.get(`entity-${i}-field-1`); i++) {
            let entity = {}
            for (let j = 1; data.get(`entity-${i}-field-${j}`); j++) {
                entity[data.get(`entity-${i}-field-${j}`)] = data.get(`entity-${i}-value-${j}`)
            }
            collectionData.push(entity)
        }
        await supabase.from('collections').insert([{
            collection_name: data.get('collection'),
            collection_data: collectionData,
            user_id: userId
        }])
    }
};