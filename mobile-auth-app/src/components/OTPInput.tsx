import React, { useState, useRef, useEffect, KeyboardEvent, ClipboardEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, RotateCcw, Smartphone } from 'lucide-react';
import { otpSchema, OTPFormData } from '../schemas/auth';

interface OTPInputProps {
  phoneNumber: string;
  onSubmit: (otp: string) => void;
  onResend: () => void;
  onBack: () => void;
  isLoading?: boolean;
  isResending?: boolean;
}

const OTPInput: React.FC<OTPInputProps> = ({
  phoneNumber,
  onSubmit,
  onResend,
  onBack,
  isLoading = false,
  isResending = false,
}) => {
  const [otp, setOTP] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
  });

  // Countdown timer for resend functionality
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleInputChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newOTP = [...otp];
    newOTP[index] = value.slice(-1); // Only take the last character
    setOTP(newOTP);
    clearErrors('otp');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (newOTP.every(digit => digit !== '') && newOTP.join('').length === 6) {
      setTimeout(() => {
        const otpString = newOTP.join('');
        handleSubmit(() => onSubmit(otpString))();
      }, 100);
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Focus previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain');
    const digits = pastedData.replace(/\D/g, '').slice(0, 6); // Only digits, max 6

    if (digits.length > 0) {
      const newOTP = [...otp];
      for (let i = 0; i < Math.min(digits.length, 6); i++) {
        newOTP[i] = digits[i];
      }
      setOTP(newOTP);
      
      // Focus the next empty input or the last one
      const nextIndex = Math.min(digits.length, 5);
      inputRefs.current[nextIndex]?.focus();

      // Auto-submit if 6 digits were pasted
      if (digits.length === 6) {
        setTimeout(() => {
          handleSubmit(() => onSubmit(digits))();
        }, 100);
      }
    }
  };

  const handleResend = () => {
    if (canResend && !isResending) {
      setCountdown(60);
      setCanResend(false);
      setOTP(['', '', '', '', '', '']);
      onResend();
    }
  };

  const onFormSubmit = () => {
    const otpString = otp.join('');
    if (otpString.length < 4) {
      setError('otp', { message: 'Please enter the complete OTP' });
      return;
    }
    onSubmit(otpString);
  };

  const formatPhoneNumber = (phone: string) => {
    // Mask the phone number for privacy (show last 4 digits)
    if (phone.length > 4) {
      return phone.slice(0, -4).replace(/\d/g, '●') + phone.slice(-4);
    }
    return phone;
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
          <Smartphone className="w-8 h-8 text-primary-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify your phone</h2>
        <p className="text-gray-600">
          We've sent a verification code to<br />
          <span className="font-semibold text-gray-900">{formatPhoneNumber(phoneNumber)}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
            Enter verification code
          </label>
          
          <div className="flex justify-center space-x-3 mb-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={`w-12 h-12 text-center text-xl font-semibold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors duration-200 ${
                  digit ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
                } ${errors.otp ? 'border-red-500' : ''}`}
                disabled={isLoading}
              />
            ))}
          </div>

          {errors.otp && (
            <p className="text-sm text-red-600 text-center">{errors.otp.message}</p>
          )}
        </div>

        <div className="space-y-4">
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Verifying...</span>
              </div>
            ) : (
              'Verify Phone Number'
            )}
          </button>

          {/* Resend OTP */}
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              Didn't receive the code?
            </p>
            <button
              type="button"
              onClick={handleResend}
              disabled={!canResend || isResending}
              className={`inline-flex items-center space-x-2 text-sm font-medium ${
                canResend && !isResending
                  ? 'text-primary-600 hover:text-primary-700'
                  : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              <RotateCcw className="w-4 h-4" />
              <span>
                {isResending
                  ? 'Sending...'
                  : canResend
                  ? 'Resend code'
                  : `Resend in ${countdown}s`}
              </span>
            </button>
          </div>

          {/* Back button */}
          <div className="text-center">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-gray-700"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Change phone number</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default OTPInput;
