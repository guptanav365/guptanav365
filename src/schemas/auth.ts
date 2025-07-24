import { z } from 'zod';
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';

export const phoneSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, 'Phone number is required')
    .refine(
      (value) => {
        try {
          const phoneNumber = parsePhoneNumber(value);
          return isValidPhoneNumber(value) && phoneNumber.isValid();
        } catch {
          return false;
        }
      },
      {
        message: 'Please enter a valid phone number',
      }
    ),
});

export const otpSchema = z.object({
  otp: z
    .string()
    .min(4, 'OTP must be at least 4 digits')
    .max(6, 'OTP must be at most 6 digits')
    .regex(/^\d+$/, 'OTP must contain only numbers'),
});

export type PhoneFormData = z.infer<typeof phoneSchema>;
export type OTPFormData = z.infer<typeof otpSchema>;