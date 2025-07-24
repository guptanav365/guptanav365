import axios from 'axios';

export interface OTPlessConfig {
  apiKey: string;
  clientId: string;
  clientSecret: string;
}

export interface OTPResponse {
  success: boolean;
  message: string;
  requestId?: string;
  error?: string;
}

export interface OTPVerifyResponse {
  success: boolean;
  message: string;
  user?: any;
  error?: string;
}

export class OTPlessService {
  private config: OTPlessConfig;
  private apiBase: string = 'https://auth.otpless.app/auth/otp/v1';

  constructor(config: OTPlessConfig) {
    this.config = config;
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'clientId': this.config.clientId,
      'clientSecret': this.config.clientSecret
    };
  }

  async sendSMSOTP(phoneNumber: string): Promise<OTPResponse> {
    try {
      console.log(`📱 Sending SMS OTP to ${phoneNumber} via OTPless`);
      
      const payload = {
        phoneNumber: phoneNumber,
        otpLength: 6,
        channel: 'SMS',
        expiry: 300
      };

      const response = await axios.post(
        `${this.apiBase}/send`,
        payload,
        { headers: this.getHeaders() }
      );

      if (response.data.success) {
        return {
          success: true,
          message: 'SMS OTP sent successfully',
          requestId: response.data.requestId
        };
      }

      return {
        success: false,
        message: 'Failed to send SMS OTP',
        error: response.data.message || 'Unknown error'
      };
    } catch (error: any) {
      console.error('OTPless SMS OTP Error:', error.response?.data || error.message);
      return {
        success: false,
        message: 'Failed to send SMS OTP',
        error: error.response?.data?.message || error.message
      };
    }
  }

  async sendWhatsAppOTP(phoneNumber: string): Promise<OTPResponse> {
    try {
      console.log(`💬 Sending WhatsApp OTP to ${phoneNumber} via OTPless`);
      
      const payload = {
        phoneNumber: phoneNumber,
        otpLength: 6,
        channel: 'WHATSAPP',
        expiry: 300
      };

      const response = await axios.post(
        `${this.apiBase}/send`,
        payload,
        { headers: this.getHeaders() }
      );

      if (response.data.success) {
        return {
          success: true,
          message: 'WhatsApp OTP sent successfully',
          requestId: response.data.requestId
        };
      }

      return {
        success: false,
        message: 'Failed to send WhatsApp OTP',
        error: response.data.message || 'Unknown error'
      };
    } catch (error: any) {
      console.error('OTPless WhatsApp OTP Error:', error.response?.data || error.message);
      return {
        success: false,
        message: 'Failed to send WhatsApp OTP',
        error: error.response?.data?.message || error.message
      };
    }
  }

  async verifyOTP(phoneNumber: string, otp: string): Promise<OTPVerifyResponse> {
    try {
      console.log(`🔐 Verifying OTP for ${phoneNumber} via OTPless`);
      
      const payload = {
        phoneNumber: phoneNumber,
        otp: otp
      };

      const response = await axios.post(
        `${this.apiBase}/verify`,
        payload,
        { headers: this.getHeaders() }
      );

      if (response.data.isOTPVerified) {
        return {
          success: true,
          message: 'Phone number verified successfully!',
          user: {
            id: Date.now().toString(),
            phoneNumber,
            isVerified: true,
            createdAt: new Date(),
            verificationMethod: 'otpless'
          }
        };
      }

      return {
        success: false,
        message: 'Invalid OTP. Please check and try again.',
        error: 'Invalid verification code'
      };
    } catch (error: any) {
      console.error('OTPless Verify OTP Error:', error.response?.data || error.message);
      return {
        success: false,
        message: 'Verification failed',
        error: error.response?.data?.message || error.message
      };
    }
  }

  async resendOTP(phoneNumber: string, channel: 'sms' | 'whatsapp' = 'whatsapp'): Promise<OTPResponse> {
    return channel === 'whatsapp' 
      ? this.sendWhatsAppOTP(phoneNumber)
      : this.sendSMSOTP(phoneNumber);
  }
}