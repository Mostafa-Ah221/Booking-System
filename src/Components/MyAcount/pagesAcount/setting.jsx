import React, { useState } from 'react';

const SettingsPage = () => {
  const [dateFormat, setDateFormat] = useState('MMM d, yyyy HH:mm');
  const [profileVisibility, setProfileVisibility] = useState('Custom');
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [newSignInAlert, setNewSignInAlert] = useState(true);
  const [thirdPartyAlert, setThirdPartyAlert] = useState(true);
  const [newsletterSubscription, setNewsletterSubscription] = useState(true);

  const toggleDateDropdown = () => setIsDateDropdownOpen(!isDateDropdownOpen);

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="p-4 bg-white flex justify-between items-center border-b">
        <div className="flex items-center">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-2">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path>
            </svg>
          </div>
          <span className="font-medium">Accounts</span>
        </div>
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center mr-2 text-white">
            P
          </div>
          <button className="ml-2">
            <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0zm4 2a2 2 0 100-4 2 2 0 000 4z"></path>
            </svg>
          </button>
        </div>
      </div>

      <div className="p-4">
        <h1 className="text-2xl font-medium mb-4">Settings</h1>

        <div className="bg-white rounded-md shadow-sm mb-4 p-4">
          <h2 className="text-lg font-medium mb-1">Preferences</h2>
          <p className="text-gray-600 mb-4">Manage your preferences for date format, privacy settings, and email notifications.</p>

          <div className="mb-6">
            <h3 className="font-medium mb-1">Date Format</h3>
            <p className="text-gray-600 text-sm mb-2">Select the date and time format to be used for your Zoho account activity.</p>
            <div className="relative">
              <div 
                className="border rounded-md p-2 flex justify-between items-center cursor-pointer"
                onClick={toggleDateDropdown}
              >
                <span>{dateFormat}</span>
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
              </div>
              {isDateDropdownOpen && (
                <div className="absolute w-full bg-white border rounded-md mt-1 shadow-lg z-10">
                  <div className="p-2 border-b">
                    <input 
                      type="text" 
                      placeholder="Search..." 
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div className="p-2 border-b hover:bg-gray-100 cursor-pointer">
                    <div className="font-medium">Custom</div>
                  </div>
                  <div className="p-2 border-b hover:bg-gray-100 cursor-pointer">
                    <div>M/d/yy (3/19/25)</div>
                  </div>
                  <div className="p-2 border-b hover:bg-gray-100 cursor-pointer">
                    <div>MMM d, yyyy HH:mm (GMT XXX) (Mar 19, 2025 05:21 (GMT -07:00))</div>
                  </div>
                  <div className="p-2 border-b hover:bg-gray-100 cursor-pointer">
                    <div>d-M-y (19-3-2025)</div>
                  </div>
                  <div className="p-2 hover:bg-gray-100 cursor-pointer">
                    <div>d-M-yy (19-3-25)</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-medium mb-1">Profile Picture Visibility</h3>
            <p className="text-gray-600 text-sm mb-2">Select who can view your profile picture.</p>
            <div className="border rounded-md p-2 flex justify-between items-center">
              <span>{profileVisibility}</span>
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-medium mb-4">Email notifications</h3>
            
            <div className="flex justify-between items-center mb-4">
              <div>
                <h4 className="font-medium">New sign-in to account alert</h4>
                <p className="text-gray-600 text-sm">Receive email alerts whenever your account is accessed from a new device or location.</p>
              </div>
              <label className="inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={newSignInAlert} 
                  onChange={() => setNewSignInAlert(!newSignInAlert)} 
                  className="sr-only peer"
                />
                <div className={`relative w-11 h-6 rounded-full peer ${newSignInAlert ? 'bg-green-400' : 'bg-gray-200'}`}>
                  <div className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-all ${newSignInAlert ? 'translate-x-5' : ''}`}></div>
                </div>
              </label>
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <div>
                <h4 className="font-medium">Third-party app access alert</h4>
                <p className="text-gray-600 text-sm">Receive email alerts whenever your account is accessed from a new third-party app or location. Example: IMAP/POP clients such as mail apps and calendar apps.</p>
              </div>
              <label className="inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={thirdPartyAlert} 
                  onChange={() => setThirdPartyAlert(!thirdPartyAlert)} 
                  className="sr-only peer"
                />
                <div className={`relative w-11 h-6 rounded-full peer ${thirdPartyAlert ? 'bg-green-400' : 'bg-gray-200'}`}>
                  <div className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-all ${thirdPartyAlert ? 'translate-x-5' : ''}`}></div>
                </div>
              </label>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">Newsletter subscription</h4>
                <p className="text-gray-600 text-sm">Receive marketing communication regarding Zoho's products, services, and events from Zoho and its regional partners.</p>
              </div>
              <label className="inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={newsletterSubscription} 
                  onChange={() => setNewsletterSubscription(!newsletterSubscription)} 
                  className="sr-only peer"
                />
                <div className={`relative w-11 h-6 rounded-full peer ${newsletterSubscription ? 'bg-green-400' : 'bg-gray-200'}`}>
                  <div className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-all ${newsletterSubscription ? 'translate-x-5' : ''}`}></div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-md shadow-sm mb-4 p-4">
          <h2 className="text-lg font-medium mb-1">Authorized Websites</h2>
          <p className="text-gray-600 mb-4">View and manage the websites you've granted access to your account information.</p>
          
          <div className="flex flex-col items-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"></path>
              </svg>
            </div>
            <p className="text-gray-600 font-medium">You don't have any authorized websites</p>
          </div>
        </div>

        <div className="bg-white rounded-md shadow-sm mb-4 p-4">
          <h2 className="text-lg font-medium mb-1">Linked Accounts</h2>
          <p className="text-gray-600 mb-4">View and manage the list of accounts that are linked with your Zoho account.</p>
          
          <div className="border-b pb-4 mb-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white rounded-full border flex items-center justify-center mr-3">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                </svg>
              </div>
              <div className="flex-1">
                <div className="font-medium">mostafaahmed11019970@gmail.com</div>
                <div className="text-gray-500 text-sm">1 month ago</div>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-white rounded-full border flex items-center justify-center mx-1">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="11" fill="#FF6600"></circle>
                  </svg>
                </div>
                <div className="w-6 h-6 bg-white rounded-full border flex items-center justify-center mx-1">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <rect width="21" height="21" x="1.5" y="1.5" fill="#0078D4"></rect>
                    <path d="M1.5 1.5h21v21h-21V1.5z" fill="#0078D4"></path>
                  </svg>
                </div>
              </div>
            </div>
            <div className="mt-2 text-gray-600">Mjol, Al Qalyubiyah, Egypt</div>
          </div>
          
          <div className="flex justify-center">
            <button className="text-blue-500 font-medium flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path>
              </svg>
              Link Your Account
            </button>
          </div>
        </div>

        <div className="bg-white rounded-md shadow-sm mb-4 p-4">
          <h2 className="text-lg font-medium mb-1">Close Account</h2>
          <p className="text-gray-600 mb-2">Permanently delete all the data associated with your account and the apps you use. <span className="text-blue-500">Refer help article</span></p>
          
          <div className="flex flex-col items-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path>
              </svg>
            </div>
            <p className="text-gray-600 text-center mb-4">Closing your Zoho Account will permanently delete all your account information and you will no longer be able to use any of the Zoho services.</p>
            <button className="bg-red-500 text-white px-4 py-2 rounded-md">Close Account</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;