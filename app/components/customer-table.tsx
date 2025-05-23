"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, Plus } from "lucide-react"

import { Button } from "@/app/components/ui/button"
import { Checkbox } from "@/app/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu"
import { Input } from "@/app/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table"
import { z } from "zod"
import { Skeleton } from "./ui/skeleton"

export const NewCustomerSchema = z.object({
  name: z.string(),
  email: z.string(),
  number: z.string(),
  phoneExtension: z.string(),
})

export type NewCustomer = z.infer<typeof NewCustomerSchema>

export const CustomerSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  number: z.string(),
})

export type Customer = z.infer<typeof CustomerSchema>

export const CustomerResponseSchema = z.object({
  customers: z.array(CustomerSchema),
  ending_cursor: z.string().nullable(),
  has_next_page: z.boolean()
})

export type CustomerResponse = z.infer<typeof CustomerResponseSchema>

export const CustomerCreationResponseSchema = z.object({
  success: z.boolean()
})

export type CustomerCreationResponse = z.infer<typeof CustomerCreationResponseSchema>

export const CustomerDeletionResponseSchema = z.object({
  success: z.boolean()
})

export type CustomerDeletionResponse = z.infer<typeof CustomerDeletionResponseSchema>



interface CustomerDataTableProps {
  currentPageNumber: number
  setPageNumber: (pageNumber: number) => void
  customers: Customer[]
  hasNextPage: boolean
  getNextCustomers: () => void
  deleteCustomer: (customerId: string) => void
  openAddCustomerModal: (closed: boolean) => void
  externalLoading?: boolean
}

export function CustomerDataTable({ externalLoading, openAddCustomerModal, currentPageNumber, setPageNumber, customers, hasNextPage, getNextCustomers, deleteCustomer }: CustomerDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [loading, setLoading] = React.useState(externalLoading)

  // DEBUG LOGS
  // console.log(`Customers in table: ${customers}`)
  // console.log(`Number of customers: ${customers.length}`)
  // console.log(`Has next page: ${hasNextPage}`)
  // console.log(`Current page number: ${currentPageNumber}`)
  // console.log(`Making request: ${makingRequest}`)

  const columns: ColumnDef<Customer>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
    },
    {
      accessorKey: "number",
      header: () => <div className="text-right">Phone Number</div>,
      cell: ({ row }) => {
        return <div className="text-right font-medium">{row.getValue("number")}</div>
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const customer = row.original

        return (
          <DropdownMenu >
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(customer.id)}
              >
                Copy customer ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(customer.email)}
              >
                Copy customer email
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(customer.number)}
              >
                Copy customer number
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => deleteCustomer(customer.id)}
              >
                Delete Customer
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data: customers,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    initialState: {
      pagination: {
        pageSize: 10,
        pageIndex: currentPageNumber - 1, // Convert 1-based to 0-based index
      },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageSize: 10,
        pageIndex: currentPageNumber - 1, // Keep in sync with current page
      },
    },
  })

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center py-4 space-x-10"> {/* Controls */}
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Button variant="outline"
          onClick={() => {
            openAddCustomerModal(true)
          }
          }
        >
          <Plus className="-ms-1 me-2 opacity-60" size={16} strokeWidth={2} aria-hidden="true" />
          Add
          <kbd className="-me-1 ms-3 inline-flex h-5 max-h-full items-center rounded border border-border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
            ⌘ +
          </kbd>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border flex-1 overflow-auto"> {/* Table container */}
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : loading ? (
              <>
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center p-2"
                  >
                    <Skeleton className="max-w h-full" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center p-2"
                  >
                    <Skeleton className="max-w h-full" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center p-2"
                  >
                    <Skeleton className="max-w h-full" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center p-2"
                  >
                    <Skeleton className="max-w h-full" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center p-2"
                  >
                    <Skeleton className="max-w h-full" />
                  </TableCell>
                </TableRow>
              </>
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center p-2"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4"> {/* Pagination */}
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-4">
          <span>
            Page {currentPageNumber} of {table.getPageCount()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              table.previousPage()
              setPageNumber(currentPageNumber - 1)
            }}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              // if we can't go to the next page and there is a next page, fetch the next customers
              if (!table.getCanNextPage() && hasNextPage) {
                await getNextCustomers()
                setPageNumber(currentPageNumber + 1)
                setLoading(true)
              }
              else {
                table.nextPage()
                setPageNumber(currentPageNumber + 1)
              }
            }}
            disabled={!table.getCanNextPage() && !hasNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    </div >
  )
}
export default { CustomerDataTable };
