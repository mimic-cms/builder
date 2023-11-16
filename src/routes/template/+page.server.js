import { redirect } from '@sveltejs/kit';
import { PUBLIC_AUTH_URL } from '$env/static/public'

let userId

export async function load({ parent, locals: { supabase } }) {
    const { session } = await parent()
    if (!session) throw redirect(303, PUBLIC_AUTH_URL)

    const { data: collections } = await supabase.from('collections').select('*')

    userId = session.user.id
    return {
        collections
    }
}

export const actions = {
    default: async ({ request, locals: { supabase } }) => {
        const data = await request.formData();
		const insertItem = {
			static_path: data.get('static-path'),
            dynamic_path: data.get('dynamic-path'),
			page_context: data.get('collection'),
			page_layout: data.get('output'),
			user_id: userId
		}
		supabase.from('pages').insert(insertItem)

    }
};