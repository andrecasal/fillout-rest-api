import type { MetaFunction } from '@remix-run/node'
import { useFetcher } from '@remix-run/react'

export const meta: MetaFunction = () => {
	return [
		{ title: 'Fillout' },
		{ name: 'description', content: 'Welcome to Fillout' },
	]
}

export default function Index() {
	const fetcher = useFetcher()

	return (
		<div className="mt-8 flex flex-col items-center justify-center">
			<fetcher.Form
				method="GET"
				action="/cLZojxk94ous/filteredResponses"
				className="flex flex-col gap-6 rounded-xl bg-white p-6"
			>
				<fieldset className="flex items-baseline gap-3">
					<label htmlFor="limit" className="w-20">
						Limit:
					</label>
					<input
						type="number"
						name="limit"
						id="limit"
						className="w-full min-w-96 rounded-md border p-1"
						defaultValue={150}
					/>
				</fieldset>
				<fieldset className="flex items-baseline gap-3">
					<label htmlFor="afterDate" className="w-20">
						After:
					</label>
					<input
						type="date"
						name="afterDate"
						id="afterDate"
						className="w-full rounded-md border p-1"
						defaultValue="2000-01-01"
					/>
				</fieldset>
				<fieldset className="flex items-baseline gap-3">
					<label htmlFor="beforeDate" className="w-20">
						Before:
					</label>
					<input
						type="date"
						name="beforeDate"
						id="beforeDate"
						className="w-full rounded-md border p-1"
						defaultValue="3000-01-01"
					/>
				</fieldset>
				<fieldset className="flex items-baseline gap-3">
					<label htmlFor="offset" className="w-20">
						offset:
					</label>
					<input
						type="number"
						name="offset"
						id="offset"
						className="w-full rounded-md border p-1"
						defaultValue={0}
					/>
				</fieldset>
				<fieldset className="flex items-baseline gap-3">
					<label htmlFor="status" className="w-20">
						Status:
					</label>
					<select
						name="status"
						id="status"
						className="w-full rounded-md border p-1"
					>
						<option value="finished">Finished</option>
						<option value="in_progress">In Progress</option>
					</select>
				</fieldset>
				<fieldset className="flex items-baseline gap-3">
					<label htmlFor="includeEditLink" className="w-20">
						Edit link:
					</label>
					<input
						type="checkbox"
						name="includeEditLink"
						id="includeEditLink"
						defaultChecked={false}
					/>
				</fieldset>
				<fieldset className="flex items-baseline gap-3">
					<label htmlFor="sort" className="w-20">
						Sort:
					</label>
					<select
						name="sort"
						id="sort"
						className="w-full rounded-md border p-1"
					>
						<option value="asc">Ascending ↗</option>
						<option value="desc">Descending ↘</option>
					</select>
				</fieldset>
				<fieldset className="flex items-baseline gap-3">
					<label htmlFor="filter" className="w-20">
						Filter:
					</label>
					<textarea
						name="filter"
						id="filter"
						className="min-h-40 w-full rounded-md border p-1"
						defaultValue={`[
	{
		"id": "fFnyxwWa3KV6nBdfBDCHEA",
		"condition": "greater_than",
		"value": 1
	}
]`}
					/>
				</fieldset>
				<button
					type="submit"
					className="rounded-md border p-3 hover:bg-slate-50 active:bg-slate-100"
				>
					Submit
				</button>
			</fetcher.Form>
			<h2 className="mt-8">Response</h2>
			<pre className="mt-8">
				{fetcher.data
					? JSON.stringify(fetcher.data, null, 2)
					: 'No data yet'}
			</pre>
		</div>
	)
}
