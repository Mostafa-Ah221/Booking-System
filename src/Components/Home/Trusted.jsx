import React from "react";

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
      <div className=" flex justify-center items-center flex-col my-20">
      {/* Trusted Companies Section */}
        <div className=" mb-12 flex flex-wrap justify-center items-center gap-6 md:gap-12 opacity-70">
          {trustedCompanies.map(({ bg }, index) => (
              <img
              key={index}
              src={bg}
              alt="Trusted Company"
              className="w-20 object-contain "
            />
          ))}
        </div>

        {/* Hero Content */}
          <div className=" flex rounded-md justify-center items-center px-4 py-9 bg-[#5734d3] w-[80%]">
        <div className="max-w-4xl w-1/2 mx-auto relative">
          {/* Dotted World Map Background */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 800 400"
              className="w-full h-full"
            >
              {[
                { cx: 200, cy: 100 },
                { cx: 500, cy: 250 },
                { cx: 300, cy: 350 },
                { cx: 700, cy: 150 },
                { cx: 100, cy: 300 },
              ].map((point, index) => (
                <circle key={index} cx={point.cx} cy={point.cy} r="5" fill="white" />
              ))}
            </svg> */}
          </div>

          {/* Main Headline */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6 relative z-10">
            8M+ appointments
            <br />
            scheduled around
            <br />
            the world
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-purple-100 mb-8 relative z-10">
            With a new appointment scheduled<br/> every 5 seconds
          </p>


        </div>
     <div className="w-1/2"
        style={{
            backgroundImage: "url('https://www.zohowebstatic.com/sites/zweb/images/bookings/home/zbs-businesses-bg.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
        }}
        >
            <img src="https://www.zohowebstatic.com/sites/zweb/images/bookings/home/zbs-businesses-img.png" alt="" />
        </div>

      </div>
    </div>
  );
};

export default Trusted;
