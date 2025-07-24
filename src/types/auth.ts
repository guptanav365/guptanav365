export interface PhoneAuthData {
  phoneNumber: string;
  countryCode: string;
}

export interface OTPVerificationData {
  otp: string;
  phoneNumber: string;
}

export interface User {
  id: string;
  phoneNumber: string;
  isVerified: boolean;
  createdAt: Date;
}

export type AuthStep = 'phone' | 'otp' | 'success';

export interface AuthState {
  step: AuthStep;
  phoneNumber: string;
  countryCode: string;
  isLoading: boolean;
  error: string | null;
}