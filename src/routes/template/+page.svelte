<script>
	import { tick } from 'svelte'
	import Editable from '../../components/Editable.svelte'
	export let data

	const componentMap = {
		header: 'h1'
	}

	let { collections, userId } = data
	let selectedCollection
	let parsedCollection
	let dynamicPath = ''
	let staticPath = ''
	let form
	let output = ''
	const editableElements = []

	$: {
		editableElements.forEach((element) => element.$set({ dataFields: parsedCollection?.fields }))
	}

	$: if (selectedCollection) {
		const collection = collections.find(
			(col) => col.collection_id === selectedCollection
		).collection_data
		const fields = Object.keys(collection[0])
		parsedCollection = {
			collection,
			fields
		}
	}

	function dragstartHandler(e) {
		e.dataTransfer.setData('application/my-app', e.target.getAttribute('drag-type'))
		e.dataTransfer.effectAllowed = 'move'
	}
	function dragoverHandler(e) {
		e.preventDefault()
		e.dataTransfer.dropEffect = 'move'
	}
	function dropHandler(e) {
		e.preventDefault()
		const data = e.dataTransfer.getData('application/my-app')
		if (!Object.keys(componentMap).includes(data)) return
		const newElement = new Editable({
			target: e.target,
			props: {
				tag: componentMap[data],
				placeholder: data,
				dataFields: parsedCollection?.fields
			}
		})
		editableElements.push(newElement)
		// make this create an instance of a svelte component -- a svelte component that WRAPS the html element and includes a popover menu on focus that allows you to align the text, change color, and swap in data
		newElement.focus()
	}
	function save(e) {
		editableElements.forEach((e) => {
			output = output.concat(e.getContent() + '\n')
		})
		tick().then(() => form.submit())
	}
</script>

<h1>Page Creator</h1>
<div
	style:display="flex"
	style:flex-direction="row"
	style:gap="9px"
	style:width="100%"
	style:height="100%"
>
	<div
		style:width="50%"
		style:min-height="100px"
		style:background-color="lightgray"
		style:border="3px dashed gray"
		on:drop={dropHandler}
		on:dragover={dragoverHandler}
	/>
	<div>
		<h2>Components</h2>
		<ul>
			<li
				drag-type="header"
				draggable="true"
				style:padding="4px 9px"
				style:background-color="white"
				style:border="3px solid gray"
				style:list-style-type="none"
				on:dragstart={dragstartHandler}
			>
				Header
			</li>
		</ul>
		<form bind:this={form} method="POST">
			<h2>Dynamic Data</h2>
			<label
				>Linked Collection
				<select name="collection" bind:value={selectedCollection}>
					<option value={''}>None</option>
					{#each collections as collection}
						<option value={collection.collection_id}>{collection.collection_name}</option>
					{/each}
				</select>
			</label>
			{#if selectedCollection}
				<div>
					Selected collection:
					<table>
						{#each parsedCollection.fields as field}
							<tr>
								<th drag-type={field} draggable="true" on:dragstart={dragstartHandler}>{field}</th>
								{#each parsedCollection.collection.map((c) => c[field]) as value}
									<td>{value}</td>
								{/each}
							</tr>
						{/each}
					</table>
				</div>
			{/if}

			<div style:display="flex" style:margin-top="24px" style:gap="9px" style:align-items="center">
				<label style:display="block"
					>Path: /
					<input name="static-path" type="text" bind:value={staticPath} />
				</label>
				{#if selectedCollection}
					<span>/</span>
					<select name="dynamic-path" bind:value={dynamicPath}>
						{#each parsedCollection.fields as field}
							<option value={field}>{field}</option>
						{/each}
					</select>
				{/if}
			</div>
			<input bind:value={output} type="hidden" name="output" />
			<button on:click={save} style:display="block" style:margin-top="24px" type="button"
				>Save</button
			>
		</form>
	</div>
</div>

<style>
	table {
		border: 3px solid gray;
		border-collapse: collapse;
	}
	th,
	td {
		padding: 4px 9px;
		border: 3px solid gray;
	}
	[draggable='true'] {
		cursor: pointer;
	}
</style>
