import React from 'react';

const PricingComponent = () => {
  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center">Powerful scheduling software with simple pricing</h2>
        <div className='flex justify-center items-center gap-7 mt-7'>
       <div className='flex items-center gap-2'>
         <svg className="h-6 w-6 rounded-full text-white bg-[#4a3bb6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-lg text-gray-500 text-center"> No credit card required</p>
       </div>
       <div className='flex items-center gap-2'>
         <svg className="h-6 w-6 rounded-full bg-[#4a3bb6] text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <p className=" text-lg text-gray-500 text-center">  Simple and intuitive UI</p>
       </div>

        </div>

         <div className=" p-6 flex justify-around items-center gap-14">
      <div className="flex justify-between items-center ">
        <div className="flex space-x-4 items-end">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            USD
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
            EGP
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Monthly
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
            Yearly
          </button>
        </div>
        <span className="text-green-600 font-semibold">Save 25%</span>
      </div>
    </div>

        <div className="flex flex-col lg:flex-row justify-center gap-8">
          {/* Basic Plan */}
          <div className="bg-white rounded-lg shadow-lg p-8 flex-1 max-w-md">
            <h3 className="text-xl font-bold text-gray-900">BASIC</h3>
            <p className="mt-2 text-gray-600">For teams aiming to streamline their appointments and online meetings with clients</p>
            <div className="mt-6">
              <span className="text-4xl font-bold text-gray-900">E£162</span>
              <span className="text-gray-500">/per staff/month</span>
            </div>
            <button className="mt-8 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">TRY IT NOW</button>
            <ul className="mt-8 space-y-4">
              <li className="flex items-center">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-2 text-gray-700">Unlimited appointments</span>
              </li>
              <li className="flex items-center">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-2 text-gray-700">One-on-one and collective bookings</span>
              </li>
              <li className="flex items-center">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-2 text-gray-700">Customizable booking page and email notifications</span>
              </li>
              <li className="flex items-center">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-2 text-gray-700">User roles and permissions</span>
              </li>
              <li className="flex items-center">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-2 text-gray-700">Customizable booking page and email notifications</span>
              </li>
              <li className="flex items-center">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-2 text-gray-700">User roles and permissions</span>
              </li>
              <li className="flex items-center">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-2 text-gray-700">Customizable booking page and email notifications</span>
              </li>
              <li className="flex items-center">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-2 text-gray-700">User roles and permissions</span>
              </li>
              <li className="flex items-center">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-2 text-gray-700">Customizable booking page and email notifications</span>
              </li>
              <li className="flex items-center">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-2 text-gray-700">User roles and permissions</span>
              </li>
              <li className="flex items-center">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-2 text-gray-700">Customizable booking page and email notifications</span>
              </li>
              <li className="flex items-center">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-2 text-gray-700">User roles and permissions</span>
              </li>
              <li className="flex items-center">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-2 text-gray-700">Customizable booking page and email notifications</span>
              </li>
              <li className="flex items-center">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-2 text-gray-700">User roles and permissions</span>
              </li>
            </ul>
          </div>

          {/* Premium Plan */}
          <div className="bg-white rounded-lg shadow-lg p-8 flex-1 max-w-md">
            <h3 className="text-xl font-bold text-gray-900">PREMIUM</h3>
            <p className="mt-2 text-gray-600">For organizations with multiple locations or departments that need online payments and extensive integration capabilities</p>
            <div className="mt-6">
              <span className="text-4xl font-bold text-gray-900">E£243</span>
              <span className="text-gray-500">/per staff/month</span>
            </div>
            <button className="mt-8 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">TRY IT NOW</button>
            <ul className="mt-8 space-y-4">
              <li className="flex items-center">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-2 text-gray-700">Everything in the Basic plan, plus:</span>
              </li>
              <li className="flex items-center">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-2 text-gray-700">Extensive integration capabilities</span>
              </li>
              <li className="flex items-center">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-2 text-gray-700">Custom function workflows</span>
              </li>
              <li className="flex items-center">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-2 text-gray-700">White label the booking page</span>
              </li>
              <li className="flex items-center">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-2 text-gray-700">Custom function workflows</span>
              </li>
              <li className="flex items-center">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-2 text-gray-700">White label the booking page</span>
              </li>
              <li className="flex items-center">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-2 text-gray-700">Custom function workflows</span>
              </li>
              <li className="flex items-center">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-2 text-gray-700">White label the booking page</span>
              </li>
              <li className="flex items-center">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-2 text-gray-700">Custom function workflows</span>
              </li>
              <li className="flex items-center">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-2 text-gray-700">White label the booking page</span>
              </li>
              <li className="flex items-center">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-2 text-gray-700">Custom function workflows</span>
              </li>
              <li className="flex items-center">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-2 text-gray-700">White label the booking page</span>
              </li>
              <li className="flex items-center">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-2 text-gray-700">Custom function workflows</span>
              </li>
              <li className="flex items-center">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-2 text-gray-700">White label the booking page</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500">Local taxes (VAT, GST, etc.) will be charged in addition to the prices mentioned.</p>
          <a href="#" className="mt-4 inline-block text-blue-600 hover:text-blue-700">Complete feature comparison</a>
        </div>
<div className='flex justify-center items-center gap-7'>
    
        <div className="mt-12 bg-white rounded-lg shadow-lg p-8 max-w-96 ">
            <img src="https://www.zohowebstatic.com/sites/zweb/images/bookings/free-plan.png" alt="" className='w-44' />
          <h3 className="text-xl font-bold text-gray-900">Forever Free Plan</h3>
          <p className="mt-2 text-gray-600">1 staff | Online meetings | Notification emails and reminders. Two-way calendar sync - Appoint Roll, Google, Q365/Outlook.com.</p>
          <button className="mt-6  bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">GET STARTED</button>
        </div>
        <div className="mt-12 bg-[#4a3bb6] text-white rounded-lg shadow-lg p-8 max-w-96 ">
            <img src="	https://www.zohowebstatic.com/sites/zweb/images/bookings/flex-plan.png" alt=""  className='w-44'/>
          <h3 className="text-xl font-bold ">FLEX Plan</h3>
          <p className="mt-2">If you have custom requirements and need a tailored plan</p>
          <button className="mt-6 bg-white text-black py-2 px-4 rounded-md hover:bg-slate-200">Contact us</button>
        </div>
</div>

      </div>
    </div>
  );
};

export default PricingComponent;