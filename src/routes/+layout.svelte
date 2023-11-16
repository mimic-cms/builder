<script>
	import { invalidate } from '$app/navigation'
	import { onMount } from 'svelte'
	import { PUBLIC_DOMAIN } from '$env/static/public'

	export let data

	let { supabase, session } = data
	$: ({ supabase, session } = data)

	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth')
			}
		})

		return () => subscription.unsubscribe()
	})
</script>

<div style="width:100%; height:100%;">
<slot />
</div>
