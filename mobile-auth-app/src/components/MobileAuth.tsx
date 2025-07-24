import React, { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Shield, Smartphone } from 'lucide-react';
import PhoneInput from './PhoneInput';
import OTPInput from './OTPInput';
import SuccessScreen from './SuccessScreen';
import { AuthService } from '../services/authService';
import { AuthStep, User } from '../types/auth';

const MobileAuth: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AuthStep>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const handlePhoneSubmit = async (phone: string) => {
    setIsLoading(true);
    try {
      const result = await AuthService.sendOTP(phone);
      if (result.success) {
        setPhoneNumber(phone);
        setCurrentStep('otp');
        toast.success(result.message);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = async (otp: string) => {
    setIsLoading(true);
    try {
      const result = await AuthService.verifyOTP(phoneNumber, otp);
      if (result.success && result.user) {
        setUser(result.user);
        setCurrentStep('success');
        toast.success(result.message);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    try {
      const result = await AuthService.resendOTP(phoneNumber);
      if (result.success) {
        toast.success('New OTP sent successfully');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to resend OTP');
    } finally {
      setIsResending(false);
    }
  };

  const handleBackToPhone = () => {
    setCurrentStep('phone');
    setPhoneNumber('');
  };

  const handleContinue = () => {
    // Reset the flow or navigate to dashboard
    setCurrentStep('phone');
    setPhoneNumber('');
    setUser(null);
    toast.success('Ready for another authentication!');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'phone':
        return (
          <PhoneInput
            onSubmit={handlePhoneSubmit}
            isLoading={isLoading}
          />
        );
      case 'otp':
        return (
          <OTPInput
            phoneNumber={phoneNumber}
            onSubmit={handleOTPSubmit}
            onResend={handleResendOTP}
            onBack={handleBackToPhone}
            isLoading={isLoading}
            isResending={isResending}
          />
        );
      case 'success':
        return user ? (
          <SuccessScreen
            user={user}
            onContinue={handleContinue}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-primary-50 flex items-center justify-center p-4">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#ffffff',
            color: '#374151',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            fontSize: '14px',
            maxWidth: '500px',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />
      
      <div className="w-full max-w-lg">
        {/* Header */}
        {currentStep === 'phone' && (
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full mb-6">
              <Shield className="w-10 h-10 text-primary-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Secure Login
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              Enter your phone number to get started
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <Smartphone className="w-4 h-4" />
              <span>SMS verification • Fast & secure</span>
            </div>
          </div>
        )}

        {/* Authentication Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {renderCurrentStep()}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Protected by enterprise-grade security
          </p>
          <div className="flex items-center justify-center space-x-4 mt-4 text-xs text-gray-400">
            <span>🔒 End-to-end encrypted</span>
            <span>•</span>
            <span>⚡ Instant verification</span>
            <span>•</span>
            <span>🛡️ GDPR compliant</span>
          </div>
        </div>

        {/* Demo Instructions */}
        {currentStep === 'phone' && (
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="text-sm font-semibold text-yellow-800 mb-2">
              📱 Demo Instructions
            </h3>
            <p className="text-sm text-yellow-700">
              1. Enter any valid phone number format (e.g., +1 555 123 4567)
              <br />
              2. The OTP will be logged to the browser console for testing
              <br />
              3. Check the console (F12) to see your verification code
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileAuth;
