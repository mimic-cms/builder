<script>
	export let data
	let { collections, pages } = data

	let dataFieldCount = 1
	let entityDataCount = 1
	$: ({ collections, pages } = data)
</script>

<h1>Builder</h1>

<a href="/template">Create Page</a>
<h2>Current Pages</h2>
<ul>
	{#each pages as page}
		<li><a href={page.page_path}>{page.page_path}</a></li>
	{/each}
</ul>
<h2>Current Data</h2>
{#each collections as collection}
	<table style:margin-bottom="9px">
		<caption>{collection.collection_name}</caption>
		{#each Object.keys(collection.collection_data[0]) as field}
			<tr>
				<th>{field}</th>
				{#each collection.collection_data.map((c) => c[field]) as value}
					<td>{value}</td>
				{/each}
			</tr>
		{/each}
	</table>
{/each}
<h2>Add Data</h2>
<form style="display:flex; flex-direction:column; gap:.5rem;" method="POST" action="?/data">
	<label
		>Collection Name
		<input name="collection" type="text" required />
	</label>
	{#each { length: entityDataCount } as _, i}
		<div style:margin-bottom="9px">
			<span style:font-weight="bold">Entity {i}:</span>
			{#each { length: dataFieldCount } as _, j}
				<div style:display="flex" style:gap="9px" style:margin-bottom="9px">
					<label
						>Field Name
						<input name={`entity-${i}-field-${j}`} type="text" required />
					</label>
					<label
						>Value
						<input name={`entity-${i}-value-${j}`} type="text" required />
					</label>
				</div>
			{/each}
			<button type="button" style:width="fit-content" on:click={() => dataFieldCount++}
				>Add field</button
			>
		</div>
	{/each}
	<button type="button" style:width="fit-content" on:click={() => entityDataCount++}
		>Add Entity</button
	>
	<button style:width="fit-content" style:margin-top="24px" formaction="?/data">Add Data</button>
</form>

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
</style>
