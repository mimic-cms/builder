import { redirect } from '@sveltejs/kit';
import { PUBLIC_AUTH_URL } from '$env/static/public'

let passCollections
let userId

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
    create: async ({ request, locals: { supabase } }) => {
        const data = await request.formData();
        const selectedCollection = data.get('collection') ? passCollections.find((col) => col.collection_name === data.get('collection')) : null
        const insertItems = []
        data.get('collection') !== null
            ? (selectedCollection.collection_data.forEach((collData => {
                insertItems.push({
                    page_path: selectedCollection.collection_name + '/' + collData[data.get('dynamic_path')],
                    page_context: selectedCollection.collection_id,
                    page_layout: {
                        component: {
                            name: data.get('component'),
                            slots: {
                                default: data.get('text')
                            }
                        }
                    },
                    user_id: userId
                })
            })))
            : insertItems.push({
                page_path: data.get('path'),
                page_context: null,
                page_layout: {
                    component: {
                        name: data.get('component'),
                        slots: {
                            default: data.get('text')
                        }
                    }
                },
                user_id: userId
            })
        await supabase.from('pages').insert(insertItems)
    },
    data: async ({ request, locals: { supabase } }) => {
        const data = await request.formData();
        await supabase.from('collections').insert([{
            collection_name: data.get('collection'),
            collection_data: [{ [data.get('field1')]: data.get('value1') }, { [data.get('field2')]: data.get('value2') }],
            user_id: userId
        }])
    }
};