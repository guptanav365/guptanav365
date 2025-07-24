import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { parsePhoneNumber, getCountries, getCountryCallingCode, CountryCode } from 'libphonenumber-js';
import { Phone, ChevronDown } from 'lucide-react';
import { phoneSchema, PhoneFormData } from '../schemas/auth';

interface PhoneInputProps {
  onSubmit: (phoneNumber: string) => void;
  isLoading?: boolean;
}

const popularCountries: CountryCode[] = ['US', 'GB', 'IN', 'CA', 'AU', 'DE', 'FR', 'IT', 'ES', 'BR'];

const PhoneInput: React.FC<PhoneInputProps> = ({ onSubmit, isLoading = false }) => {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>('US');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
  });

  const phoneNumber = watch('phoneNumber');

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDropdownOpen && event.target instanceof Element) {
        const dropdown = event.target.closest('.country-dropdown');
        if (!dropdown) {
          setIsDropdownOpen(false);
          setSearchTerm('');
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  // Auto-detect country from phone number
  useEffect(() => {
    if (phoneNumber && phoneNumber.length > 3) {
      try {
        const parsed = parsePhoneNumber(phoneNumber);
        if (parsed?.country && parsed.country !== selectedCountry) {
          setSelectedCountry(parsed.country);
        }
      } catch {
        // Ignore parsing errors
      }
    }
  }, [phoneNumber, selectedCountry]);

  const allCountries = getCountries();
  const filteredCountries = allCountries.filter(country => {
    const countryName = new Intl.DisplayNames(['en'], { type: 'region' }).of(country);
    return countryName?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Show popular countries first, then others
  const sortedCountries = [
    ...popularCountries.filter(country => filteredCountries.includes(country)),
    ...filteredCountries.filter(country => !popularCountries.includes(country))
  ];

  const handleCountrySelect = (country: CountryCode) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
    setSearchTerm('');
    
    // Auto-fill country code if phone number is empty
    if (!phoneNumber) {
      const callingCode = getCountryCallingCode(country);
      setValue('phoneNumber', `+${callingCode}`);
    }
  };

  const onFormSubmit = (data: PhoneFormData) => {
    try {
      const parsed = parsePhoneNumber(data.phoneNumber);
      const formattedNumber = parsed.formatInternational();
      onSubmit(formattedNumber);
    } catch {
      onSubmit(data.phoneNumber);
    }
  };

  const getCountryName = (country: CountryCode) => {
    return new Intl.DisplayNames(['en'], { type: 'region' }).of(country) || country;
  };

  const getCountryFlag = (country: CountryCode) => {
    // Simple flag mapping - in production, you'd use a flag library
    const flagMap: Record<string, string> = {
      'US': '🇺🇸', 'GB': '🇬🇧', 'IN': '🇮🇳', 'CA': '🇨🇦', 'AU': '🇦🇺',
      'DE': '🇩🇪', 'FR': '🇫🇷', 'IT': '🇮🇹', 'ES': '🇪🇸', 'BR': '🇧🇷'
    };
    return flagMap[country] || '🌍';
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          
          <div className="relative">
            {/* Country Selector */}
            <div className="absolute inset-y-0 left-0 flex items-center">
              <div className="relative country-dropdown">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 px-3 py-3 border-r border-gray-300 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-l-lg transition-colors duration-200"
                >
                  <span className="text-lg">{getCountryFlag(selectedCountry)}</span>
                  <span className="text-sm text-gray-700">+{getCountryCallingCode(selectedCountry)}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {/* Dropdown */}
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 z-50 w-80 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
                    <div className="p-2 border-b border-gray-200">
                      <input
                        type="text"
                        placeholder="Search countries..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div className="overflow-y-auto max-h-48">
                      {sortedCountries.map((country) => (
                        <button
                          key={country}
                          type="button"
                          onClick={() => handleCountrySelect(country)}
                          className={`w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100 ${
                            selectedCountry === country ? 'bg-primary-50 text-primary-700' : ''
                          }`}
                        >
                          <span className="text-lg">{getCountryFlag(country)}</span>
                          <span className="text-sm text-gray-700">+{getCountryCallingCode(country)}</span>
                          <span className="text-sm text-gray-900 flex-1">{getCountryName(country)}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Phone Number Input */}
            <input
              {...register('phoneNumber')}
              type="tel"
              id="phoneNumber"
              placeholder="Enter your phone number"
              className={`input-field pl-24 ${errors.phoneNumber ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
              disabled={isLoading}
            />

            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <Phone className="w-5 h-5 text-gray-400" />
            </div>
          </div>

          {errors.phoneNumber && (
            <p className="mt-2 text-sm text-red-600">{errors.phoneNumber.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Sending OTP...</span>
            </div>
          ) : (
            'Send OTP'
          )}
        </button>
      </form>
    </div>
  );
};

export default PhoneInput;