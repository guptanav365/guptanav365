import React, { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Shield, Smartphone, Settings, Info } from 'lucide-react';
import PhoneInput from './PhoneInput';
import OTPInput from './OTPInput';
import SuccessScreen from './SuccessScreen';
import { OTPServiceFactory, OTPProvider } from '../services/otpServiceFactory';
import { AuthStep, User } from '../types/auth';

const MobileAuth: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AuthStep>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<'sms' | 'whatsapp'>('sms');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [currentProvider, setCurrentProvider] = useState<OTPProvider>(
    (process.env.REACT_APP_OTP_SERVICE as OTPProvider) || 'mock'
  );

  // Get OTP service instance
  const otpService = OTPServiceFactory.createService(currentProvider);
  const providerInfo = OTPServiceFactory.getProviderFeatures(currentProvider);

  const handlePhoneSubmit = async (data: { phoneNumber: string; channel: 'sms' | 'whatsapp' }) => {
    setIsLoading(true);
    try {
      console.log(`🚀 Sending ${data.channel.toUpperCase()} OTP to ${data.phoneNumber}`);
      
      const result = data.channel === 'whatsapp' 
        ? await otpService.sendWhatsAppOTP(data.phoneNumber)
        : await otpService.sendSMSOTP(data.phoneNumber);

      if (result.success) {
        setPhoneNumber(data.phoneNumber);
        setSelectedChannel(data.channel);
        setCurrentStep('otp');
        toast.success(result.message);
        
        // For demo purposes with mock service
        if (currentProvider === 'mock') {
          toast.success(`🔐 Demo OTP: Check browser console for the code`, {
            duration: 8000,
            icon: '💡'
          });
        }
      } else {
        toast.error(result.message || 'Failed to send OTP');
      }
    } catch (error: any) {
      console.error('OTP Send Error:', error);
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = async (otp: string) => {
    setIsLoading(true);
    try {
      console.log(`🔐 Verifying OTP: ${otp} for ${phoneNumber}`);
      
      const result = await otpService.verifyOTP(phoneNumber, otp);

      if (result.success) {
        setUser(result.user);
        setCurrentStep('success');
        toast.success(result.message);
      } else {
        toast.error(result.message || 'Invalid OTP');
      }
    } catch (error: any) {
      console.error('OTP Verify Error:', error);
      toast.error('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    try {
      console.log(`🔄 Resending ${selectedChannel.toUpperCase()} OTP to ${phoneNumber}`);
      
      const result = await otpService.resendOTP(phoneNumber, selectedChannel);

      if (result.success) {
        toast.success(`OTP resent via ${selectedChannel.toUpperCase()}`);
        
        // For demo purposes with mock service
        if (currentProvider === 'mock') {
          toast.success(`🔐 Demo OTP: Check browser console for the new code`, {
            duration: 8000,
            icon: '💡'
          });
        }
      } else {
        toast.error(result.message || 'Failed to resend OTP');
      }
    } catch (error: any) {
      console.error('OTP Resend Error:', error);
      toast.error('Failed to resend OTP. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const handleBackToPhone = () => {
    setCurrentStep('phone');
    setPhoneNumber('');
    setSelectedChannel('sms');
  };

  const handleContinue = () => {
    toast.success('Welcome! You can now access the application.');
    // Reset for demo
    setTimeout(() => {
      setCurrentStep('phone');
      setPhoneNumber('');
      setSelectedChannel('sms');
      setUser(null);
    }, 2000);
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
            channel={selectedChannel}
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
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-primary-600 rounded-full">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Mobile Authentication</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Secure your account with SMS or WhatsApp verification. Choose your preferred method and get instant access.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Current Provider Info */}
          <div className="lg:order-1 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center space-x-3 mb-4">
                <Settings className="w-6 h-6 text-primary-600" />
                <h3 className="text-lg font-semibold text-gray-900">Current Provider</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Service:</span>
                  <span className="font-medium text-gray-900">
                    {OTPServiceFactory.getProviderName(currentProvider)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">SMS Support:</span>
                  <span className={`text-sm font-medium ${providerInfo.sms ? 'text-green-600' : 'text-red-600'}`}>
                    {providerInfo.sms ? '✓ Available' : '✗ Not Available'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">WhatsApp Support:</span>
                  <span className={`text-sm font-medium ${providerInfo.whatsapp ? 'text-green-600' : 'text-red-600'}`}>
                    {providerInfo.whatsapp ? '✓ Available' : '✗ Not Available'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Reliability:</span>
                  <span className="text-sm font-medium text-gray-900">{providerInfo.reliability}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Cost:</span>
                  <span className="text-sm font-medium text-gray-900">{providerInfo.cost}</span>
                </div>
              </div>
              
              <p className="text-xs text-gray-500 mt-4 p-3 bg-gray-50 rounded-lg">
                {providerInfo.description}
              </p>
            </div>

            {/* Provider Selection */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Switch Provider</h3>
              <div className="space-y-2">
                {(['mock', 'twilio', 'messagecentral', 'otpless'] as OTPProvider[]).map((provider) => (
                  <button
                    key={provider}
                    onClick={() => setCurrentProvider(provider)}
                    disabled={currentStep !== 'phone'}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      currentProvider === provider
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    } ${currentStep !== 'phone' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="font-medium">{OTPServiceFactory.getProviderName(provider)}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {OTPServiceFactory.getProviderFeatures(provider).description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Authentication Form */}
          <div className="lg:order-2 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              {renderCurrentStep()}
            </div>
          </div>

          {/* Features & Info */}
          <div className="lg:order-3 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center space-x-3 mb-4">
                <Info className="w-6 h-6 text-primary-600" />
                <h3 className="text-lg font-semibold text-gray-900">Authentication Features</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="p-1 bg-green-100 rounded-full mt-1">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Dual Channel Support</div>
                    <div className="text-sm text-gray-600">Choose between SMS and WhatsApp delivery</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="p-1 bg-green-100 rounded-full mt-1">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Real-time Verification</div>
                    <div className="text-sm text-gray-600">Instant OTP delivery and verification</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="p-1 bg-green-100 rounded-full mt-1">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Multiple Providers</div>
                    <div className="text-sm text-gray-600">Switch between Twilio, Message Central, and more</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="p-1 bg-green-100 rounded-full mt-1">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Global Coverage</div>
                    <div className="text-sm text-gray-600">Works in 200+ countries worldwide</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Demo Instructions */}
            <div className="bg-gradient-to-r from-blue-50 to-primary-50 rounded-xl p-6 border border-primary-200">
              <div className="flex items-center space-x-3 mb-3">
                <Smartphone className="w-6 h-6 text-primary-600" />
                <h3 className="text-lg font-semibold text-primary-900">Demo Instructions</h3>
              </div>
              
              <div className="space-y-2 text-sm text-primary-800">
                <p><strong>Mock Service:</strong> Check browser console for OTP codes</p>
                <p><strong>Real Services:</strong> Add your API credentials to environment variables</p>
                <p><strong>Test Numbers:</strong> Use any valid phone number format</p>
                <p><strong>WhatsApp:</strong> Requires provider setup for real delivery</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Powered by multiple OTP providers • Built with React & TypeScript
          </p>
        </div>
      </div>
    </div>
  );
};

export default MobileAuth;