import React, { useState } from 'react';
import { FiChevronUp } from "react-icons/fi";
import { Link } from 'react-router-dom';
import { 
  Calendar,
  Clock,
  Building2,
  UserRound,
  Users,
  User,
  FileText
} from 'lucide-react';
import NewAppointment from './NewAppointment';
import UnavailabilityForm from './UnavailabilityForm';
import SpecialWorking from './SpecialWorking';
import WorkspaceModal from './ModelsForAdd/NewWorkspace';
import InviteRecModal from './ModelsForAdd/InviteRecModal';
import AddCustomerModal from './ModelsForAdd/AddCustomer';
import AddResourceModal from './ModelsForAdd/AddResource';

const AddNewMenu = () => {
  const [openForm, setOpenForm] = useState(null); // يمكن أن يكون "appointment" أو "unavailability" أو null

  const toggleForm = (formName) => {
    setOpenForm(openForm === formName ? null : formName); // تبديل الحالة عند النقر
  };

  const handleClose = () => {
    setOpenForm(null);
  };

  const menuItems = [
    { icon: Calendar, text: 'Appointment', color: 'bg-orange-50 text-orange-500', form: 'appointment' },
    { icon: Clock, text: 'Unavailability', color: 'bg-blue-50 text-blue-500', form: 'unavailability' },
    { icon: Clock, text: 'Special Working Hours', color: 'bg-purple-50 text-purple-500', form: 'special_working' },
    { icon: Building2, text: 'Workspace', color: 'bg-green-50 text-green-500', form: "workspace_modal" },
    { icon: UserRound, text: 'Interview', color: 'bg-pink-50 text-pink-500', link: "/create_interview" }, // تعديل هنا
    { icon: Users, text: 'Recruiter', color: 'bg-teal-50 text-teal-500', form: "Invite_rec_modal" },
    { icon: User, text: 'Customer', color: 'bg-red-50 text-red-500', form: "add_cust_modal" },
    { icon: FileText, text: 'Resource', color: 'bg-indigo-50 text-indigo-500', form: "add_resourse_model" }
  ];

  return (
    <>
      <div className="w-64 bg-white rounded-lg shadow-2xl p-4 relative shadow-gray-400 border">
        <span className="absolute -top-[1.3rem] right-[9.4rem] text-white">
          <FiChevronUp className="fill-white text-4xl" />
        </span>

        <h2 className="text-lg font-semibold mb-4 pb-1">Add New</h2>
        <hr />

        <div className="space-y-2 mt-4">
          {menuItems.map((item, index) => (
            <React.Fragment key={index}>
              {item.link ? (
                <Link to={item.link} className="flex items-center p-1 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200">
                  <div className={`p-2 rounded-lg ${item.color}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="ml-3 text-gray-700">{item.text}</span>
                </Link>
              ) : (
                <div
                  className="flex items-center p-1 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                  onClick={() => item.form && toggleForm(item.form)}
                >
                  <div className={`p-2 rounded-lg ${item.color}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="ml-3 text-gray-700">{item.text}</span>
                </div>
              )}
              {index === 2 && <hr />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Forms */}
      <NewAppointment 
        isOpen={openForm === 'appointment'} 
        onClose={handleClose}
      />
      <UnavailabilityForm 
        isOpen={openForm === 'unavailability'}
        onClose={handleClose}
      />
      <SpecialWorking 
        isOpen={openForm === 'special_working'}
        onClose={handleClose}
      />
      <WorkspaceModal 
        isOpen={openForm === 'workspace_modal'}
        onClose={handleClose}
        editWorkspace={null} 
      />
      <InviteRecModal
        isOpen={openForm === 'Invite_rec_modal'}
        onClose={handleClose}
      />
      <AddCustomerModal
        isOpen={openForm === 'add_cust_modal'}
        onClose={handleClose}
      />
      <AddResourceModal
        isOpen={openForm === 'add_resourse_model'}
        onClose={handleClose}
      />
    </>
  );
};

export default AddNewMenu;
