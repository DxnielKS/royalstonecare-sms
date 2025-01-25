"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/app/components/ui/sidebar";
import { LayoutDashboard, UserCog, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/app/lib/utils";
import { Plus, Users, User } from "lucide-react";
import { CustomerDataTable } from "./components/customer-table";

const USER_SETTINGS_AND_ACCOUNTS_DISABLED = true

export default function Home() {

  const links = [
    {
      label: "Dashboard",
      href: "#",
      icon: (
        <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Profile",
      href: "#",
      icon: (
        <UserCog className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Settings",
      href: "#",
      icon: (
        <Settings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <LogOut className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} className={USER_SETTINGS_AND_ACCOUNTS_DISABLED && link.label !== 'Dashboard' ? 'cursor-not-allowed opacity-10' : ''} />
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

export const Logo = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <img src="favicon.jpg" alt="logos" width={30} />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        Royal Stone Care
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
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
  const [newMessageModalShowing, setNewMessageCustomersModalShowing] = useState(false);

  return (
    <div className="flex flex-1">
      <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
        <div className="flex flex-col gap-2 justify-center items-center">
          <CustomerDataTable />
          <div className="flex items-center justify-center space-x-4">
            <PrimaryButton label={'Add Customer(s)'} onClick={() => { }} logo={<Users />} />
            <PrimaryButton label={'New Message'} onClick={() => { setNewMessageCustomersModalShowing(true) }} logo={<Plus />} />
          </div>
        </div>
      </div>
    </div>
  );

}

interface PrimaryButtonProps {
  label: string
  onClick: () => void
  href?: string
  logo?: React.ReactNode;
}

const PrimaryButton = ({ label, onClick, logo, href }: PrimaryButtonProps) => {
  return (
    <div className="font-bold outline-none bg-blue-500 border border-black rounded-full hover:shadow-none shadow-[-3px_3px_0_0] hover:translate-y-2 hover:-translate-x-2 duration-300">
      <button onClick={onClick}>
        <a href={href}>
          <div className="flex gap-x-4 items-center justify-center p-4">
            {logo}
            <span>{label}</span>
          </div>
        </a>
      </button>
    </div>
  )
}