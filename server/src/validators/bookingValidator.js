import { z } from 'zod';

export const createBookingSchema = z.object({
  bookingType: z.enum(['package', 'hotel']),
  packageId: z.string().optional(),
  hotelId: z.string().optional(),
  traveler: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(10),
  }),
  travelDate: z.string().or(z.date()),
  adults: z.number().int().min(1),
  children: z.number().int().min(0).default(0),
  totalAmount: z.number().min(0),
  specialRequests: z.string().optional(),
  recaptchaToken: z.string().optional(),
});
