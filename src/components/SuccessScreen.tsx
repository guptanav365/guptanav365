import React from 'react';
import { CheckCircle, Smartphone, User } from 'lucide-react';
import { User as UserType } from '../types/auth';

interface SuccessScreenProps {
  user: UserType;
  onContinue?: () => void;
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({ user, onContinue }) => {
  return (
    <div className="w-full max-w-md text-center">
      <div className="mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome! 🎉
        </h1>
        
        <p className="text-lg text-gray-600 mb-2">
          Your phone number has been verified successfully
        </p>
        
        <div className="inline-flex items-center space-x-2 text-green-700 bg-green-50 px-4 py-2 rounded-lg">
          <Smartphone className="w-5 h-5" />
          <span className="font-medium">{user.phoneNumber}</span>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-6 mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-primary-600" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-900">Account Created</h3>
            <p className="text-sm text-gray-600">
              ID: {user.id}
            </p>
            <p className="text-sm text-gray-600">
              Verified: {user.createdAt.toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="text-gray-500 mb-1">Status</div>
            <div className="font-semibold text-green-600">Verified ✓</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="text-gray-500 mb-1">Security</div>
            <div className="font-semibold text-blue-600">Protected 🛡️</div>
          </div>
        </div>

        {onContinue && (
          <button
            onClick={onContinue}
            className="btn-primary w-full"
          >
            Continue to Dashboard
          </button>
        )}

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Your account is now secure and ready to use
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuccessScreen;