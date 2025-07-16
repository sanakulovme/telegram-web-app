import React, { useEffect, useState } from 'react';
import { User, AlertTriangle, Phone, Check } from 'lucide-react';

// Telegram user type
interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}

// Contact info type
interface ContactInfo {
  contact: {
    phone_number: string;
    first_name: string;
    last_name?: string;
    user_id: number;
  };
}

function App() {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [isInTelegram, setIsInTelegram] = useState(false);
  const [isRequestingPhone, setIsRequestingPhone] = useState(false);

  useEffect(() => {
    // Check if we're in Telegram and get user data
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      
      setIsInTelegram(true);
      
      // Get user data immediately
      if (tg.initDataUnsafe?.user) {
        setUser(tg.initDataUnsafe.user);
      }
    }
  }, []);

  const requestPhoneNumber = () => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      setIsRequestingPhone(true);
      
      // Request contact information
      tg.requestContact((contactInfo: ContactInfo) => {
        setPhoneNumber(contactInfo.contact.phone_number);
        setIsRequestingPhone(false);
      });
    }
  };

  // Not in Telegram
  if (!isInTelegram) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">Not in Telegram</h1>
          <p className="text-gray-600">
            This app needs to be opened from within Telegram to access user data.
          </p>
        </div>
      </div>
    );
  }

  // In Telegram but no user data
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">No User Data</h1>
          <p className="text-gray-600">
            User information is not available.
          </p>
        </div>
      </div>
    );
  }

  // Show user data
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {user.first_name} {user.last_name}
          </h1>
          {user.username && (
            <p className="text-gray-600">@{user.username}</p>
          )}
        </div>

        <div className="space-y-3">
          <div className="bg-gray-50 p-3 rounded">
            <span className="font-medium">User ID:</span>
            <span className="ml-2 font-mono">{user.id}</span>
          </div>
          
          {user.language_code && (
            <div className="bg-gray-50 p-3 rounded">
              <span className="font-medium">Language:</span>
              <span className="ml-2">{user.language_code.toUpperCase()}</span>
            </div>
          )}
          
          {user.is_premium && (
            <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
              <span className="text-yellow-800 font-medium">⭐ Premium User</span>
            </div>
          )}

          {/* Phone Number Section */}
          <div className="bg-blue-50 p-3 rounded border border-blue-200">
            <div className="flex items-center justify-between">
              <span className="font-medium text-blue-900">Phone Number:</span>
              {phoneNumber ? (
                <div className="flex items-center text-green-700">
                  <Check className="w-4 h-4 mr-1" />
                  <span className="font-mono">{phoneNumber}</span>
                </div>
              ) : (
                <button
                  onClick={requestPhoneNumber}
                  disabled={isRequestingPhone}
                  className="flex items-center px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Phone className="w-4 h-4 mr-1" />
                  {isRequestingPhone ? 'Requesting...' : 'Request'}
                </button>
              )}
            </div>
            {!phoneNumber && (
              <p className="text-xs text-blue-700 mt-1">
                Click to request access to your phone number
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded">
          <h3 className="font-medium text-blue-900 mb-2">Raw User Data:</h3>
          <pre className="text-xs text-blue-800 overflow-x-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default App;