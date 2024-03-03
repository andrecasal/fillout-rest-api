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

const responseSchema = z.object({
	responses: z.array(
		z.object({
			submissionId: z.string(),
			submissionTime: z.string(),
			lastUpdatedAt: z.string(),
			questions: z.array(
				z.object({
					id: z.string(),
					name: z.string(),
					type: z.string(),
					value: z.union([z.string(), z.number()]).nullable(),
				}),
			),
			calculations: z.array(
				z.object({
					id: z.string(),
					name: z.string(),
					type: z.string(),
					value: z.union([z.string(), z.number()]),
				}),
			),
			urlParameters: z.array(
				z.object({
					id: z.string(),
					name: z.string(),
					value: z.union([z.string(), z.number()]),
				}),
			),
			quiz: z.object({
				score: z.coerce.number().optional(),
				maxScore: z.coerce.number().optional(),
			}),
		}),
	),
	totalResponses: z.number(),
	pageCount: z.number(),
})

export async function loader({ params, request }: LoaderFunctionArgs) {
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

	// Fetch data from the API
	const response = await fetch(
		`https://api.fillout.com/v1/api/forms/${params.formId}/submissions?` +
			new URLSearchParams({ ...(query as Record<string, string>) }),
		{
			headers: {
				Authorization: `Bearer ${process.env.FILLOUT_API_KEY}`,
			},
		},
	)
	const parsedResponse = responseSchema.safeParse(await response.json())
	if (!parsedResponse.success) {
		return json(parsedResponse.error, { status: 500 })
	}
	const { data } = parsedResponse

	// Apply filters
	const filteredResponses = filter
		? data.responses.filter(response => {
				return filter.every(clause => {
					const question = response.questions.find(
						q => q.id === clause.id,
					)
					if (!question) {
						return false
					}
					switch (clause.condition) {
						case 'equals':
							return question.value === clause.value
						case 'does_not_equal':
							return question.value !== clause.value
						case 'greater_than':
							return (
								question.value !== null &&
								(question.type === 'DatePicker'
									? new Date(question.value) >
										new Date(clause.value)
									: question.value > clause.value)
							)
						case 'less_than':
							return (
								question.value !== null &&
								(question.type === 'DatePicker'
									? new Date(question.value) <
										new Date(clause.value)
									: question.value < clause.value)
							)
						default:
							return false
					}
				})
			})
		: data.responses
	data.responses = filteredResponses
	data.totalResponses = filteredResponses.length

	// Return the data
	return json({ data })
}
