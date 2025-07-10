import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FaLongArrowAltRight } from "react-icons/fa";
const testimonials = [
  {
    name: 'Gray Kimmer',
    company: 'BSRP, Inc',
    quote: 'Zoho Bookings has been a godsend for my business, not only is the rate competitive. It works well with my word press site, integrates with my zoho invoices and google calendar, takes payments and offers me the full functionality of text message reminders too.',
    image: 'https://www.zoho.com/sites/zweb/images/bookings/home/zbs-morgan-digiorgio.png'
  },
  {
    name: 'Jane Doe',
    company: 'Tech Innovations',
    quote: 'Our productivity skyrocketed after implementing this scheduling solution. The seamless integration with our existing tools made the transition incredibly smooth.',
    image: 'https://www.zoho.com/sites/zweb/images/bookings/home/zbs-gray-kinnney.png'
  },
  {
    name: 'John Smith',
    company: 'Global Services',
    quote: 'The advanced features and user-friendly interface have transformed how we manage client appointments. Highly recommended for any business looking to streamline their scheduling.',
    image: 'https://www.zoho.com/sites/zweb/images/bookings/home/zbs-lokesh-mitta.png'
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
    <div className="relative w-full max-w-4xl mx-auto bg-purple-50 p-8 rounded-lg shadow-lg my-32">
     <h2 className='w-1/2 mx-auto text-3xl font-semibold '>Scheduling stories from businesses like yours</h2>
      <div className="flex items-center justify-center relative m-14">
        {/* Left Navigation */}
        <button 
          onClick={prevSlide} 
          className="absolute right-10 -top-12 z-10 bg-white/50 hover:bg-white/75 rounded-full p-2 transition-all"
        >
          <ChevronLeft className="bg-black text-white text-2xl hover:bg-green-500 duration-200 " />
        </button>
 {/* Right Navigation */}
        <button 
          onClick={nextSlide} 
          className="absolute right-0 z-10 -top-12 bg-white/50 hover:bg-white/75 rounded-full p-2 transition-all"
        >
          <ChevronRight className="bg-black text-white text-2xl hover:bg-green-500 duration-200 " />
        </button>
        {/* Slide Content */}
        <div className="w-full flex items-center">
          <div className="w-24 h-24 mr-6 flex-shrink-0">
            <img 
              src={testimonials[currentSlide].image} 
              alt={testimonials[currentSlide].name} 
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          
          <div className="flex-grow">
            <blockquote className="text-lg italic mb-4">
              "{testimonials[currentSlide].quote}"
            </blockquote>
            <div>
              <p className="font-bold text-md">{testimonials[currentSlide].name}</p>
              <p className="text-gray-600">{testimonials[currentSlide].company}</p>
            </div>
          </div>
        </div>

       
      </div>

      {/* Slide Indicators */}
      <div className="flex justify-center mt-4 space-x-2">
       <button className='bg-green-500 text-white p-2'>MORE STORIES <FaLongArrowAltRight className='inline-block'/></button>
      </div>
    </div>
  );
};

export default TestimonialSlider;