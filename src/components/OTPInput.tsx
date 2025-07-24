import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, RefreshCw, MessageSquare, Smartphone } from 'lucide-react';
import { otpSchema, OTPFormData } from '../schemas/auth';

interface OTPInputProps {
  phoneNumber: string;
  channel: 'sms' | 'whatsapp';
  onSubmit: (otp: string) => void;
  onResend: () => void;
  onBack: () => void;
  isLoading: boolean;
  isResending: boolean;
}

const OTPInput: React.FC<OTPInputProps> = ({
  phoneNumber,
  channel,
  onSubmit,
  onResend,
  onBack,
  isLoading,
  isResending
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    trigger
  } = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
    mode: 'onChange'
  });

  // Auto-submit when all digits are filled
  useEffect(() => {
    const otpString = otp.join('');
    if (otpString.length === 6) {
      setValue('otp', otpString);
      trigger('otp').then((isValid) => {
        if (isValid) {
          onSubmit(otpString);
        }
      });
    }
  }, [otp, setValue, trigger, onSubmit]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const digits = pastedData.replace(/\D/g, '').slice(0, 6);
    
    if (digits.length === 6) {
      const newOtp = digits.split('');
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
    }
  };

  const handleResend = () => {
    onResend();
    setCountdown(60);
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  const onFormSubmit = (data: OTPFormData) => {
    onSubmit(data.otp);
  };

  const maskPhoneNumber = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length <= 4) return phone;
    const masked = '*'.repeat(cleanPhone.length - 4) + cleanPhone.slice(-4);
    return phone.replace(cleanPhone, masked);
  };

  const getChannelIcon = () => {
    return channel === 'whatsapp' ? (
      <Smartphone className="w-5 h-5 text-green-600" />
    ) : (
      <MessageSquare className="w-5 h-5 text-blue-600" />
    );
  };

  const getChannelName = () => {
    return channel === 'whatsapp' ? 'WhatsApp' : 'SMS';
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center space-x-2">
          <div className={`p-3 rounded-full ${
            channel === 'whatsapp' ? 'bg-green-100' : 'bg-blue-100'
          }`}>
            {getChannelIcon()}
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Enter Verification Code</h2>
        <p className="text-gray-600">
          We sent a 6-digit code via <span className="font-semibold">{getChannelName()}</span> to
        </p>
        <p className="text-lg font-medium text-gray-900">
          {maskPhoneNumber(phoneNumber)}
        </p>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-center space-x-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={el => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-0 focus:outline-none transition-colors"
                disabled={isLoading}
              />
            ))}
          </div>

          {errors.otp && (
            <p className="text-center text-sm text-red-600">{errors.otp.message}</p>
          )}
        </div>

        <div className="space-y-4">
          <button
            type="submit"
            disabled={isLoading || otp.join('').length !== 6}
            className="w-full btn-primary flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Verifying...
              </>
            ) : (
              'Verify Code'
            )}
          </button>

          <div className="flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </button>

            <button
              type="button"
              onClick={handleResend}
              disabled={countdown > 0 || isResending}
              className={`flex items-center space-x-1 transition-colors ${
                countdown > 0 || isResending
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-primary-600 hover:text-primary-700'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${isResending ? 'animate-spin' : ''}`} />
              <span>
                {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
              </span>
            </button>
          </div>
        </div>
      </form>

      <div className="text-center">
        <p className="text-xs text-gray-500">
          Didn't receive the code? Check your {getChannelName()} or try resending
        </p>
      </div>
    </div>
  );
};

export default OTPInput;