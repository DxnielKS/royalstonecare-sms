import { CustomerResponse } from "../components/customer-table";
import { z } from "zod";

export const CustomerRequestResponseDataSchema = z.object({
    data: z.object({
        customers: z.array(z.object({
            id: z.string(),
            name: z.string(),
            numbers: z.object({
                primaryPhoneNumber: z.string(),
                primaryPhoneCountryCode: z.string(),
                primaryPhoneCallingCode: z.string()
            }).nullish(),
            emails: z.object({
                primaryEmail: z.string().nullish()
            })
        }))
    }),
    pageInfo: z.object({
        endCursor: z.string().nullish(),
        hasNextPage: z.boolean()
    })
})

export type CustomerRequestResponseData = z.infer<typeof CustomerRequestResponseDataSchema>

export const useCustomers = async (cursor: string | null): Promise<CustomerResponse> => {
    const response = await fetch(`/api/customers`, {
        method: 'GET',
        headers: {
            'starting_from': cursor ?? ''
        }
    })

    const data = await response.json()
    const parsedData = CustomerRequestResponseDataSchema.parse(data)

    return {
        customers: parsedData.data.customers.map(customer => ({
            id: customer.id,
            name: customer.name,
            email: customer.emails.primaryEmail ?? '',
            number: customer.numbers ? customer.numbers.primaryPhoneCallingCode + customer.numbers.primaryPhoneNumber : ''
        })),
        ending_cursor: parsedData.pageInfo.endCursor ?? null,
        has_next_page: parsedData.pageInfo.hasNextPage
    }
}