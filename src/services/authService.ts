// Mock authentication service
// In a real application, these would be API calls to your backend

export class AuthService {
  private static otpStorage = new Map<string, string>();

  static async sendOTP(phoneNumber: string): Promise<{ success: boolean; message: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP in memory (in real app, this would be handled by backend)
    this.otpStorage.set(phoneNumber, otp);

    // For demo purposes, log the OTP to console
    console.log(`🔐 OTP for ${phoneNumber}: ${otp}`);

    // Simulate potential failure (5% chance)
    if (Math.random() < 0.05) {
      throw new Error('Failed to send OTP. Please try again.');
    }

    return {
      success: true,
      message: 'OTP sent successfully to your phone number',
    };
  }

  static async verifyOTP(phoneNumber: string, otp: string): Promise<{ success: boolean; message: string; user?: any }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const storedOTP = this.otpStorage.get(phoneNumber);

    if (!storedOTP) {
      throw new Error('No OTP found for this phone number. Please request a new one.');
    }

    if (storedOTP !== otp) {
      throw new Error('Invalid OTP. Please check and try again.');
    }

    // Clear the OTP after successful verification
    this.otpStorage.delete(phoneNumber);

    // Return mock user data
    const user = {
      id: Date.now().toString(),
      phoneNumber,
      isVerified: true,
      createdAt: new Date(),
    };

    return {
      success: true,
      message: 'Phone number verified successfully!',
      user,
    };
  }

  static async resendOTP(phoneNumber: string): Promise<{ success: boolean; message: string }> {
    // Clear existing OTP
    this.otpStorage.delete(phoneNumber);
    
    // Send new OTP
    return this.sendOTP(phoneNumber);
  }
}