import React from "react";
import img1 from '../../assets/image/New folder/Appoint Roll.gif';

const Trusted = () => {
  const trustedCompanies = [
    { bg: "https://www.zohowebstatic.com/sites/zweb/images/otherbrandlogos/zillow.svg" },
    { bg: "https://www.zohowebstatic.com/sites/zweb/images/otherbrandlogos/mprofit.svg" },
    { bg: "https://www.zohowebstatic.com/sites/zweb/images/otherbrandlogos/vml.svg" },
    { bg: "https://www.zohowebstatic.com/sites/zweb/images/otherbrandlogos/istore.png" },
    { bg: "https://www.zohowebstatic.com/sites/zweb/images/otherbrandlogos/luke-coutinho.png" },
    { bg: "https://www.zohowebstatic.com/sites/zweb/images/otherbrandlogos/climb.svg" },
  ];

  return (
    <div className="flex justify-center items-center flex-col my-20">
      {/* Trusted Companies Section */}
      <div className="mb-12 flex flex-wrap justify-center items-center gap-6 md:gap-12 opacity-70">
        {trustedCompanies.map(({ bg }, index) => (
          <img
            key={index}
            src={bg}
            alt="Trusted Company"
            className="w-16 md:w-20 object-contain"
          />
        ))}
      </div>

      {/* Hero Content */}
      <div className="flex flex-col md:flex-row rounded-xl overflow-hidden justify-center items-stretch bg-[#203f8b] w-[90%] md:w-[80%]">

        {/* Left: Text */}
        <div className="w-full md:w-1/2 px-6 py-8 md:px-6 md:py-6 lg:px-10 lg:py-10 text-center md:text-left flex flex-col justify-center">
          <h1 className="text-2xl md:text-lg lg:text-4xl xl:text-5xl font-bold text-white mb-3 md:mb-2 lg:mb-4">
            Growing with Every Booking
          </h1>
          <p className="text-base md:text-xs lg:text-lg xl:text-xl text-purple-100 leading-relaxed">
            Appointroll is helping businesses simplify scheduling
            and manage appointments more efficiently — every day.
          </p>
        </div>

        {/* Right: Image */}
        <div className="w-full md:w-1/2 h-48 md:h-auto relative">
          <img
            src={img1}
            alt="Appoint Roll"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

      </div>
    </div>
  );
};

export default Trusted;