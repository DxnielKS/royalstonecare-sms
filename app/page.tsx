"use client";
import React, { useState, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/app/components/ui/sidebar";
import { LayoutDashboard, Users, Mail, UserSearch } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";
import { Customer, CustomerCreationResponse, CustomerDataTable, CustomerDeletionResponse, NewCustomer } from "./components/customer-table";
import { useCreateCustomer, useCustomers, useDeleteCustomer } from "./api/customers-api";
import { AddCustomerModal } from "./components/AddCustomerModal";
import { toast } from "sonner";
import { Toaster } from "@/app/components/ui/toast";


const USER_SETTINGS_AND_ACCOUNTS_DISABLED = true

export default function Home() {

  const links = [
    {
      label: "Dashboard",
      href: "#",
      icon: (
        <LayoutDashboard className="text-neutral-700 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Leads",
      href: "/#",
      icon: (
        <UserSearch className="text-neutral-700 h-5 w-5 flex-shrink-0" />
      )
    },
    {
      label: "Customers",
      href: "#",
      icon: (
        <Users className="text-neutral-700 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "SMS Campaigns",
      href: "#",
      icon: (
        <Mail className="text-neutral-700 h-5 w-5 flex-shrink-0" />
      ),
    },
    // {
    //   label: "Profile",
    //   href: "#",
    //   icon: (
    //     <UserCog className="text-neutral-700 h-5 w-5 flex-shrink-0" />
    //   ),
    // },
    // {
    //   label: "Settings",
    //   href: "#",
    //   icon: (
    //     <Settings className="text-neutral-700 h-5 w-5 flex-shrink-0" />
    //   ),
    // },
    // {
    //   label: "Logout",
    //   href: "#",
    //   icon: (
    //     <LogOut className="text-neutral-700 h-5 w-5 flex-shrink-0" />
    //   ),
    // },
  ];

  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 w-full flex-1 mx-auto border border-neutral-200 overflow-hidden",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} className={USER_SETTINGS_AND_ACCOUNTS_DISABLED && link.label !== 'Customers' ? 'cursor-not-allowed opacity-10' : ''} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "Farid",
                href: "#",
                icon: (
                  <User />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <Dashboard />
    </div>
  );
}

const Logo = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <img src="favicon.jpg" alt="logos" width={30} />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black whitespace-pre"
      >
        Royal Stone Care
      </motion.span>
    </Link>
  );
};

const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <img src="favicon.jpg" alt="logo" width={30} />
    </Link>
  );
};


const Dashboard = () => {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [currentPageNumber, setCurrentPageNumber] = useState(1)
  const [lastCursor, setLastCursor] = useState<string | null>(null)
  const [hasNextPage, setHasNextPage] = useState(true)
  const [newCustomerModalShowing, setNewCustomerCustomersModalShowing] = useState(false);
  const [requestBeingMade, setRequestBeingMade] = useState(true)

  const UpdateCustomerList = () => {
    useCustomers(lastCursor).then(async (customersResponse) => {
      setRequestBeingMade(true)
      const dedupedCustomers = customersResponse.customers.filter((customer) => {
        return !customers.some((existingCustomer) => existingCustomer.id === customer.id)
      })
      setCustomers((prevCustomers) => [...prevCustomers, ...dedupedCustomers])
      setLastCursor(customersResponse.ending_cursor)
      setHasNextPage(customersResponse.has_next_page)
      setRequestBeingMade(false)
    }).catch((error) => {
      console.error(error)
      console.error('Failed to retrieve customers!')
      setRequestBeingMade(false)
    })
  }

  const CreateNewCustomer = (customer: NewCustomer): Promise<CustomerCreationResponse> => {
    return useCreateCustomer(customer).then(async () => {
      setNewCustomerCustomersModalShowing(false);
      return { success: true };
    }).catch((error) => {
      setNewCustomerCustomersModalShowing(false);
      console.log(error);
      return { success: false };
    });
  }

  const DeleteCustomer = (customerId: string): Promise<CustomerDeletionResponse> => {
    return useDeleteCustomer(customerId).then(async () => {
      return { success: true };
    }).catch((error) => {
      console.log(error);
      return { success: false };
    });
  }

  useEffect(() => {
    UpdateCustomerList()
  }, [])


  return (
    <div className="flex flex-1">
      {/* Toaster provider at Dashboard level */}
      <Toaster />
      {newCustomerModalShowing && <AddCustomerModal onClose={setNewCustomerCustomersModalShowing} onSubmit={(customer) => {
        const completeCustomer = {
          phoneExtension: customer.phone_extension,
          number: customer.phone,
          name: customer.name,
          email: customer.email,
        };

        toast.promise(
          CreateNewCustomer(completeCustomer).then((result) => {
            if (result.success) {
              return result; // Return the result for success
            } else {
              throw new Error("Failed to add customer"); // Throw an error for failures
            }
          }),
          {
            loading: "Adding customer...",
            success: "Customer added",
            error: "Failed to add customer",
          }
        );
      }} />}
      <div className="p-8 rounded-l-2xl border border-neutral-200 bg-white flex flex-col gap-2 flex-1 w-full h-full">
        {<CustomerDataTable externalLoading={requestBeingMade} openAddCustomerModal={setNewCustomerCustomersModalShowing} currentPageNumber={currentPageNumber} setPageNumber={setCurrentPageNumber} customers={customers} hasNextPage={hasNextPage} getNextCustomers={UpdateCustomerList} deleteCustomer={
          (customerId) => {

            toast.promise(
              DeleteCustomer(customerId).then((result) => {
                if (result.success) {
                  return result;
                } else {
                  throw new Error("Failed to delete customer");
                }
              }),
              {
                loading: "Deleting customer...",
                success: "Customer deleted",
                error: "Failed to delete customer",
              }
            );
          }
        } />}
      </div>
    </div>
  );
}