import { redirect } from '@sveltejs/kit';
import { PUBLIC_AUTH_URL } from '$env/static/public'

// Note: load() blocks page mounting until everything is retrieved. Fetching data in <script> does not block.
export async function load({ parent, data }) {
    const { session } = await parent()
    if (!session) throw redirect(303, PUBLIC_AUTH_URL)

    return data
}
