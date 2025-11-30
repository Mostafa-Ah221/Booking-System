import React, { useState, useRef, useEffect } from 'react';
import image6 from '../../assets/image/ll.PNG';

const menuItems = [
  { id: 1, title: 'Booking page', icon: '📅', type: 'video', src: "https://www.zohowebstatic.com/sites/zweb/images/bookings/home/zbs-booking-page-nw.mp4" },
  { id: 2, title: 'Team scheduling', icon: '👥', type: 'image', src: "https://www.zohowebstatic.com/sites/zweb/images/bookings/home/zbs-team-scheduling.jpg" },
  { id: 3, title: 'Scheduling rules', icon: '⚙️', type: 'image', src: "https://www.zohowebstatic.com/sites/zweb/images/bookings/home/zbs-scheduling-rules.jpg" }, // تأكد من صحة الرابط
  { id: 4, title: 'Calendar sync', icon: '🗓️', type: 'video', src: "https://www.zohowebstatic.com/sites/zweb/images/bookings/home/zbs-calendar-sync-nw.mp4" },
  { id: 5, title: 'Meet online', icon: '💻', type: 'image', src: "https://www.zohowebstatic.com/sites/zweb/images/bookings/home/zbs-meet-online.jpg" },
  { id: 6, title: 'Update your CRM', icon: '📊', type: 'image', src: image6 },
  { id: 7, title: 'Notify and remind', icon: '🔔', type: 'video', src: "https://www.zohowebstatic.com/sites/zweb/images/bookings/home/zbs-notifications-nw.mp4" },
  { id: 8, title: 'Collect payments', icon: '💳', type: 'video', src: "https://www.zohowebstatic.com/sites/zweb/images/bookings/home/zbs-booking-page-nw.mp4" },
];

const SchedulingApp = () => {
  const [activeItem, setActiveItem] = useState(0);
  const [progress, setProgress] = useState(0);
  const mediaRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const imageTimeoutRef = useRef(null); 

 const isTransitioningRef = useRef(false);

const handleMediaEnd = () => {
  if (isTransitioningRef.current) return; 

  isTransitioningRef.current = true;

  setActiveItem((prev) => {
    let nextItem = (prev + 1) % menuItems.length;
    console.log(`🔄 Switching to item ${nextItem}: ${menuItems[nextItem].title}`);
    return nextItem;
  });

  setTimeout(() => {
    isTransitioningRef.current = false;
  }, 100);
};

  const handleMediaError = () => {
    console.log('🚫 Error loading media, moving to next item');
    handleMediaEnd();
  };

  const startProgressTracking = (duration) => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    setProgress(0);
    const step = 100 / (duration / 50);

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + step;
        if (newProgress >= 100) {
          clearInterval(progressIntervalRef.current);
          handleMediaEnd();
          return 100;
        }
        return newProgress;
      });
    }, 50);
  };
useEffect(() => {
  const currentItem = menuItems[activeItem];

  if (progressIntervalRef.current) {
    clearInterval(progressIntervalRef.current);
  }

  console.log(`🔄 Switching to item ${activeItem}: ${currentItem.title}`);

  if (currentItem.type === 'video') {
    if (mediaRef.current) {
      mediaRef.current.load();

      mediaRef.current.onloadedmetadata = () => {
        console.log(`🎥 Video duration: ${mediaRef.current.duration}s`);
        mediaRef.current.play().catch(error => console.log('🚫 Autoplay prevented', error));

        // ✅ بدء العداد بناءً على مدة الفيديو
        startProgressTracking(mediaRef.current.duration * 1000);
      };

      mediaRef.current.onended = () => {
        console.log(`🎬 Video ended: ${currentItem.title}`);
        handleMediaEnd(); // ✅ الانتقال بعد انتهاء الفيديو
      };

      mediaRef.current.onerror = () => {
        console.log(`❌ Error loading video: ${currentItem.src}`);
      };
    }
  } else if (currentItem.type === 'image') {
    const imageTimer = setTimeout(() => {
      console.log(`🖼️ Image time ended for item ${activeItem}, moving to next`);
      handleMediaEnd();
    }, 4000);

    startProgressTracking(4000);

    return () => {
      clearTimeout(imageTimer);
    };
  }
}, [activeItem]);

  const handleTimeUpdate = (e) => {
    if (e.target.duration) {
      const progressPercentage = (e.target.currentTime / e.target.duration) * 100;
      setProgress(progressPercentage);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100 my-20">
      <div className="w-full lg:w-1/2 bg-[#1a1a2e] p-8 text-white">
        <h1 className="text-2xl font-bold mb-8">Scheduling app that works 24/7 for your business!</h1>

        <div className="space-y-4">
          {menuItems.map((item, index) => (
            <div
              key={item.id}
              className={`relative flex items-center space-x-3 p-4 rounded-lg cursor-pointer transition-all duration-300 overflow-hidden 
                ${activeItem === index ? 'text-white' : 'hover:bg-gray-800'}`}
              onClick={() => setActiveItem(index)}
              style={{
                background: activeItem === index
                  ? `linear-gradient(to right, #10b981 ${progress}%, #1a1a2e ${progress}%)`
                  : 'transparent',
                transition: 'background 0.1s linear',
              }}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.title}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full lg:w-1/2 p-8 bg-[#ebdffa]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">{menuItems[activeItem].title}</h2>

          <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden relative">
            <div className="absolute top-0 left-0 h-1 bg-emerald-500 z-10" style={{ width: `${progress}%` }}></div>

            {menuItems[activeItem].type === 'video' && (
              <video ref={mediaRef} className="w-full h-full object-cover" onEnded={handleMediaEnd} onTimeUpdate={handleTimeUpdate} autoPlay onError={handleMediaError}>
                <source src={menuItems[activeItem].src} type="video/mp4" />
              </video>
            )}

            {menuItems[activeItem].type === 'image' && (
              <img src={menuItems[activeItem].src} alt={menuItems[activeItem].title} className="w-full h-full object-cover" onError={handleMediaError} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulingApp;