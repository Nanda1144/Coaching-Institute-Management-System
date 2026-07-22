import { z } from 'zod';

export const createBranchSchema = z.object({
  branchName: z.string().min(1, 'Branch name is required'),
  branchCode: z.string().min(1, 'Branch code is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().default('India'),
  contactPerson: z.string().min(1, 'Contact person is required'),
  contactNumber: z.string().regex(/^\d{10}$/, '10-digit phone number required'),
  email: z.string().email().optional().or(z.literal('')),
  branchHead: z.string().optional(),
  maximumCapacity: z.number().int().positive().optional(),
  openingDate: z.string().optional(),
  status: z.enum(['active', 'inactive']).default('active'),
});

export const updateBranchSchema = z.object({
  branchName: z.string().optional(),
  branchCode: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  contactPerson: z.string().optional(),
  contactNumber: z.string().regex(/^\d{10}$/, '10-digit phone number required').optional(),
  email: z.string().email().optional().or(z.literal('')),
  branchHead: z.string().optional(),
  maximumCapacity: z.number().int().positive().optional(),
  openingDate: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

export const branchQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  status: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['ASC', 'DESC']).optional(),
});
