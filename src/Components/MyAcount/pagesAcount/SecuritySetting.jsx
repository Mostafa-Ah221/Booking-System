import React, { useState } from 'react';

const SecuritySetting = () => {
  const [showGeoModal, setShowGeoModal] = useState(false);
  const [showIPModal, setShowIPModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className=" mx-auto">
        <h1 className="text-xl font-medium mb-6">Security</h1>
        
        {/* Password Section */}
        <div className="bg-white rounded-md shadow mb-6 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base font-medium">Password</h2>
              <p className="text-sm text-gray-600">Password not set for this account</p>
            </div>
            <button className="bg-emerald-500 text-white px-4 py-2 rounded text-sm hover:bg-emerald-600">
              Set Password
            </button>
          </div>
          
          <div className="flex items-center mt-4 text-sm text-gray-600">
            <div className="w-5 h-5 mr-2">
              <svg viewBox="0 0 24 24" fill="#4285F4">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path>
                <path d="M11 7h2v6h-2zm0 8h2v2h-2z" fill="#4285F4"></path>
              </svg>
            </div>
            <span>You're signing in to Appoint Roll via Google and haven't set a password yet.</span>
          </div>
        </div>
        
        {/* Geo-fencing Section */}
        <div className="bg-white rounded-md shadow mb-6 p-6">
          <h2 className="text-base font-medium">Geo-fencing</h2>
          <p className="text-sm text-gray-600">Secure your account by allowing access only from the countries you want.</p>
          
          <div className="flex justify-center my-8">
            <div className="w-24 h-24 flex items-center justify-center">
              <img src="/api/placeholder/100/100" alt="Geo-fencing icon" className="opacity-30" />
            </div>
          </div>
          
          <div className="flex justify-center">
            <button 
              className="bg-emerald-500 text-white px-4 py-2 rounded text-sm hover:bg-emerald-600"
              onClick={() => setShowGeoModal(true)}
            >
              Set up Geo-fencing
            </button>
          </div>
        </div>
        
        {/* Allowed IP Address Section */}
        <div className="bg-white rounded-md shadow mb-6 p-6">
          <h2 className="text-base font-medium">Allowed IP Address</h2>
          <p className="text-sm text-gray-600">Restrict access to your account by adding a range of trusted IP addresses.</p>
          
          <div className="flex justify-center my-8">
            <div className="w-24 h-24 flex items-center justify-center">
              <img src="/api/placeholder/100/100" alt="IP Address icon" className="opacity-30" />
            </div>
          </div>
          
          <div className="flex justify-center">
            <button 
              className="bg-emerald-500 text-white px-4 py-2 rounded text-sm hover:bg-emerald-600"
              onClick={() => setShowIPModal(true)}
            >
              Add Allowed IP Address
            </button>
          </div>
        </div>
        
        {/* Application-Specific Passwords Section */}
        <div className="bg-white rounded-md shadow mb-6 p-6">
          <h2 className="text-base font-medium">Application-Specific Passwords</h2>
          <p className="text-sm text-gray-600">Allow third-party applications, like email clients, to access your account with unique passwords instead of using your account password.</p>
          
          <div className="flex justify-center my-8">
            <div className="w-24 h-24 flex items-center justify-center">
              <img src="/api/placeholder/100/100" alt="Application password icon" className="opacity-30" />
            </div>
          </div>
          
          <p className="text-sm text-center text-gray-700 mb-4">
            Use application-specific passwords instead of your account password to access your Appoint Roll account from third-party applications
          </p>
          
          <div className="flex justify-center">
            <button 
              className="bg-emerald-500 text-white px-4 py-2 rounded text-sm hover:bg-emerald-600"
              onClick={() => setShowPasswordModal(true)}
            >
              Generate New Password
            </button>
          </div>
        </div>
        
        {/* Device Sign-ins Section */}
        <div className="bg-white rounded-md shadow p-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-base font-medium">Device Sign-ins</h2>
            <button className="bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600">
              Delete all other locations
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-4">View and manage the list of locations where you've signed in on your devices.</p>
          
          <div className="flex items-center py-3">
            <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-white mr-4">
              <span className="font-bold">DE</span>
            </div>
            <span className="font-medium">Desktop</span>
            <span className="ml-auto text-sm text-gray-500">2 Locations</span>
          </div>
        </div>
      </div>
      
      {/* Geo-fencing Modal */}
      {showGeoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-md shadow-lg">
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h2 className="text-lg font-medium">Geo-fencing</h2>
              <button onClick={() => setShowGeoModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
              </button>
            </div>
            
            <div className="px-6 py-4">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      Geo-fencing will work based on IP address. So, if VPN is connected to a country that is not on allowed or on restricted list, your account cannot be accessed.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <div className="relative">
                  <select className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md appearance-none">
                    <option>Choose Countries</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <input type="radio" name="access-type" className="h-4 w-4 text-emerald-500 focus:ring-emerald-400" />
                  <label className="ml-2 text-sm text-gray-700">Allow access from selected countries</label>
                </div>
                <div className="flex items-center">
                  <input type="radio" name="access-type" className="h-4 w-4 text-emerald-500 focus:ring-emerald-400" />
                  <label className="ml-2 text-sm text-gray-700">Restrict access from selected countries</label>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-3 bg-gray-50 flex justify-start space-x-2 rounded-b-md">
              <button className="bg-emerald-500 text-white px-4 py-2 rounded text-sm hover:bg-emerald-600">
                Next
              </button>
              <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-300">
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* IP Address Modal */}
      {showIPModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-md shadow-lg">
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h2 className="text-lg font-medium">Allowed IP Address</h2>
              <button onClick={() => setShowIPModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
              </button>
            </div>
            
            <div className="px-6 py-4">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      Ensure that the IP address you provide is a static IP address. Since the dynamic IP addresses change and you might get locked out of your account.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">IP Name</label>
                <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                <p className="mt-1 text-xs text-gray-500">This name is only for your reference</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <input type="radio" name="ip-type" className="h-4 w-4 text-emerald-500 focus:ring-emerald-400" checked />
                  <div className="ml-2">
                    <label className="text-sm text-gray-700">Add current IP address</label>
                    <p className="text-xs text-gray-500">The IP address of this device connected network is 154.239.71.250</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <input type="radio" name="ip-type" className="h-4 w-4 text-emerald-500 focus:ring-emerald-400" />
                  <label className="ml-2 text-sm text-gray-700">Add static IP address</label>
                </div>
                <div className="flex items-center">
                  <input type="radio" name="ip-type" className="h-4 w-4 text-emerald-500 focus:ring-emerald-400" />
                  <label className="ml-2 text-sm text-gray-700">Add IP range</label>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-3 bg-gray-50 flex justify-start rounded-b-md">
              <button className="bg-emerald-500 text-white px-4 py-2 rounded text-sm hover:bg-emerald-600">
                Next
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Application-Specific Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-md shadow-lg">
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h2 className="text-lg font-medium">Application-Specific Passwords</h2>
              <button onClick={() => setShowPasswordModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
              </button>
            </div>
            
            <div className="px-6 py-4">
              <p className="mb-6 text-sm text-gray-700">
                Enter the app name you want to set the application-specific password for. You'll only be able to access this app with the configured application-specific password.
              </p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Enter app name</label>
                <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>
            
            <div className="px-6 py-3 bg-gray-50 flex justify-start rounded-b-md">
              <button className="bg-emerald-500 text-white px-4 py-2 rounded text-sm hover:bg-emerald-600">
                Generate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecuritySetting;