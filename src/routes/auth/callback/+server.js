import { redirect } from '@sveltejs/kit'
import { PUBLIC_AUTH_URL, PUBLIC_DOMAIN } from '$env/static/public'

export const GET = async ({ url, cookies }) => {
    const code = url.searchParams.get('code')
    const iss = url.searchParams.get('iss')
    const refresh = url.searchParams.get('refresh')

    if (code && iss && refresh) {
        cookies.set(`sb-${iss}-auth-token`, `["${code}","${refresh}",null,null,null]`, {
            domain: PUBLIC_DOMAIN,
            httpOnly: false,
            path: '/',
            sameSite: 'None',
            secure: false
        })
        throw redirect(300, '/')
    }

    throw redirect(303, PUBLIC_AUTH_URL)
}
