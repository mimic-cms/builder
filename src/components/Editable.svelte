<script>
	import DataField from './DataField.svelte'
	export let tag
	export let placeholder
	export let dataFields
	export function focus() {
		element.focus()
	}
	export function getContent() {
		const clone = element.cloneNode(true)
		const data = clone.querySelectorAll('[contenteditable="false"]')
		data.forEach((d) => (d.outerHTML = '{{' + d.textContent + '}}'))
		clone.removeAttribute('contenteditable')
		clone.removeAttribute('class')
		const content = clone.outerHTML
		clone.remove()
		return content.replace(/<!--.*-->/gm, '')
	}

	let content = placeholder
	let element
	let showToolbar = false

	function dragoverHandler(e) {
		e.preventDefault()
		e.dataTransfer.dropEffect = 'move'
		focus()
	}
	function dropHandler(e) {
		e.preventDefault()
		const data = e.dataTransfer.getData('application/my-app')
		new DataField({
			target: element,
			props: {
				field: data
			}
		})
		// make this a new component that on click has a little x you can click to make it go away
		// draggable component is for ALL use cases and allows transformation from drag to drop...?
	}

	// get adding field to header working...then figure out how to export the code wo dumb contenteditable stuff everywhere...then make handlebars repo and export pages
	// make it possible to preview with different key-value pairs (ie Jane instead of firstname)
	// can i just add text (even just an empty space) before and after the data field to make it editable before and after
	// every individual word is turned into a span while dragging? including the space before and after? then the inner content gets trimmed and turned back into normal text...aside from the data field
</script>

<div style:position="relative">
	<!-- {#if showToolbar}
		<div role="toolbar">
			<fieldset>
				<legend>Alignment:</legend>
				<label>
					Left
					<input type="radio" name="alignment" value="left" checked />
				</label>
				<label>
					Center
					<input type="radio" name="alignment" value="center" />
				</label>
				<label>
					Right
					<input type="radio" name="alignment" value="right" />
				</label>
			</fieldset>
			{#if dataFields}
				<select>
					<option value="" disabled selected>Link data</option>
					{#each dataFields as field}
						<option value={field}>{field}</option>
					{/each}
				</select>
			{/if}
			<button on:click={() => (showToolbar = false)}>Close</button>
		</div>
	{/if} -->
	<svelte:element
		this={tag}
		contenteditable="true"
		bind:innerHTML={content}
		bind:this={element}
		on:focus={() => (showToolbar = true)}
		on:dragover={dragoverHandler}
		on:drop={dropHandler}
	/>
</div>

<style>
	/* [role='toolbar'] {
		position: absolute;
		background-color: white;
		top: -150%;
	} */
	:global([contenteditable='false']) {
		color: gray;
	}
</style>
