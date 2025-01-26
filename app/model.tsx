"use client";

import { useState } from "react";

interface Customer {
  id: string;
  name: string;
  email: string;
  numbers: string[];
}



export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all customers
  const fetchCustomers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/customers', {
        method: 'GET',
        
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch customers');
      }
      
      const data = await response.json();

      

      setCustomers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Get a single customer by ID
  const getCustomerById = async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/customers/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch customer');
      }
      
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    customers,
    isLoading,
    error,
    fetchCustomers,
    getCustomerById
  };
};
