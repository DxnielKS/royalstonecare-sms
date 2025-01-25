import { NextResponse } from 'next/server'
import { z } from "zod"

// const TwentyBatchPushPeopleResponseSchema = z.object({

// })

export const TwentyPeopleResponseSchema = z.object({
    data: z.object({
        customers: z.array(
            z.object({
                id: z.string(),
                name: z.string(),
                phones: z.object({
                    primaryPhoneNumber: z.string().nullish(),
                    primaryPhoneCountryCode: z.string().nullish()
                }).nullish(),
                emails: z.object({
                    primaryEmail: z.string().nullish()
                })
            })
        )
    }),
    pageInfo: z.object({
        nextCursor: z.string().nullish()
    })
})

export type TwentyPeopleResponse = z.infer<typeof TwentyPeopleResponseSchema>

export async function GET() {

    const limit = 10

    try {

        // Make request to external API
        const response = await fetch(`${process.env.TWENTY_API_BASE_URL}/customers?limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.TWENTY_API_KEY}`
            },
        })

        // Check if request was successful
        if (!response.ok) {
            throw new Error('Failed to retrieve all customers')
        }

        // Get the response data
        const data = await response.json()

        const parsedData: TwentyPeopleResponse = TwentyPeopleResponseSchema.parse(data)

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


// export async function POST(request: Request) {

//     const body = await request.json()

//     const response = await fetch(`${process.env.TWENTY_API_BASE_URL}/batch/customers`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${process.env.TWENTY_API_KEY}`
//         },
//         body: body
//     })

// }
