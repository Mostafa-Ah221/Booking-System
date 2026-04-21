import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import img1 from '../../assets/image/home-11.avif';
import img2 from '../../assets/image/home-7.jpg';
import img3 from '../../assets/image/home-8.jpg';
const testimonials = [
  {
    name: 'All About Embroidery',
    company: 'Fashion Business ',
    quote: 'Managing workshop bookings used to take so much time.With Appointroll, everything is organized in one place — from scheduling to confirmations.It made our process smoother and more professional.',
    image: img1
  },
  {
    name: 'EGYdesigner',
    company: 'Advertising & Marketing',
    quote: 'Appointroll helped us streamline how we manage meetings and client bookings.The system is simple, efficient, and fits perfectly with our workflow.',
    image: img2
  },
 {
  name: ' المحمود للسياحة',
company: 'Tourism Services',
  quote: (
    <span dir="rtl">
      تنظيم المواعيد بقى أسهل بكتير مع{" "}
      <span dir="ltr">Appointroll</span>. قدرنا نوفر وقت كبير ونحسن تجربة العملاء بدون أي تعقيد.
    </span>
  ),
  image: img3
}
];

const TestimonialSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto  bg-purple-50 p-4 sm:p-6 lg:p-8 rounded-lg shadow-lg my-8 sm:my-16 lg:my-32">
      {/* Title */}
      <h2 className='w-full lg:w-3/4 xl:w-1/2 mx-auto text-xl sm:text-2xl lg:text-3xl font-semibold text-center mb-6 sm:mb-8 lg:mb-12 leading-tight px-2'>
       Scheduling Success
       from Businesses Like Yours
      </h2>
      
      <div className="relative">
        {/* Navigation Buttons - Desktop */}
        <div className="hidden md:block">
          <button 
            onClick={prevSlide} 
            className="absolute -right-16 md:right-4 md:-top-32 lg:-right-0 -top-8 lg:-top-52 z-10 bg-white/50 hover:bg-white/75 rounded-full p-2 transition-all"
          >
            <ChevronLeft className="w-6 h-6 bg-black text-white rounded hover:bg-green-500 duration-200" />
          </button>
          
          <button 
            onClick={nextSlide} 
            className="absolute -right-6 lg:-right-10 md:-top-32 -top-8 lg:-top-52 z-10 bg-white/50 hover:bg-white/75 rounded-full p-2 transition-all"
          >
            <ChevronRight className="w-6 h-6 bg-black text-white rounded hover:bg-green-500 duration-200" />
          </button>
        </div>

        {/* Slide Content */}
        <div className="w-full">
          {/* Mobile/Tablet Layout */}
          <div className="md:hidden">
            <div className="text-center mb-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4">
                <img 
                  src={testimonials[currentSlide].image} 
                  alt={testimonials[currentSlide].name} 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              
              <blockquote className="text-sm sm:text-base lg:text-lg italic mb-4 px-2">
                "{testimonials[currentSlide].quote}"
              </blockquote>
              
              <div>
                <p className="font-bold text-sm sm:text-base">{testimonials[currentSlide].name}</p>
                <p className="text-gray-600 text-xs sm:text-sm">{testimonials[currentSlide].company}</p>
              </div>
            </div>
            
            {/* Mobile Navigation */}
            <div className="flex justify-center space-x-4 mb-4">
              <button 
                onClick={prevSlide} 
                className="bg-white/50 hover:bg-white/75 rounded-full p-2 transition-all"
              >
                <ChevronLeft className="w-5 h-5 bg-black text-white rounded hover:bg-green-500 duration-200" />
              </button>
              
              <button 
                onClick={nextSlide} 
                className="bg-white/50 hover:bg-white/75 rounded-full p-2 transition-all"
              >
                <ChevronRight className="w-5 h-5 bg-black text-white rounded hover:bg-green-500 duration-200" />
              </button>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-center">
            <div className="w-20 h-20 lg:w-24 lg:h-24 mr-4 lg:mr-6 flex-shrink-0">
              <img 
                src={testimonials[currentSlide].image} 
                alt={testimonials[currentSlide].name} 
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            
            <div className="flex-grow max-w-2xl">
              <blockquote className="text-base lg:text-lg italic mb-4">
                "{testimonials[currentSlide].quote}"
              </blockquote>
              <div>
                <p className="font-bold text-sm lg:text-base">{testimonials[currentSlide].name}</p>
                <p className="text-gray-600 text-xs lg:text-sm">{testimonials[currentSlide].company}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators & More Stories Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-6 lg:mt-8 space-y-4 sm:space-y-0">
        {/* Slide Indicators */}
        <div className="flex justify-center space-x-2 order-2 sm:order-1">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-200 ${
                index === currentSlide ? 'bg-green-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
        
        {/* More Stories Button */}
        {/* <div className="order-1 sm:order-2">
          <button className='bg-green-500 hover:bg-green-600 mb-1 text-white px-3 py-2 sm:px-4 sm:py-2 rounded text-xs sm:text-sm font-medium transition-colors duration-200 flex items-center space-x-2'>
            <span>MORE STORIES</span>
            <ArrowRight className='w-3 h-3 sm:w-4 sm:h-4'/>
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default TestimonialSlider;