import axios from 'axios';

export interface TwilioConfig {
  accountSid: string;
  authToken: string;
  verifyServiceSid: string;
  phoneNumber?: string;
}

export interface OTPResponse {
  success: boolean;
  message: string;
  verificationSid?: string;
  error?: string;
}

export interface OTPVerifyResponse {
  success: boolean;
  message: string;
  user?: any;
  error?: string;
}

export class TwilioOTPService {
  private config: TwilioConfig;
  private apiBase: string;

  constructor(config: TwilioConfig) {
    this.config = config;
    this.apiBase = `https://verify.twilio.com/v2/Services/${config.verifyServiceSid}`;
  }

  private getAuthHeader(): string {
    const credentials = Buffer.from(`${this.config.accountSid}:${this.config.authToken}`).toString('base64');
    return `Basic ${credentials}`;
  }

  async sendSMSOTP(phoneNumber: string): Promise<OTPResponse> {
    try {
      console.log(`📱 Sending SMS OTP to ${phoneNumber} via Twilio`);
      
      const response = await axios.post(
        `${this.apiBase}/Verifications`,
        new URLSearchParams({
          To: phoneNumber,
          Channel: 'sms'
        }),
        {
          headers: {
            'Authorization': this.getAuthHeader(),
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      if (response.data.status === 'pending') {
        return {
          success: true,
          message: 'SMS OTP sent successfully',
          verificationSid: response.data.sid
        };
      }

      return {
        success: false,
        message: 'Failed to send SMS OTP',
        error: response.data.error_message || 'Unknown error'
      };
    } catch (error: any) {
      console.error('Twilio SMS OTP Error:', error.response?.data || error.message);
      return {
        success: false,
        message: 'Failed to send SMS OTP',
        error: error.response?.data?.message || error.message
      };
    }
  }

  async sendWhatsAppOTP(phoneNumber: string): Promise<OTPResponse> {
    try {
      console.log(`💬 Sending WhatsApp OTP to ${phoneNumber} via Twilio`);
      
      const response = await axios.post(
        `${this.apiBase}/Verifications`,
        new URLSearchParams({
          To: phoneNumber,
          Channel: 'whatsapp'
        }),
        {
          headers: {
            'Authorization': this.getAuthHeader(),
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      if (response.data.status === 'pending') {
        return {
          success: true,
          message: 'WhatsApp OTP sent successfully',
          verificationSid: response.data.sid
        };
      }

      return {
        success: false,
        message: 'Failed to send WhatsApp OTP',
        error: response.data.error_message || 'Unknown error'
      };
    } catch (error: any) {
      console.error('Twilio WhatsApp OTP Error:', error.response?.data || error.message);
      return {
        success: false,
        message: 'Failed to send WhatsApp OTP',
        error: error.response?.data?.message || error.message
      };
    }
  }

  async verifyOTP(phoneNumber: string, otp: string): Promise<OTPVerifyResponse> {
    try {
      console.log(`🔐 Verifying OTP for ${phoneNumber} via Twilio`);
      
      const response = await axios.post(
        `${this.apiBase}/VerificationCheck`,
        new URLSearchParams({
          To: phoneNumber,
          Code: otp
        }),
        {
          headers: {
            'Authorization': this.getAuthHeader(),
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      if (response.data.status === 'approved') {
        return {
          success: true,
          message: 'Phone number verified successfully!',
          user: {
            id: Date.now().toString(),
            phoneNumber,
            isVerified: true,
            createdAt: new Date(),
            verificationMethod: 'twilio'
          }
        };
      }

      return {
        success: false,
        message: 'Invalid OTP. Please check and try again.',
        error: 'Invalid verification code'
      };
    } catch (error: any) {
      console.error('Twilio Verify OTP Error:', error.response?.data || error.message);
      return {
        success: false,
        message: 'Verification failed',
        error: error.response?.data?.message || error.message
      };
    }
  }

  async resendOTP(phoneNumber: string, channel: 'sms' | 'whatsapp' = 'sms'): Promise<OTPResponse> {
    // Twilio automatically handles resend through the same verification endpoint
    return channel === 'whatsapp' 
      ? this.sendWhatsAppOTP(phoneNumber)
      : this.sendSMSOTP(phoneNumber);
  }
}