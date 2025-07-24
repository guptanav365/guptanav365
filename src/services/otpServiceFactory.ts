import { TwilioOTPService } from './otpProviders/twilioService';
import { MessageCentralOTPService } from './otpProviders/messageCentralService';
import { OTPlessService } from './otpProviders/otplessService';
import { AuthService } from './authService'; // Mock service

export type OTPProvider = 'twilio' | 'messagecentral' | 'otpless' | 'mock';

export interface UnifiedOTPService {
  sendSMSOTP(phoneNumber: string): Promise<any>;
  sendWhatsAppOTP(phoneNumber: string): Promise<any>;
  verifyOTP(phoneNumber: string, otp: string): Promise<any>;
  resendOTP(phoneNumber: string, channel?: 'sms' | 'whatsapp'): Promise<any>;
}

export class OTPServiceFactory {
  static createService(provider: OTPProvider): UnifiedOTPService {
    switch (provider) {
      case 'twilio':
        return new TwilioOTPService({
          accountSid: process.env.REACT_APP_TWILIO_ACCOUNT_SID || '',
          authToken: process.env.REACT_APP_TWILIO_AUTH_TOKEN || '',
          verifyServiceSid: process.env.REACT_APP_TWILIO_VERIFY_SERVICE_SID || '',
          phoneNumber: process.env.REACT_APP_TWILIO_PHONE_NUMBER
        });

      case 'messagecentral':
        return new MessageCentralOTPService({
          apiKey: process.env.REACT_APP_MESSAGE_CENTRAL_API_KEY || '',
          customerId: process.env.REACT_APP_MESSAGE_CENTRAL_CUSTOMER_ID || '',
          countryCode: process.env.REACT_APP_MESSAGE_CENTRAL_COUNTRY_CODE || '91'
        });

      case 'otpless':
        return new OTPlessService({
          apiKey: process.env.REACT_APP_OTPLESS_API_KEY || '',
          clientId: process.env.REACT_APP_OTPLESS_CLIENT_ID || '',
          clientSecret: process.env.REACT_APP_OTPLESS_CLIENT_SECRET || ''
        });

      case 'mock':
      default:
        // Return a mock service adapter
        return {
          sendSMSOTP: (phoneNumber: string) => AuthService.sendOTP(phoneNumber),
          sendWhatsAppOTP: (phoneNumber: string) => AuthService.sendOTP(phoneNumber),
          verifyOTP: (phoneNumber: string, otp: string) => AuthService.verifyOTP(phoneNumber, otp),
          resendOTP: (phoneNumber: string) => AuthService.resendOTP(phoneNumber)
        };
    }
  }

  static getProviderName(provider: OTPProvider): string {
    const names = {
      twilio: 'Twilio Verify',
      messagecentral: 'Message Central',
      otpless: 'OTPless',
      mock: 'Mock Service (Demo)'
    };
    return names[provider] || 'Unknown Provider';
  }

  static getProviderFeatures(provider: OTPProvider) {
    const features = {
      twilio: {
        sms: true,
        whatsapp: true,
        voice: true,
        cost: '$$',
        reliability: 'Excellent',
        globalCoverage: true,
        description: 'Industry-leading platform with 99.95% uptime'
      },
      messagecentral: {
        sms: true,
        whatsapp: true,
        voice: false,
        cost: '$',
        reliability: 'Very Good',
        globalCoverage: true,
        description: 'Cost-effective with good delivery rates'
      },
      otpless: {
        sms: true,
        whatsapp: true,
        voice: false,
        cost: '$',
        reliability: 'Good',
        globalCoverage: true,
        description: 'WhatsApp-focused authentication platform'
      },
      mock: {
        sms: true,
        whatsapp: true,
        voice: false,
        cost: 'Free',
        reliability: 'Demo Only',
        globalCoverage: false,
        description: 'For testing and development purposes'
      }
    };
    return features[provider];
  }
}