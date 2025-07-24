import axios from 'axios';

export interface MessageCentralConfig {
  apiKey: string;
  customerId: string;
  countryCode: string;
}

export interface OTPResponse {
  success: boolean;
  message: string;
  verificationId?: string;
  error?: string;
}

export interface OTPVerifyResponse {
  success: boolean;
  message: string;
  user?: any;
  error?: string;
}

export class MessageCentralOTPService {
  private config: MessageCentralConfig;
  private apiBase: string = 'https://cpaas.messagecentral.com/verification/v3';
  private otpStorage = new Map<string, string>();

  constructor(config: MessageCentralConfig) {
    this.config = config;
  }

  private getHeaders() {
    return {
      'authkey': this.config.apiKey,
      'Content-Type': 'application/json'
    };
  }

  async sendSMSOTP(phoneNumber: string): Promise<OTPResponse> {
    try {
      console.log(`📱 Sending SMS OTP to ${phoneNumber} via Message Central`);
      
      const payload = {
        countryCode: this.config.countryCode,
        customerId: this.config.customerId,
        mobileNumber: phoneNumber.replace(/^\+/, '').replace(this.config.countryCode, ''),
        type: 'SMS'
      };

      const response = await axios.post(
        `${this.apiBase}/send`,
        payload,
        { headers: this.getHeaders() }
      );

      if (response.data.responseCode === 200) {
        return {
          success: true,
          message: 'SMS OTP sent successfully',
          verificationId: response.data.data.verificationId
        };
      }

      return {
        success: false,
        message: 'Failed to send SMS OTP',
        error: response.data.message || 'Unknown error'
      };
    } catch (error: any) {
      console.error('Message Central SMS OTP Error:', error.response?.data || error.message);
      return {
        success: false,
        message: 'Failed to send SMS OTP',
        error: error.response?.data?.message || error.message
      };
    }
  }

  async sendWhatsAppOTP(phoneNumber: string): Promise<OTPResponse> {
    try {
      console.log(`💬 Sending WhatsApp OTP to ${phoneNumber} via Message Central`);
      
      const payload = {
        countryCode: this.config.countryCode,
        customerId: this.config.customerId,
        mobileNumber: phoneNumber.replace(/^\+/, '').replace(this.config.countryCode, ''),
        type: 'WHATSAPP'
      };

      const response = await axios.post(
        `${this.apiBase}/send`,
        payload,
        { headers: this.getHeaders() }
      );

      if (response.data.responseCode === 200) {
        return {
          success: true,
          message: 'WhatsApp OTP sent successfully',
          verificationId: response.data.data.verificationId
        };
      }

      return {
        success: false,
        message: 'Failed to send WhatsApp OTP',
        error: response.data.message || 'Unknown error'
      };
    } catch (error: any) {
      console.error('Message Central WhatsApp OTP Error:', error.response?.data || error.message);
      return {
        success: false,
        message: 'Failed to send WhatsApp OTP',
        error: error.response?.data?.message || error.message
      };
    }
  }

  async verifyOTP(phoneNumber: string, otp: string): Promise<OTPVerifyResponse> {
    try {
      console.log(`🔐 Verifying OTP for ${phoneNumber} via Message Central`);
      
      const payload = {
        countryCode: this.config.countryCode,
        mobileNumber: phoneNumber.replace(/^\+/, '').replace(this.config.countryCode, ''),
        code: otp
      };

      const response = await axios.post(
        `${this.apiBase}/validateOtp`,
        payload,
        { headers: this.getHeaders() }
      );

      if (response.data.responseCode === 200 && response.data.data.verificationStatus === 'VERIFICATION_COMPLETED') {
        return {
          success: true,
          message: 'Phone number verified successfully!',
          user: {
            id: Date.now().toString(),
            phoneNumber,
            isVerified: true,
            createdAt: new Date(),
            verificationMethod: 'message-central'
          }
        };
      }

      return {
        success: false,
        message: 'Invalid OTP. Please check and try again.',
        error: 'Invalid verification code'
      };
    } catch (error: any) {
      console.error('Message Central Verify OTP Error:', error.response?.data || error.message);
      return {
        success: false,
        message: 'Verification failed',
        error: error.response?.data?.message || error.message
      };
    }
  }

  async resendOTP(phoneNumber: string, channel: 'sms' | 'whatsapp' = 'sms'): Promise<OTPResponse> {
    // Message Central handles resend through the same send endpoint
    return channel === 'whatsapp' 
      ? this.sendWhatsAppOTP(phoneNumber)
      : this.sendSMSOTP(phoneNumber);
  }
}