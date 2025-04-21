import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function stringifyPhoneNumber(phoneExtension: string, phoneNumber: string){
  return phoneExtension.concat(phoneNumber)
}