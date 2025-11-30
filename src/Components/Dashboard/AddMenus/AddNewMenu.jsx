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
  FileText,
  ShieldUser,
} from 'lucide-react';
import UnavailabilityForm from './UnavailabilityForm';
import SpecialWorking from './SpecialWorking';
import WorkspaceModal from './ModelsForAdd/NewWorkspace';
import InviteRecModal from './ModelsForAdd/InviteRecModal';
import AddCustomerModal from './ModelsForAdd/AddCustomer';
import AddResourceModal from './ModelsForAdd/AddResource';
import RoleModal from './ModelsForAdd/NewRoleModal';
import { usePermission } from "../../hooks/usePermission";
import AddAppointment from '../Appointments/AddAppointment';
import AddStaff from './ModelsForAdd/add_Staff/AddStaff';

const AddNewMenu = () => {
  const [openForm, setOpenForm] = useState(null);

  const toggleForm = (formName) => {
    setOpenForm(openForm === formName ? null : formName); 
  };

  const handleClose = () => {
    setOpenForm(null);
  };

  const menuItems = [
    { 
      icon: Calendar, 
      text: 'Appointment', 
      color: 'bg-orange-50 text-orange-500', 
      form: 'appointment',
      requiredPermission: "add appointment"  
    },
    // { 
    //   icon: Clock, 
    //   text: 'Unavailability', 
    //   color: 'bg-blue-50 text-blue-500', 
    //   form: 'unavailability',
    //   // requiredPermission: "create unavailability"
    // },
    // { 
    //   icon: Clock, 
    //   text: 'Special Working Hours', 
    //   color: 'bg-purple-50 text-purple-500', 
    //   form: 'special_working',
    //   // requiredPermission: "create special working hours"
    // },
    { 
      icon: Building2, 
      text: 'Workspace', 
      color: 'bg-green-50 text-green-500', 
      form: "workspace_modal",
      // requiredPermission: "create workspace"
    },
    { 
      icon: UserRound, 
      text: 'Interview', 
      color: 'bg-pink-50 text-pink-500', 
      link: "/create_interview",
      requiredPermission: "create interview"
    },
    { 
      icon: Users, 
      text: 'User', 
      color: 'bg-teal-50 text-teal-500', 
      form: "Invite_rec_modal",
      requiredPermission: "create staff"
    },
    { 
      icon: User, 
      text: 'Client', 
      color: 'bg-red-50 text-red-500', 
      form: "add_cust_modal",
      requiredPermission: "create clients"
    },
    { 
      icon: Users, 
      text: 'Recruiter', 
      disc: '(Staff, Doctors, or Team Members)',
      color: 'bg-red-50 text-red-500', 
      form: "add_staff_modal",
      requiredPermission: "create staff"
    },
    { 
      icon: FileText, 
      text: 'Resource', 
      color: 'bg-indigo-50 text-indigo-500', 
      form: "add_resourse_model",
      // requiredPermission: "create resource"
    },
    { 
      icon: ShieldUser, 
      text: 'Roles', 
      color: 'bg-indigo-50 text-indigo-500', 
      form: "add_roles_model",
      requiredPermission: "create roles"
    }
  ];

  return (
    <>
      <div className="w-64 bg-white rounded-lg shadow-2xl p-4 relative shadow-gray-400 border">
        <span className="absolute -top-[1.3rem] right-[9.4rem] text-white">
          <FiChevronUp className="fill-white text-4xl" />
        </span>

        <h2 className="font-semibold mb-4 pb-1">Add New</h2>
        <hr />

        <div className="space-y-2 mt-4 text-sm">
          {menuItems.map((item, index) => {
            const hasPermission = item.requiredPermission 
              ? usePermission(item.requiredPermission) 
              : true;

            if (!hasPermission) return null;

            return (
              <React.Fragment key={index}>
                {item.link ? (
                  <Link to={item.link} className="flex items-center p-1 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200">
                    <div className={`p-2 rounded-lg ${item.color}`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div className='flex flex-col'>
                    <span className="ml-3 text-gray-700 ">{item.text}</span>
                     {item.disc && (
                        <span className="text-gray-500 text-xs ml-1">{item.disc}</span>
                      )}
                    </div>
                  </Link>
                ) : (
                  <div
                    className="flex items-center p-1 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                    onClick={() => item.form && toggleForm(item.form)}
                  >
                    <div className={`p-2 rounded-lg ${item.color}`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                     <div className='flex flex-col'>
                    <span className="ml-3 text-gray-700 ">{item.text}</span>
                     {item.disc && (
                        <span className="text-gray-500 text-xs ml-3">{item.disc}</span>
                      )}
                     </div>
                  </div>
                )}
                {index === 2 && <hr />}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Forms */}
      <AddAppointment
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
      <AddStaff
        isOpen={openForm === 'add_staff_modal'}
        onClose={handleClose}
      />
      <AddResourceModal
        isOpen={openForm === 'add_resourse_model'}
        onClose={handleClose}
      />
      <RoleModal
        isOpen={openForm === 'add_roles_model'}
        onClose={handleClose}
      />
    </>
  );
};

export default AddNewMenu;