import { NextResponse } from 'next/server'
import { z } from "zod"

const TwentyPeopleResponseSchema = z.object({
    data: z.object({
        people: z.array(
            z.object({
                id: z.string(),
                name: z.object({
                    firstName: z.string(),
                    lastName: z.string()
                }),
                phones: z.object({
                    primaryPhoneNumber: z.string().nullish(),
                    primaryPhoneCountryCode: z.string().nullish()
                }),
                emails: z.object({
                    primaryEmail: z.string().nullish()
                })
            })
        )
    })
})

export type TwentyPeopleResponse = z.infer<typeof TwentyPeopleResponseSchema>

export async function POST(request: Request) {
    try {
        // Get the request body
        const body = await request.json()

        // Make request to external API
        const response = await fetch(`${process.env.TWENTY_API_BASE_URL}/people`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.TWENTY_API_KEY}`
            },
            body: JSON.stringify(body)
        })

        // Check if request was successful
        if (!response.ok) {
            throw new Error('Failed to retrieve all customers')
        }

        // Get the response data
        const data = await response.json()

        const parsedData: TwentyPeopleResponse = await TwentyPeopleResponseSchema.parse(data)

        // Return successful response
        return NextResponse.json(parsedData, { status: 201 })

    } catch (error) {
        // Handle any errors
        console.error('Error creating customer:', error)
        return NextResponse.json(
            { error: 'Failed to create customer' },
            { status: 500 }
        )
    }
}
