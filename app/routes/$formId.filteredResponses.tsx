import { LoaderFunctionArgs, json } from '@remix-run/node'
import { z } from 'zod'
import zu from 'zod_utilz'

// each of these filters should be applied like an AND in a "where" clause in SQL
type FilterClauseType = {
	id: string
	condition: 'equals' | 'does_not_equal' | 'greater_than' | 'less_than'
	value: number | string
}
type ResponseFilter = FilterClauseType
type ResponseFiltersType = ResponseFilter[]

const querySchema = z.object({
	limit: z.coerce.number().gte(1).lte(150).optional(),
	afterDate: z.coerce.date().optional(),
	beforeDate: z.coerce.date().optional(),
	offset: z.coerce.number().optional(),
	status: z.enum(['in_progress', 'finished']).optional(),
	includeEditLink: z.coerce.boolean().optional(),
	sort: z.enum(['asc', 'desc']).optional(),
	filter: zu
		.stringToJSON()
		.pipe(
			z.array(
				z.object({
					id: z.string(),
					condition: z.enum([
						'equals',
						'does_not_equal',
						'greater_than',
						'less_than',
					]),
					value: z.union([z.string(), z.number()]),
				}),
			),
		)
		.optional(),
})

export async function loader({ request }: LoaderFunctionArgs) {
	// Avoid API call if the query params are invalid
	const url = new URL(request.url)
	const searchParams = Object.fromEntries(
		new URLSearchParams(url.searchParams),
	)
	const result = querySchema.safeParse(searchParams)
	if (!result.success) {
		return json(result.error, { status: 400 })
	}

	const { filter, ...query } = result.data as {
		limit?: number
		afterDate?: Date
		beforeDate?: Date
		offset?: number
		status?: 'in_progress' | 'finished'
		includeEditLink?: boolean
		sort?: 'asc' | 'desc'
		filter?: ResponseFiltersType
	}

	// Return the data
	return json({ filter, query })
}
