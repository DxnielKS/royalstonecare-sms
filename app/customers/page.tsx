"use client"
import { z } from "zod"
import { TwentyPeopleResponse } from "../api/customers/route"
import { useEffect, useState } from "react"

const CustomerSchema = z.object({
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

export const CustomersSchema = z.array(CustomerSchema)

type Customers = z.infer<typeof CustomersSchema>

const CustomersRequestResponseSchema = z.object({
    data: z.object({
        customers: z.array(CustomerSchema)
    })
})


function useCustomers() {
    const [customers, setCustomers] = useState<Customers>([])

    useEffect(() => {
        const fetchData = async () => {
            const customersResponse = await fetch('/api/customers', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },

            })

            const body = await customersResponse.json() as unknown as TwentyPeopleResponse

            const parsedData = CustomersRequestResponseSchema.parse(body)

            console.log(parsedData)

            setCustomers(parsedData.data.customers)
        }

        fetchData()
    }, [])

    return customers
}

export default function Customers() {

    const customers = useCustomers()


    return (

        <div className="space-y-2 max-h-[500px] overflow-y-auto">

            {customers.map((customer) => (
                <div key={customer.id} className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded">
                    <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-600 bg-gray-700 checked:bg-blue-600"
                    />
                    <span>{customer.name}</span>
                </div>
            ))}
        </div>

    )

}