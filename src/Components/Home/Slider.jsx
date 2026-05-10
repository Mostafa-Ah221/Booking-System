import { useState, useEffect } from "react";
import { GoChevronRight } from "react-icons/go";
import { GoChevronLeft } from "react-icons/go";
import img1 from '../../assets/image/New folder/video_1 .gif';
import img2 from '../../assets/image/New folder/video_2.gif';
import img3 from '../../assets/image/New folder/video_3.gif';
import img4 from '../../assets/image/New folder/video_4.gif';
import img5 from '../../assets/image/New folder/video_5.gif';

export default function Slider() {
  const sliderData = {
    slides: [
      { id: 1, image: img1, title: "Slide 1" },
      { id: 2, image: img2, title: "Slide 2" },
      { id: 3, image: img3, title: "Slide 3" },
      { id: 4, image: img4, title: "Slide 4" },
      { id: 5, image: img5, title: "Slide 5" },
    ],
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setSlidesToShow(1);
      } else if (window.innerWidth < 1024) {
        setSlidesToShow(2);
      } else {
        setSlidesToShow(3);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const total = sliderData.slides.length;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 2500);
    return () => clearInterval(interval);
  }, []);

  // نجيب الشرائح الظاهرة مع loop
  const getVisibleSlides = () => {
    const visible = [];
    for (let i = 0; i < slidesToShow; i++) {
      visible.push(sliderData.slides[(currentIndex + i) % total]);
    }
    return visible;
  };

  const visibleSlides = getVisibleSlides();

  return (
    <div className="relative w-full max-w-4xl mx-auto px-6 py-8">
      {/* العنوان */}
      <h2 className="text-center text-2xl md:text-3xl font-semibold mb-8 md:mb-12 max-w-xs md:max-w-sm mx-auto leading-snug">
        Scale Smarter with Intelligent Scheduling
      </h2>

      {/* أزرار التنقل */}
      <div className="flex justify-end gap-2 mb-4">
        <button
          onClick={prevSlide}
          className="bg-black hover:bg-green-500 text-white p-2 rounded-full transition-colors duration-200"
          aria-label="Previous slide"
        >
          <GoChevronRight className="text-xl" />
        </button>
        <button
          onClick={nextSlide}
          className="bg-black hover:bg-green-500 text-white p-2 rounded-full transition-colors duration-200"
          aria-label="Next slide"
        >
          <GoChevronLeft className="text-xl" />
        </button>
      </div>

      {/* السلايدر */}
      <div className="flex gap-3 md:gap-4 items-center overflow-hidden">
        {visibleSlides.map((slide, index) => {
          const isCenter = slidesToShow === 3 && index === 1;
          const isAlone = slidesToShow === 1;

          return (
            <div
              key={`${slide.id}-${index}`}
              className="flex-1 transition-all duration-500"
              style={{
                transform: isCenter ? "scale(1.08)" : isAlone ? "scale(1)" : "scale(0.92)",
              }}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full object-cover rounded-xl shadow-md"
                style={{
                  height: isAlone
                    ? "clamp(180px, 50vw, 320px)"
                    : isCenter
                    ? "clamp(160px, 22vw, 260px)"
                    : "clamp(130px, 18vw, 220px)",
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {sliderData.slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`rounded-full transition-all duration-300 ${
              i === currentIndex
                ? "bg-green-500 w-5 h-2"
                : "bg-gray-300 w-2 h-2"
            }`}
          />
        ))}
      </div>
    </div>
  );
}