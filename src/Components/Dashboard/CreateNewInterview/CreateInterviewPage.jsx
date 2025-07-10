import { X } from "lucide-react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

const InterviewTypeCard = ({ icon, title, description, path, buttons = [] }) => {
  const navigate = useNavigate();
  
  const handleNavigation = () => {
    if (path) {
      navigate(`${path}`, { 
        state: { 
          interviewType: title 
        } 
      });
    }
  };
  
  return (
    <div 
      onClick={handleNavigation} 
      className={`bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-200 relative group ${path ? 'cursor-pointer' : ''}`}
    >
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <img src={icon} alt={title} className="w-12 h-12" />
          <div>
            <h3 className="text-xl font-bold">{title}</h3>
            <p className="text-gray-600">
              <span>Ideal for {description}</span>
            </p>
          </div>        
        </div>
        {buttons.length > 0 && (
          <div className="flex gap-4 mt-4">
            {buttons.map((button, index) => (
              <button
                key={index}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors duration-200"
              >
                {button}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CreateInterviewPage = () => {
  const location = useLocation();
  const isMainPage = location.pathname === "/create_interview";

  const interviewTypes = [
    {
      icon: "https://static.zohocdn.com/bookings/V9_397_1/dist/com/zb-ui/images/admin/service/zb-oneonone-icon-d3fcf5d95958114391b04af9cc469631.svg",
      title: "one-to-one",
      description: "support calls, client meetings, and any one-to-one meetings",
      path: "InterFormOne"
    },
    {
      icon: "https://static.zohocdn.com/bookings/V9_384_2_plugin/dist/com/zb-ui/images/admin/service/zb-group-icon-79b3470fa1b2d647fb0652c5c917b9e4.svg",
      title: "Group Booking",
      description: "workshops, webinars, and classes",
      path: "",
      buttons: ["One Time", "Recurring"],
    },
    {
      icon: "https://static.zohocdn.com/bookings/V9_384_2_plugin/dist/com/zb-ui/images/admin/service/zb-collective-icon-8b1ca3781f84ecb6e198b96a15814382.svg",
      title: "Collective Booking",
      description: "panel interviews, board meetings, and any many-to-one meetings",
      path: ""
    },
    {
      icon: "https://static.zohocdn.com/bookings/V9_384_2_plugin/dist/com/zb-ui/images/admin/service/zb-resource-icon-a3f74118e66761833de396b793e97098.svg",
      title: "Resource",
      description: "conference room bookings and equipment rentals",
      path: ""
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6 relative">
          <h1 className="text-2xl font-bold text-center">Create New Interview</h1>
          <Link 
            to="/layoutDashboard"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 absolute right-4 top-5"
          >
            <X className="w-6 h-6" />
          </Link>
        </div>
      </header>

      {/* Content */}
      {isMainPage ? (
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="grid gap-6">
            {interviewTypes.map((type, index) => (
              <InterviewTypeCard
                key={index}
                icon={type.icon}
                title={type.title}
                description={type.description}
                path={type.path}
                buttons={type.buttons}
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