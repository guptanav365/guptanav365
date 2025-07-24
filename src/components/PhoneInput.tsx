import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown, Phone, MessageSquare, Smartphone } from 'lucide-react';
import { parsePhoneNumber, CountryCode, getCountries } from 'libphonenumber-js';
import { phoneSchema, PhoneFormData } from '../schemas/auth';

interface PhoneInputProps {
  onSubmit: (data: { phoneNumber: string; channel: 'sms' | 'whatsapp' }) => void;
  isLoading: boolean;
}

const PhoneInput: React.FC<PhoneInputProps> = ({ onSubmit, isLoading }) => {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>('US');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<'sms' | 'whatsapp'>('sms');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid }
  } = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
    mode: 'onChange'
  });

  const phoneValue = watch('phoneNumber');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.country-dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (phoneValue) {
      try {
        const parsed = parsePhoneNumber(phoneValue);
        if (parsed && parsed.country && parsed.country !== selectedCountry) {
          setSelectedCountry(parsed.country);
        }
      } catch (error) {
        // Ignore parsing errors
      }
    }
  }, [phoneValue, selectedCountry]);

  const getCountryFlag = (country: CountryCode) => {
    const flagMap: Record<string, string> = {
      'US': '🇺🇸', 'GB': '🇬🇧', 'IN': '🇮🇳', 'CA': '🇨🇦', 'AU': '🇦🇺',
      'DE': '🇩🇪', 'FR': '🇫🇷', 'IT': '🇮🇹', 'ES': '🇪🇸', 'BR': '🇧🇷',
      'MX': '🇲🇽', 'JP': '🇯🇵', 'KR': '🇰🇷', 'CN': '🇨🇳', 'RU': '🇷🇺',
      'SA': '🇸🇦', 'AE': '🇦🇪', 'SG': '🇸🇬', 'MY': '🇲🇾', 'TH': '🇹🇭'
    };
    return flagMap[country] || '🌍';
  };

  const getCountryName = (country: CountryCode) => {
    const names: Record<string, string> = {
      'US': 'United States', 'GB': 'United Kingdom', 'IN': 'India',
      'CA': 'Canada', 'AU': 'Australia', 'DE': 'Germany', 'FR': 'France',
      'IT': 'Italy', 'ES': 'Spain', 'BR': 'Brazil', 'MX': 'Mexico',
      'JP': 'Japan', 'KR': 'South Korea', 'CN': 'China', 'RU': 'Russia',
      'SA': 'Saudi Arabia', 'AE': 'United Arab Emirates', 'SG': 'Singapore',
      'MY': 'Malaysia', 'TH': 'Thailand'
    };
    return names[country] || country;
  };

  const popularCountries: CountryCode[] = ['US', 'GB', 'IN', 'CA', 'AU', 'DE', 'FR', 'IT', 'ES', 'BR'];
  const allCountries = getCountries().filter(country => !popularCountries.includes(country));

  const handleCountrySelect = (country: CountryCode) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
    
    try {
      const currentValue = phoneValue || '';
      const parsed = parsePhoneNumber(currentValue);
      if (parsed) {
        setValue('phoneNumber', parsed.nationalNumber);
      }
    } catch (error) {
      // Keep current value if parsing fails
    }
  };

  const onFormSubmit = (data: PhoneFormData) => {
    onSubmit({
      phoneNumber: data.phoneNumber,
      channel: selectedChannel
    });
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <div className="p-3 bg-primary-100 rounded-full">
            <Phone className="w-6 h-6 text-primary-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Verify Your Phone</h2>
        <p className="text-gray-600">
          Enter your phone number to receive a verification code
        </p>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          
          <div className="flex">
            <div className="country-dropdown relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center px-3 py-3 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <span className="text-lg mr-2">{getCountryFlag(selectedCountry)}</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 z-50 w-80 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  <div className="p-2">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Popular Countries
                    </div>
                    {popularCountries.map((country) => (
                      <button
                        key={country}
                        type="button"
                        onClick={() => handleCountrySelect(country)}
                        className="w-full flex items-center px-3 py-2 text-left hover:bg-gray-100 rounded"
                      >
                        <span className="text-lg mr-3">{getCountryFlag(country)}</span>
                        <span className="text-sm">{getCountryName(country)}</span>
                      </button>
                    ))}
                    
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-4 mb-2">
                      All Countries
                    </div>
                    {allCountries.map((country) => (
                      <button
                        key={country}
                        type="button"
                        onClick={() => handleCountrySelect(country)}
                        className="w-full flex items-center px-3 py-2 text-left hover:bg-gray-100 rounded"
                      >
                        <span className="text-lg mr-3">{getCountryFlag(country)}</span>
                        <span className="text-sm">{getCountryName(country)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <input
              {...register('phoneNumber')}
              type="tel"
              placeholder="Enter phone number"
              className="flex-1 input-field rounded-l-none"
            />
          </div>
          
          {errors.phoneNumber && (
            <p className="text-sm text-red-600">{errors.phoneNumber.message}</p>
          )}
        </div>

        {/* OTP Channel Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Delivery Method
          </label>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSelectedChannel('sms')}
              className={`flex items-center justify-center p-3 border-2 rounded-lg transition-colors ${
                selectedChannel === 'sms'
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
              }`}
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              SMS
            </button>
            
            <button
              type="button"
              onClick={() => setSelectedChannel('whatsapp')}
              className={`flex items-center justify-center p-3 border-2 rounded-lg transition-colors ${
                selectedChannel === 'whatsapp'
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
              }`}
            >
              <Smartphone className="w-5 h-5 mr-2" />
              WhatsApp
            </button>
          </div>
          
          <p className="text-xs text-gray-500">
            {selectedChannel === 'sms' 
              ? 'A verification code will be sent via SMS' 
              : 'A verification code will be sent via WhatsApp'
            }
          </p>
        </div>

        <button
          type="submit"
          disabled={!isValid || isLoading}
          className="w-full btn-primary flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Sending...
            </>
          ) : (
            <>
              Send {selectedChannel === 'sms' ? 'SMS' : 'WhatsApp'} Code
            </>
          )}
        </button>
      </form>

      <div className="text-center">
        <p className="text-xs text-gray-500">
          By continuing, you agree to receive verification codes
        </p>
      </div>
    </div>
  );
};

export default PhoneInput;