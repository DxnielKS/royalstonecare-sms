import { NextResponse } from 'next/server'
import { z } from "zod"

const TwentyPeopleResponseSchema = z.object({
    data: z.object({
        customers: z.array(
            z.object({
                id: z.string(),
                name: z.string(),
                numbers: z.object({
                    primaryPhoneNumber: z.string().nullish(),
                    primaryPhoneCountryCode: z.string().nullish(),
                    primaryPhoneCallingCode: z.string().nullish()
                }).nullish(),
                emails: z.object({
                    primaryEmail: z.string().nullish()
                })
            })
        )
    }),
    pageInfo: z.object({
        endCursor: z.string().nullish(),
        hasNextPage: z.boolean()
    })
})

type TwentyPeopleResponse = z.infer<typeof TwentyPeopleResponseSchema>

export async function GET(request: Request) {

    const limit = 50

    const query = await request.headers

    const starting_after = query.get('starting_from') ? query.get('starting_from') : ''

    try {

        // Make request to external API
        const response = await fetch(`${process.env.TWENTY_API_BASE_URL}/customers?limit=${limit}${starting_after ? `&starting_after=${starting_after}` : ""}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.TWENTY_API_KEY}`
            },
        })

        // Check if request was successful
        if (!response.ok) {
            console.error(response.status)
            console.error(response.statusText)
            throw new Error('Failed to retrieve all customers')
        }

        // Get the response data
        const data = await response.json()

        const parsedData: TwentyPeopleResponse = TwentyPeopleResponseSchema.parse(data)

        console.log(parsedData.data.customers)

        // Return successful response
        return NextResponse.json(parsedData, { status: 200 })

    } catch (error) {
        // Handle any errors
        console.error('Error creating customer:', error)
        return NextResponse.json(
            { error: 'Failed to create customer' },
            { status: 500 }
        )
    }
}
