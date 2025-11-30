import { ChevronLeft, X } from "lucide-react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import oneToOneIcon from "../../../../src/assets/image/oneToOneIcon.svg";
import groupBookingIcon from "../../../../src/assets/image/groupBookingIcon.svg";
import collectiveIcon from "../../../../src/assets/image/collectiveIcon.svg";
import resourceIcon from "../../../../src/assets/image/resourceIcon.svg";

const InterviewTypeCard = ({ icon, title, description, path }) => {
  const navigate = useNavigate();
  
  const handleNavigation = () => {
    if (path) {
      navigate(`${path}`, { 
        state: { interviewType: title } 
      });
    }
  };
  
  const isDisabled = !path;

  return (
    <div 
      onClick={isDisabled ? undefined : handleNavigation} 
      className={`bg-white p-1 rounded-lg shadow transition-shadow duration-200 relative group 
        ${isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:shadow-lg'}
      `}
    >
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="h-20 w-20 bg-gradient-to-tr  from-blue-100 via-white to-white flex items-center justify-center">
          <img src={icon} alt={title} className="w-12 h-12" />
          </div>
          <div>
            <h3 className="text-xl font-bold">{title}</h3>
            <p className="text-gray-600">
              <span>Ideal for {description}</span>
            </p>
          </div>        
        </div>
      </div>
    </div>
  );
};

const CreateInterviewPage = () => {
  const location = useLocation();
  const isMainPage = location.pathname === "/create_interview";
const navigate = useNavigate();
  const interviewTypes = [
    {
      icon: oneToOneIcon,
      title: "one-to-one",
      description: "support calls, client meetings, and any one-to-one meetings",
      path: "InterFormOne"
    },
    {
      icon: groupBookingIcon,
      title: "group-booking",
      description: "workshops, webinars, and classes",
      path: "InterFormOne"
    },
    {
      icon: collectiveIcon,
      title: "collective-booking",
      description: "panel interviews, board meetings, and any many-to-one meetings",
      path: "InterFormOne"
    },
    {
      icon: resourceIcon,
      title: "resource",
      description: "conference room bookings and equipment rentals",
      path: "InterFormOne"
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6 relative">
           <button 
             onClick={() => navigate(-1)} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 absolute left-4 top-5"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
         
          <h1 className="text-xl font-bold text-center">Create New Interview</h1>
          <Link 
            to="/layoutDashboard"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 absolute right-4 top-5"
          >
            <X className="w-5 h-5" />
          </Link>
        </div>
      </header>

      {/* Content */}
      {isMainPage ? (
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="grid gap-6 text-[14px]">
            {interviewTypes.map((type, index) => (
              <InterviewTypeCard
                key={index}
                icon={type.icon}
                title={type.title}
                description={type.description}
                path={type.path}
              />
            ))}
          </div>
        </main>
      ) : (
        <Outlet />
      )}
    </div>
  );
};

export default CreateInterviewPage;
