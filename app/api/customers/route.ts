import { NewCustomer } from '@/app/components/customer-table'
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

    const limit = 10

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
        console.error('Error retrieving customers:', error)
        return NextResponse.json(
            { error: 'Failed to retrieve customers' },
            { status: 500 }
        )
    }
}

// const TwentyCreateCustomerBodySchema = z.object({
//     name: z.string(),
//     createdBy: z.object({
//         source: z.literal("MANUAL")
//     }),
//     position: z.number(),
//     numbers: z.object({
//         additionalPhones: z.array(z.string()),
//         primaryPhoneCountryCode: z.string(),
//         primaryPhoneCallingCode: z.string(),
//         primaryPhoneNumber: z.string(),

//     }),
//     emails: z.object({
//         primaryEmail: z.string(),
//         addiionalEmails: z.array(z.string())
//     })
// })

// export type TwentyCreateCustomerBody = z.infer<typeof TwentyCreateCustomerBodySchema>

export async function POST(request: Request) {

    const query = await request.json() as unknown as NewCustomer

    console.log(query)

    const constructedBody = {
        name: query.name,
        createdBy: {
            source: "MANUAL"
        },
        position: 0,
        numbers: {
            additionalPhones: [],
            primaryPhoneCountryCode: query.phoneExtension,
            primaryPhoneCallingCode: '',
            primaryPhoneNumber: query.number
        },
        emails: {
            primaryEmail: query.email,
            additionalEmails: []
        }
    }

    try {

        // Make request to external API
        const response = await fetch(`${process.env.TWENTY_API_BASE_URL}/customers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.TWENTY_API_KEY}`
            },
            body: JSON.stringify(constructedBody)
        })

        // Check if request was successful
        if (!response.ok) {
            console.error(response.status)
            console.error(response.statusText)
            throw new Error('Failed to add new customer')
        }

        // Return successful response
        return NextResponse.json({ success: true }, { status: 200 })

    } catch (error) {
        // Handle any errors
        console.error('Error creating customer:', error)
        return NextResponse.json(
            { error: 'Failed to create customer', success: false },
            { status: 500 }
        )
    }

}

export async function DELETE(request: Request) {

    const headers = request.headers

    const customerId = headers.get('customerId')

    console.log(customerId)

    if (!customerId) {

        throw Error("CustomerID must be provided when trying to delete customer")

    }

    try {

        // Make request to external API
        const response = await fetch(`${process.env.TWENTY_API_BASE_URL}/customers/${customerId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.TWENTY_API_KEY}`
            },
        })

        // Check if request was successful
        if (!response.ok) {
            console.error(response.status)
            console.error(response.statusText)
            throw new Error('Failed to delete customer')
        }

        // Return successful response
        return NextResponse.json({ success: true }, { status: 200 })

    } catch (error) {
        // Handle any errors
        console.error('Error deleting customer:', error)
        return NextResponse.json(
            { error: 'Failed to delete customer', success: false },
            { status: 500 }
        )
    }

}
