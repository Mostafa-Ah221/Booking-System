import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { emailActions } from '../../../../redux/slices/EmailConfigSlice';
import { fetchEmailSettings, createOrUpdateEmailSettings, deleteEmailSettings } from '../../../../redux/apiCalls/email_configurationCallApi';

export default function MailCategory() {
  const dispatch = useDispatch();
  
  // Fix: Add fallback object to prevent destructuring error
  const emailState = useSelector(state => state.emailConfig) || {};
  const { settings, loading = false, error = null, success = null } = emailState;
console.log(settings);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    mail_driver: "smtp",
    mail_host: "",
    mail_port: 587,
    mail_username: "",
    mail_password: "",
    mail_encryption: "tls",
    mail_from_address: "",
    mail_from_name: ""
  });

  // Fetch email settings on component mount
  useEffect(() => {
    dispatch(fetchEmailSettings());
  }, [dispatch]);

  // Clear messages after showing them
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        if (emailActions.clearMessages) {
          dispatch(emailActions.clearMessages());
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'mail_port' ? parseInt(value) || 587 : value
    }));
  };

  const handleCreateNew = () => {
    setIsUpdateMode(false);
    setFormData({
      mail_driver: "",
      mail_host: "",
      mail_port: "",
      mail_username: "",
      mail_password: "",
      mail_encryption: "",
      mail_from_address: "",
      mail_from_name: ""
    });
    setIsModalOpen(true);
  };

  const handleUpdate = () => {
    if (settings) {
      setIsUpdateMode(true);
      setFormData({
        mail_driver: settings?.config.mail_driver || "",
        mail_host: settings?.config.mail_host || "",
        mail_port: settings?.config.mail_port || "",
        mail_username: settings?.config.mail_username || "",
        mail_password: settings?.config.mail_password || "",
        mail_encryption: settings?.config.mail_encryption || "",
        mail_from_address: settings?.config.mail_from_address || "",
        mail_from_name: settings?.config.mail_from_name || ""
      });
      setIsModalOpen(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(createOrUpdateEmailSettings(formData));
      if (result?.payload?.status || result?.meta?.requestStatus === 'fulfilled') {
        setIsModalOpen(false);
        dispatch(fetchEmailSettings());
        
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleDelete = async () => {
    if (settings?.config.id && window.confirm('Are you sure you want to delete the email settings?')) {
      try {
        const result = await dispatch(deleteEmailSettings(settings?.config.id));
        if (result?.payload?.status || result?.meta?.requestStatus === 'fulfilled') {
          dispatch(fetchEmailSettings()); // Refresh data
        }
      } catch (error) {
        console.error('Error deleting settings:', error);
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Debug: Log the state to check what's available
  useEffect(() => {
    console.log('Email State:', emailState);
  }, [emailState]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className=" font-bold text-gray-900">Email Configuration Settings</h1>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
                {!settings?.config ? (
                      <button 
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center text-sm"
                onClick={handleCreateNew}
                disabled={loading}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Create New
              </button>
                ):( <>
                  <button 
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-1 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center text-sm"
                    onClick={handleUpdate}
                    disabled={loading}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Update
                  </button>
                  
                  <button 
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center text-sm"
                    onClick={handleDelete}
                    disabled={loading}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </>)}
            

            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
              <span className="text-gray-600 font-medium">Loading...</span>
            </div>
          </div>
        )}
        
       
        
        {/* Success Alert */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-green-700">{success}</span>
          </div>
        )}

        {/* Current Settings Display */}
        {settings?.config ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className=" font-semibold text-gray-900">Current Configuration</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-500 mb-1">Mail Driver</label>
                <span className=" font-semibold text-gray-900">{settings?.config.mail_driver}</span>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-500 mb-1">Mail Host</label>
                <span className=" font-semibold text-gray-900 break-all">{settings?.config.mail_host}</span>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-500 mb-1">Mail Port</label>
                <span className=" font-semibold text-gray-900">{settings?.config.mail_port}</span>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-500 mb-1">Username</label>
                <span className=" font-semibold text-gray-900 break-all">{settings?.config.mail_username}</span>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-500 mb-1">Encryption</label>
                <span className=" font-semibold text-gray-900">{settings?.config.mail_encryption || 'None'}</span>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-500 mb-1">From Address</label>
                <span className=" font-semibold text-gray-900 break-all">{settings?.config.mail_from_address}</span>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 md:col-span-2 xl:col-span-1">
                <label className="block text-sm font-medium text-gray-500 mb-1">From Name</label>
                <span className=" font-semibold text-gray-900">{settings?.config.mail_from_name}</span>
              </div>
            </div>
          </div>
        ) : (
          !loading && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Configuration Found</h3>
              <p className="text-gray-500 mb-6">No email configuration settings defined yet. Get started by creating a new configuration.</p>
              <button 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 flex items-center mx-auto"
                onClick={handleCreateNew}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Create Configuration
              </button>
            </div>
          )
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={closeModal}>
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center p-8 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
                <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                  <svg className="w-8 h-8 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {isUpdateMode ? 'Update Email Configuration' : 'Create New Email Configuration'}
                </h3>
                <button 
                  className="w-10 h-10 rounded-full bg-white hover:bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-all duration-200 shadow-sm border border-gray-200" 
                  onClick={closeModal}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Mail Driver</label>
                  
                       <input
                        type="text"
                        name="mail_driver"
                        value={formData.mail_driver}
                        onChange={handleInputChange}
                        placeholder="mail driver"
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                        />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Mail Host</label>
                    <input
                      type="text"
                      name="mail_host"
                      value={formData.mail_host}
                      onChange={handleInputChange}
                      placeholder="smtp.mailtrap.io"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Mail Port</label>
                    <input
                      type="number"
                      name="mail_port"
                      value={formData.mail_port}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Encryption</label>
                  
                     <input
                      type="text"
                      name="mail_encryption"
                      value={formData.mail_encryption}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Username</label>
                    <input
                      type="text"
                      name="mail_username"
                      value={formData.mail_username}
                      onChange={handleInputChange}
                      placeholder="your-username"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Password</label>
                    <input
                      type="password"
                      name="mail_password"
                      value={formData.mail_password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">From Address</label>
                    <input
                      type="email"
                      name="mail_from_address"
                      value={formData.mail_from_address}
                      onChange={handleInputChange}
                      placeholder="noreply@example.com"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">From Name</label>
                    <input
                      type="text"
                      name="mail_from_name"
                      value={formData.mail_from_name}
                      onChange={handleInputChange}
                      placeholder="Example App"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-200">
                  <button 
                    type="submit" 
                    disabled={loading}  
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        {isUpdateMode ? 'Update Configuration' : 'Create Configuration'}
                      </>
                    )}
                  </button>
                  
                  <button 
                    type="button" 
                    onClick={closeModal} 
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}