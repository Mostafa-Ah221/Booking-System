import React, { useState } from 'react';

const Steps = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      number: '1',
      label: 'STEP 01',
      title: 'Customize availability',
      description: 'Add your available times and sync your calendars.',
      video: "https://www.zohowebstatic.com/sites/zweb/images/bookings/home/zbs-personalize-availability.mp4"
    },
    {
      number: '2',
      label: 'STEP 02',
      title: 'Share your booking link',
      description: 'Let clients see your availability from a custom booking page.',
      video: "https://www.zohowebstatic.com/sites/zweb/images/bookings/home/zbs-share-your-booking.mp4"
    },
    {
      number: '3',
      label: 'STEP 03',
      title: 'Get booked',
      description: 'Have clients schedule appointments for their preferred time slots in just a few clicks.',
      video: "https://www.zohowebstatic.com/sites/zweb/images/bookings/home/zbs-get-booked.mp4"
    }
  ];

  const handleVideoEnd = () => {
    setActiveStep((prevStep) => (prevStep + 1) % steps.length);
  };

  const handleStepClick = (index) => {
    setActiveStep(index);
  };

  return (
    <div className="bg-indigo-600 rounded-3xl min-h-screen md:min-h-[600px] p-8 md:p-12 relative overflow-hidden">
      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Take back your time with
            <br />
            effortless scheduling
          </h2>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Steps */}
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-3 top-4 bottom-8 w-0.5 bg-indigo-500 opacity-50" />

            {/* Steps List */}
            <div className="space-y-12">
              {steps.map((step, index) => (
                <div 
                  key={index} 
                  className={`flex items-start gap-6 relative cursor-pointer group transition-all duration-300 transform
                    ${activeStep === index ? 'scale-105' : 'hover:scale-102'}`}
                  onClick={() => handleStepClick(index)}
                >
                  {/* Step Number Circle */}
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white font-bold z-10 transition-all duration-300
                    ${activeStep === index ? 'bg-green-500  shadow-lg' : 'bg-indigo-500 group-hover:bg-indigo-400'}`}>
                    {step.number}
                  </div>
                  {/* Step Content */}
                  <div className="flex-1">
                    <span className={`inline-block px-3 py-1 text-white text-xs rounded-full mb-2 transition-all duration-300
                      ${activeStep === index ? 'bg-yellow-500 text-[#000]' : 'bg-indigo-500 group-hover:bg-indigo-400'}`}>
                      {step.label}
                    </span>
                    <h3 className="text-white text-xl font-semibold mb-2">
                      {step.title}
                    </h3>
                   {step.description && (
                        <p className={`transition-all duration-300 text-indigo-100 ${activeStep === index ? "block" : "hidden"}`}>
                            {step.description}
                        </p>
                    )}

                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Video Preview */}
          <div className="relative bg-white rounded-lg shadow-xl p-4 aspect-video">
            {/* Window Controls */}
            <div className="flex gap-2 mb-4 absolute top-4 left-4 z-10">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            
            {/* Video Container */}
            <div className="w-full h-full rounded-lg overflow-hidden">
              <video 
                key={steps[activeStep].video}
                className="w-full h-full object-cover"
                autoPlay
                muted
                playsInline
                onEnded={handleVideoEnd}
              >
                <source src={steps[activeStep].video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Steps;