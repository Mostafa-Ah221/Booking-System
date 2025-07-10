import React, { useState, useEffect } from "react";
import { GoChevronRight  } from "react-icons/go";
import { GoChevronLeft } from "react-icons/go";




export default function Slider() {
  

    const sliderData = {
    slides: [
      {
        id: 1,
        image:
          "https://www.zohowebstatic.com/sites/zweb/images/bookings/home/zbs-indys-recruitment.webp",
        title: "Slide 1",
      },
      {
        id: 2,
        image:
          "https://www.zohowebstatic.com/sites/zweb/images/bookings/home/zbs-indys-education.webp",
        title: "Slide 2",
      },
      {
        id: 3,
        image:
          "https://www.zohowebstatic.com/sites/zweb/images/bookings/home/zbs-indys-healthcare.webp",
        title: "Slide 3",
      },
      {
        id: 4,
        image:
          "https://www.zohowebstatic.com/sites/zweb/images/bookings/home/zbs-indys-professional-services.webp",
        title: "Slide 4",
      },
      {
        id: 5,
        image:
          "https://www.zohowebstatic.com/sites/zweb/images/bookings/home/zbs-indys-sales.webp",
        title: "Slide 5",
      },
    ],
  };

  const [currentIndex, setCurrentIndex] = useState(0);

  // الانتقال للشريحة التالية
  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === sliderData.slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? sliderData.slides.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-4xl mx-auto ">
        <h2 className="text-center text-3xl w-80 mx-auto font-semibold mb-16">Scheduling solutions to scale your business</h2>
      {/* أزرار الأسهم */}
      <button
        onClick={prevSlide}
        className="absolute right-0  top-24 transform -translate-y-1/2 text-white p-2 rounded-full"
      >
        <GoChevronRight className="bg-black text-white text-2xl hover:bg-green-500 duration-200 "/>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-10 top-24 transform -translate-y-1/2 text-white p-2 rounded-full "
      >
        <GoChevronLeft className="bg-black text-white text-2xl hover:bg-green-500 duration-200"/>
      </button>

      {/* السلايدر */}
      <div className="flex transition-transform duration-500 ease-in-out">
        
        {sliderData.slides
          .concat(sliderData.slides) 
          .slice(currentIndex, currentIndex + 3)
          .map((slide, index) => (
            <div
              key={slide.id}
              className={`w-1/3 flex-shrink-0 p-2 transition-transform duration-500 ${
                index === 1 ? "scale-108" : "scale-90"
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-60 object-cover rounded-lg shadow-md"
              />
              <h3
                className={`text-center mt-2 text-lg font-semibold ${
                  index === 1 ? "text-green-500" : "text-gray-500"
                }`}
              >
                {slide.title}
              </h3>
            </div>
          ))}
      </div>
    </div>
  );
}
