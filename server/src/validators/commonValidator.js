import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
  recaptchaToken: z.string().optional(),
});

export const reviewSchema = z.object({
  packageId: z.string().optional(),
  hotelId: z.string().optional(),
  bookingId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(100).optional(),
  comment: z.string().max(1000).optional(),
});

export const newsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const packageSchema = z.object({
  title: z.string().min(2),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  location: z.string().min(2),
  duration: z.string().min(1),
  basePrice: z.number().min(0),
  category: z.string().optional(),
  group: z.number().int().min(1).optional(),
  images: z.array(z.string()).optional(),
  inclusions: z.array(z.string()).optional(),
  exclusions: z.array(z.string()).optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export const hotelSchema = z.object({
  name: z.string().min(2),
  location: z.string().min(2),
  type: z.string().optional(),
  description: z.string().optional(),
  pricePerNight: z.number().min(0),
  amenities: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});

export const destinationSchema = z.object({
  name: z.string().min(2),
  category: z.string().optional(),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});
