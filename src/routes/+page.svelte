<script>
	export let data
	let { collections, pages } = data
	let selectedCollection
	$: ({ collections, pages } = data)
</script>

<h1>Builder</h1>
<h2>Add Data</h2>
<form style="display:flex; flex-direction:column; gap:.5rem;" method="POST" action="?/data">
	<label
		>Collection Name
		<input name="collection" type="text" required />
	</label>
	<label
		>Field Name
		<input name="field1" type="text" required />
	</label>
	<label
		>Value
		<input name="value1" type="text" required />
	</label>
	<label
		>Field Name
		<input name="field2" type="text" required />
	</label>
	<label
		>Value
		<input name="value2" type="text" required />
	</label>
	<button style="width:fit-content;" formaction="?/data">Add Data</button>
</form>
<h2>Current Pages</h2>
<ul>
	{#each pages as page}
		<li><a href={page.page_path}>{page.page_path}</a></li>
	{/each}
</ul>
<h2>Add Page</h2>
<form style="display:flex; flex-direction:column; gap:.5rem;" method="POST" action="?/create">
	<label
		>Linked Collection
		<select name="collection" bind:value={selectedCollection}>
			<option value={null}>None</option>
			{#each collections as collection}
				<option value={collection.collection_name}>{collection.collection_name}</option>
			{/each}
		</select>
	</label>
	{#if selectedCollection}
		<div>
			Selected collection:
			<ul>
				{#each collections.find((col) => col.collection_name === selectedCollection).collection_data as dataPairs}
					{#each Object.entries(dataPairs) as [field, value]}
						<li>{field}: {value}</li>
					{/each}
				{/each}
			</ul>
		</div>
		<label
			>Dynamic Path field name
			<input name="dynamic_path" type="text" required />
		</label>
	{:else}
		<label
			>Path
			<input name="path" type="text" required />
		</label>
	{/if}
	<label
		>Component
		<select name="component" required>
			<option value="heading">Heading</option>
		</select>
	</label>
	<label
		>Component Text
		<input name="text" type="text" required />
	</label>
	<button style="width:fit-content;" formaction="?/create">Add Page</button>
</form>
