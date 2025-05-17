import { z } from 'zod';
import { PinterestError, PinterestErrorCode } from './errors';

// Pagination types
export interface PaginationOptions {
  page?: number;
  page_size?: number;
  bookmark?: string;
  params?: Record<string, any>;
}

export interface PaginatedResponse<T> {
  items: T[];
  bookmark?: string;
  has_more: boolean;
}

// Schema definitions
export const PinSchema = z.object({
  id: z.string(),
  link: z.string().url().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  dominant_color: z.string().optional(),
  alt_text: z.string().optional(),
  board_id: z.string(),
  board_section_id: z.string().optional(),
  parent_pin_id: z.string().optional(),
  media_source: z
    .object({
      source_type: z.string(),
      url: z.string().url(),
    })
    .optional(),
});

export const BoardSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  privacy: z.enum(['PUBLIC', 'PROTECTED', 'SECRET']),
  pin_count: z.number(),
  follower_count: z.number(),
});

export const UserSchema = z.object({
  id: z.string(),
  username: z.string(),
  full_name: z.string(),
  about: z.string().optional(),
  website_url: z.string().url().optional(),
  profile_image: z.string().url().optional(),
});

// Type exports
export type Pin = z.infer<typeof PinSchema>;
export type Board = z.infer<typeof BoardSchema>;
export type User = z.infer<typeof UserSchema>;

// Configuration types
export interface PinterestConfig {
  accessToken: string;
  apiVersion?: string;
  baseURL?: string;
}

export interface CreatePinData {
  title?: string;
  description?: string;
  link?: string;
  media_source: {
    source_type: string;
    url: string;
  };
}

export interface UpdateBoardData {
  name?: string;
  description?: string;
  privacy?: 'PUBLIC' | 'PROTECTED' | 'SECRET';
}

// Validation functions
export function validateCreatePinData(
  data: any,
): asserts data is CreatePinData {
  if (!data.media_source?.url) {
    throw new PinterestError(
      'Media source URL is required',
      400,
      PinterestErrorCode.VALIDATION_ERROR,
    );
  }
}

export function validateUpdateBoardData(
  data: any,
): asserts data is UpdateBoardData {
  if (!data.name && !data.description && !data.privacy) {
    throw new PinterestError(
      'At least one field must be provided for update',
      400,
      PinterestErrorCode.VALIDATION_ERROR,
    );
  }
}
