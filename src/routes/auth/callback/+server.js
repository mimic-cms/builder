import { redirect } from '@sveltejs/kit'
import { PUBLIC_AUTH_URL } from '$env/static/public'

export const GET = async ({ url, locals: { supabase } }) => {
    const code = url.searchParams.get('code')

    if (code) {
        await supabase.auth.exchangeCodeForSession(code)
    }

    throw redirect(303, PUBLIC_AUTH_URL)
}
