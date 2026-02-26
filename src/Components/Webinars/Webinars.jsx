import { useState } from 'react';

export default function Webinars() {
  const [activeTab, setActiveTab] = useState('live');

  const handsOnWorkshops = [
    {
      day: "Oct 01, 2026 at Wednesday",
      time: "11:00 a.m ET",
      title: "Session 4 | Create scheduling workflows for your appointments",
      description: "In this session, you'll learn how to configure workflows before, during, and after appointments, so you can save time and reduce manual tasks. Send follow-ups via email and SMS, sync data to your CRM, create invoices through custom functions, and more for any of your event types.",
      status: "register"
    },
    {
      day: "Oct 16, 2026 at Thursday",
      time: "11:00 a.m. ET",
      title: "Session 5 | Connect Appoint Roll with other apps to enhance productivity :",
      description: "",
      status: "register"
    },
    {
      day: "Aug 21, 2026 Thursday",
      time: "11:00 a.m ET",
      title: "(COMPLETED) Session 1 | Enable scheduling automation with Appoint Roll :",
      description: "",
      status: "completed"
    },
    {
      day: "Sept 04, 2026 at Thursday",
      time: "11:00 a.m ET",
      title: "(COMPLETED) Session 2 | Seven ways to schedule appointments with Appoint Roll :",
      description: "",
      status: "completed"
    }
  ];

  const liveWebinars = [
    {
      day: "Every alternate thursday",
      time: "10:00 a.m PT / 10:30 p.m IST",
      title: "Master your scheduler",
      description: "Join us for a 60 minute session to explore Bookings, ask questions and automate your client-facing appointment scheduling.",
      topics: [
        "Setting up Appoint Roll",
        "Integrations",
        "Appoint Roll mobile app demo",
        "Scenarios & Solutions"
      ],
      status: "register"
    },
    {
      day: "Tuesday, September 30, 2026",
      time: "10:00 p.m. IST / 12:30 p.m. EDT",
      title: "Accelerate sales cycles with Appoint Roll :",
      description: "",
      topics: [],
      status: "register"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Dynamic Header based on active tab */}
        <div className="text-center mb-8">
          {activeTab === 'hands-on' ? (
            <>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                Appoint Roll know-how: A hands-on workshop series
              </h1>
              <p className="text-gray-600 text-lg">
                Let's simplify appointment scheduling for your business with Appoint Roll.
              </p>
            </>
          ) : (
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Appoint Roll Webinars
            </h1>
          )}
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex border-b border-gray-300">
            <button
              onClick={() => setActiveTab('live')}
              className={`px-4 py-3 border-b-2 transition-colors font-bold ${
                activeTab === 'live' 
                  ? 'text-gray-800 border-blue-800' 
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              Live webinars
            </button>
            <button
              onClick={() => setActiveTab('hands-on')}
              className={`px-4 py-3 font-bold  border-b-2 transition-colors ${
                activeTab === 'hands-on' 
                  ? 'text-gray-800 border-blue-800' 
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              Hands-on workshop
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {activeTab === 'hands-on' ? (
            // Hands-on Workshop Content
            <>
              {/* Workshop Sessions Table */}
              <div className="border border-blue-800  overflow-hidden">
                {/* Table Header */}
                <div className="bg-gray-100 border-b border-blue-800">
                  <div className="grid grid-cols-12 gap-0">
                    <div className="col-span-3 p-4 font-semibold text-gray-800 ">Day</div>
                    <div className="col-span-2 p-4 font-semibold text-gray-800 ">Time</div>
                    <div className="col-span-7 p-4 font-semibold text-gray-800">Title</div>
                  </div>
                </div>

                {/* Workshop Sessions */}
                {handsOnWorkshops.map((workshop, index) => (
                  <div key={index} className={`bg-white ${index !== handsOnWorkshops.length - 1 ? 'border-b border-blue-800 mb-2' : ''}`}>
                    <div className="grid grid-cols-12 gap-0 min-h-[120px]">
                      <div className="col-span-3 p-4  flex items-start">
                        <span className="text-sm text-gray-700 font-medium">
                          {workshop.day}
                        </span>
                      </div>
                      <div className="col-span-2 p-4  flex items-start">
                        <span className="text-sm text-gray-700 font-medium">
                          {workshop.time}
                        </span>
                      </div>
                      <div className="col-span-7 p-4">
                        <div className="flex flex-col h-full justify-between">
                          <div className="space-y-3">
                            <h3 className="font-semibold text-gray-900 text-2xl leading-tight">
                              {workshop.title}
                            </h3>
                            {workshop.description && (
                              <p className="text-lg text-gray-900 leading-relaxed">
                                {workshop.description}
                              </p>
                            )}
                          </div>
                          {workshop.status === 'register' && (
                            <div className="flex justify-end mt-4">
                              <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 text-sm font-semibold rounded transition-colors">
                                REGISTER
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            // Live Webinars Content
            <>
              {/* Live Webinars Table */}
              <div className="border border-blue-800  overflow-hidden">
                {/* Table Header */}
                <div className="bg-gray-100 border-b border-blue-800">
                  <div className="grid grid-cols-12 gap-0">
                    <div className="col-span-3 p-4 font-semibold text-gray-800 ">Day</div>
                    <div className="col-span-2 p-4 font-semibold text-gray-800 ">Time</div>
                    <div className="col-span-7 p-4 font-semibold text-gray-800">Title</div>
                  </div>
                </div>

                {/* Webinar Sessions */}
                {liveWebinars.map((webinar, index) => (
                  <div key={index} className={`bg-white ${index !== liveWebinars.length - 1 ? 'border-b border-blue-800' : ''}`}>
                    <div className="grid grid-cols-12 gap-0 min-h-[120px]">
                      <div className="col-span-3 p-4  flex items-start">
                        <span className="text-sm text-gray-700 font-medium">
                          {webinar.day}
                        </span>
                      </div>
                      <div className="col-span-2 p-4  flex items-start">
                        <span className="text-sm text-gray-700 font-medium">
                          {webinar.time}
                        </span>
                      </div>
                      <div className="col-span-7 p-4">
                        <div className="flex flex-col h-full justify-between">
                          <div className="space-y-3">
                            <h3 className="font-semibold text-gray-900 text-2xl leading-tight">
                              {webinar.title}
                            </h3>
                            {webinar.description && (
                              <p className=" text-gray-900 leading-relaxed">
                                {webinar.description}
                              </p>
                            )}
                            {webinar.topics.length > 0 && (
                              <>
                                <p className=" font-semibold text-gray-800">
                                  What's covered in this session?
                                </p>
                                <div className="grid grid-cols-2 gap-x-8 gap-y-2  text-gray-700">
                                  {webinar.topics.map((topic, topicIndex) => (
                                    <div key={topicIndex} className="flex items-center">
                                      <span className="w-2 h-2 bg-gray-400 rounded-full mr-3 flex-shrink-0"></span>
                                      {topic}
                                    </div>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                          <div className="flex justify-end mt-4">
                            <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 text-sm font-semibold rounded transition-colors">
                              REGISTER
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}