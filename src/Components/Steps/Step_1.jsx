import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { createWorkSpace } from '../../redux/apiCalls/workspaceCallApi';

const Setup_1 = () => {
  const dispatch = useDispatch();
  const [businessName, setBusinessName] = useState('');

  const handleSubmit = async () => {
    if (!businessName.trim()) {
      alert("Workspace name is required!");
      return;
    }
    try {
      const response = await dispatch(createWorkSpace(businessName.trim()));
      // You can add navigation logic here if needed
      console.log("Workspace created successfully:", response);
    } catch (error) {
      console.error("Error occurred:", error);
      alert("An error occurred while creating the workspace.");
    }
  };

  const handleInputChange = (e) => {
    setBusinessName(e.target.value);
  };

  return (
    <div className="min-h-screen bg-white max-w-5xl m-auto">
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center">
        <div className="flex items-center gap-2">
          <div className="text-blue-600 w-8 h-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1024 1024"
              xmlSpace="preserve"
            >
              <path
                fill="#226DB4"
                d="M995.8,249.6c-16.5-39.1-40.2-74.3-70.4-104.5S860,91.3,820.9,74.7c-13-5.5-26.3-10.1-39.8-13.9V32.9  c0-16.5-13.4-29.9-29.9-29.9s-29.9,13.4-29.9,29.9v17.2c-9.4-0.8-18.9-1.2-28.4-1.2h-301c-16.5,0-29.9,13.4-29.9,29.9  c0,16.5,13.4,29.9,29.9,29.9H693c9.6,0,19,0.5,28.4,1.5v15.3c0,16.5,13.4,29.9,29.9,29.9s29.9-13.4,29.9-29.9v-2  c37.9,13.1,72.7,34.8,102,64c50.8,50.8,78.8,118.3,78.8,190.1v315.4c0,71.8-28,139.3-78.8,190.1c-50.8,50.8-118.3,78.8-190.1,78.8  h-73c-16.5,0-29.9,13.4-29.9,29.9s13.4,29.9,29.9,29.9h73c44.4,0,87.4-8.7,127.9-25.8c39.1-16.5,74.3-40.2,104.5-70.4  s53.9-65.3,70.4-104.5c17.2-40.5,25.8-83.6,25.8-127.9V377.5C1021.6,333.2,1012.9,290.1,995.8,249.6z"
              />
              <path
                fill="#226DB4"
                d="M659.6,692.6c0-44.4-8.7-87.4-25.8-127.9c-11.1-26.2-25.4-50.7-42.7-73l-43.9,40.9c34.2,46,52.7,101.6,52.7,160  c0,71.8-28,139.3-78.8,190.1c-50.8,50.8-118.3,78.8-190.1,78.8s-139.3-28-190.1-78.8c-50.8-50.8-78.8-118.3-78.8-190.1  s28-139.3,78.8-190.1c50.8-50.8,118.3-78.8,190.1-78.8c65.1,0,126.7,23,175.4,65.1l43.9-40.9c-27.1-24.4-57.8-43.9-91.4-58.1  c-40.5-17.2-83.6-25.8-127.9-25.8s-87.4,8.7-127.9,25.8c-39.1,16.5-74.3,40.2-104.5,70.4c-13.5,13.5-25.7,28-36.5,43.3v-126  c0-62.6,22-123.5,61.8-171.6c31.4-37.9,72.7-66.4,118.6-82.4v1.2c0,16.5,13.4,29.9,29.9,29.9s29.9-13.4,29.9-29.9V84.9  c0-0.1,0-0.3,0-0.4V32.3c0-16.5-13.4-29.9-29.9-29.9s-29.9,13.4-29.9,29.9V61c-64,17.9-121.8,55.2-164.6,106.8  c-23.9,28.9-42.6,61.3-55.5,96.3C9.1,300.4,2.4,338.5,2.4,377.5v315.4c0,44.4,8.7,87.4,25.8,127.9c16.5,39.1,40.2,74.3,70.4,104.5  c30.2,30.2,65.3,53.9,104.5,70.4c40.5,17.2,83.6,25.8,127.9,25.8c1.6,0,3.2-0.1,4.8-0.4c42.6-0.6,84-9.2,123.1-25.8  c39.1-16.5,74.3-40.2,104.5-70.4s53.9-65.3,70.4-104.5C651,780,659.6,736.9,659.6,692.6z"
              />
              <path
                fill="#089949"
                d="M332.4,650.7l-76.3-81.4c-11.3-12-30.2-12.7-42.2-1.4c-12,11.3-12.6,30.2-1.4,42.2l96.6,103.1  c5.9,6.3,13.8,9.5,21.8,9.5c7.3,0,14.6-2.7,20.3-8l195.8-182.3l43.9-40.9l56.8-52.9c12.1-11.2,12.8-30.2,1.5-42.2  c-11.2-12.1-30.1-12.8-42.2-1.5l-56.8,52.9l-43.9,40.9L332.4,650.7z"
              />
            </svg>
          </div>
          <span className="text-xl font-medium">Bookings</span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="mb-8">
            <h1 className="text-gray-700 mb-2">Welcome to Zoho Bookings, مصطفى احمد!</h1>
            <h2 className="text-2xl font-bold mb-4">Let's get you meeting ready!</h2>
          </div>

          <form className="max-w-xl">
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">
                Business name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter Business Name"
                value={businessName}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <Link 
              to="/layoutDashboard" 
              className={`w-1/3 py-3 px-4 rounded font-medium transition-colors inline-block text-center ${
                businessName.trim() 
                  ? 'bg-purple-600 text-white hover:bg-purple-700' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-none'
              }`}
              onClick={(e) => {
                if (!businessName.trim()) {
                  e.preventDefault();
                } else {
                  handleSubmit();
                }
              }}
            >
              Next
            </Link>
          </form>
        </div>

        <div className="lg:w-1/3">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold mb-2">Step 1</h3>
            <h2 className="text-2xl font-bold mb-4">Business details</h2>
            <div className='flex gap-2'>
              <span className='h-2 w-20 bg-purple-600 rounded-md inline-block'></span>
              <span className='h-2 w-20 bg-gray-200 rounded-md inline-block'></span>
              <span className='h-2 w-20 bg-gray-200 rounded-md inline-block'></span>
              <span className='h-2 w-20 bg-gray-200 rounded-md inline-block'></span>
            </div>
            <p className="text-gray-600 mb-8">Tell us about your business, and we'll work our magic.</p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-white rounded border border-purple-200">
                <span className="text-purple-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                </span>
                <span>{businessName.trim() || 'Workspace'}</span>
              </div>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Setup_1;