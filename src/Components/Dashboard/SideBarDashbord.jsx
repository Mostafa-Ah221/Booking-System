import { useState, useEffect, useRef, useMemo } from "react";
import { Calendar, Layout, FileText, User, ChevronUp, ChevronDown, Trash2, ChartBar, Clock5, Users } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaCheck } from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux'
import { getWorkspace, deleteWorkspace } from '../../redux/apiCalls/workspaceCallApi'
import { workspaceAction } from '../../redux/slices/workspaceSlice'
import { BsThreeDots } from "react-icons/bs";
import { FiEdit2 } from "react-icons/fi";
import WorkspaceModal from "./AddMenus/ModelsForAdd/NewWorkspace";
import DeleteWorkspaceModal from "./DeleteWorkspaceModal";
import { usePermission } from "../hooks/usePermission";
import toast from "react-hot-toast";
import logo from '../../assets/image/logo.png';

export default function SideBarDashbord() {
  const location = useLocation();
  const [active, setActive] = useState("");
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [workspaceToEdit, setWorkspaceToEdit] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNewWorkspaceModalOpen, setIsNewWorkspaceModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
 
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [workspaceToDelete, setWorkspaceToDelete] = useState(null);
  const [isDeletingWorkspace, setIsDeletingWorkspace] = useState(false);
  
  const mySpaceRef = useRef(null);

  const dispatch = useDispatch()
  const { workspaces, workspace } = useSelector(state => state.workspace)
  const navigate = useNavigate();
  const menuRef = useRef(null);
 
  useEffect(() => {
    dispatch(getWorkspace());

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuId(null);
      }
      if (mySpaceRef.current && !mySpaceRef.current.contains(event.target)) {
        setIsWorkspaceOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const currentPath = location.pathname.includes("interviews")
      ? "interviews"
      : location.pathname.includes("booking-pages") || location.pathname.includes("bookPage")
      ? "bookPage"
      : location.pathname.includes("my-profile") || location.pathname.includes("profilepage")
      ? "profilepage"
      : location.pathname.includes("userDashboard")
      ? "userDashboard"
      : location.pathname.includes("WorkspaceAvailability")
      ? "WorkspaceAvailability"
       : location.pathname.includes("recruiter")
    ? "recruiterPage"
    : "";
    
  
    setActive(currentPath);
  }, [location.pathname]);
  
  const canViewAppointments = usePermission("view appointment");
  const canViewInterview   = usePermission("view interview");
  const canViewClients     = usePermission("view clients");
  const canViewStaff       = usePermission("view staff");
  
console.log(canViewAppointments);

  const canViewAnalytics = 
    canViewAppointments || canViewInterview || canViewClients || canViewStaff;

  const menuItems = [
    { name: "My Profile", icon: <User size={18} />, path: "profilepage", canShow: true },
    { name: "Analytics", icon: <ChartBar size={18} />, path: "analytics", canShow: canViewAnalytics },
    { name: "Appointments", icon: <Calendar size={18} />, path: "userDashboard", canShow: canViewAppointments },
    { name: "Interviews", icon: <FileText size={18} />, path: "interviews", canShow: canViewInterview },
    { name: "Recruiter", icon: <Users size={18} />, path: "recruiterPage", canShow: canViewStaff },
    { name: "Booking Pages", icon: <Layout size={18} />, path: "bookPage", canShow: true },
  { 
    name: "Availability Workspace", 
    icon: <Clock5 size={18} />, 
    path: "WorkspaceAvailability", 
    canShow: workspace && workspace.id !== 0 
  }, ];

  useEffect(() => {
  const visibleItems = menuItems.filter(item => item.canShow);

  if (visibleItems.length > 0) {
    setActive(prev => {
      const stillVisible = visibleItems.some(item => item.path === prev);
      const newPath = stillVisible ? prev : visibleItems[0].path;
      return newPath;
    });
  }
}, [canViewAnalytics, canViewAppointments, canViewInterview, canViewClients, canViewStaff]);

useEffect(() => {
  if (active) {
    navigate(active, { replace: true });
  }
}, [active, navigate]);

  const workspaceDataRef = useRef(workspaces);

useEffect(() => {
  if (workspaces && workspaces.length > 0) {
    workspaceDataRef.current = workspaces;
  }
}, [workspaces]);

const filteredWorkspaces = useMemo(() => {
  const dataToUse = (workspaces && workspaces.length > 0) ? workspaces : workspaceDataRef.current;
  
  if (!dataToUse || !Array.isArray(dataToUse)) {
    return [];
  }
  
  if (!searchQuery.trim()) return dataToUse;
  
  const query = searchQuery.toLowerCase();
  return dataToUse.filter(workspaceItem => 
    workspaceItem && workspaceItem.name && 
    workspaceItem.name.toLowerCase().includes(query)
  );
}, [workspaces, searchQuery]);

  const toggleWorkspaceDropdown = () => {
    setIsWorkspaceOpen(prev => !prev);
    // Clear search when closing
    if (isWorkspaceOpen) {
      setSearchQuery('');
    }
  };

  const handleSelectWorkspace = (selectedWorkspace) => {
    dispatch(workspaceAction.setWorkspace(selectedWorkspace)); 
    setIsWorkspaceOpen(false);
    setSearchQuery(''); // Clear search on selection
  };

 const handleSelectMySpace = () => {
  const mySpace = {
    id: 0,
    name: "My Space"
  }; 
  dispatch(workspaceAction.setWorkspace(mySpace));
  
  if (location.pathname.includes("WorkspaceAvailability")) {
    navigate("profilepage");
    setActive("profilepage");
  }
  
  setIsWorkspaceOpen(false);
  setSearchQuery('');
};

  const toggleMenu = (workspaceId, e) => {
    e.stopPropagation(); 
    setActiveMenuId(activeMenuId === workspaceId ? null : workspaceId);
  };

  const handleNewWorkspaceClick = () => {
    setIsNewWorkspaceModalOpen(true);
    setIsWorkspaceOpen(false);
    setSearchQuery(''); // Clear search
  };

  const handleCloseNewWorkspaceModal = () => {
    setIsNewWorkspaceModalOpen(false);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setWorkspaceToEdit(null);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const handleDeleteClick = (workspaceItem, e) => {
    e.stopPropagation();
    setWorkspaceToDelete(workspaceItem);
    setIsDeleteModalOpen(true);
    setActiveMenuId(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setWorkspaceToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!workspaceToDelete) return;
    
    setIsDeletingWorkspace(true);
    
    try {
      const response = await dispatch(deleteWorkspace(workspaceToDelete.id));
      
      if (response?.success || response?.payload?.success) {
        
        if (workspace && workspace.id === workspaceToDelete.id) {
          const mySpace = {
            id: 0,
            name: "My Space"
          };
          dispatch(workspaceAction.setWorkspace(mySpace));
        }
        
        // تحديث قائمة الـ workspaces
        dispatch(getWorkspace());
      } else {
        toast.error("حدث خطأ أثناء حذف الـ workspace");
      }
    } catch (error) {
      console.error("Error deleting workspace:", error);
      toast.error("حدث خطأ أثناء حذف الـ workspace");
    } finally {
      setIsDeletingWorkspace(false);
      setIsDeleteModalOpen(false);
      setWorkspaceToDelete(null);
    }
  };
  
  return (
    <>
      <aside className="w-full h-[100vh] bg-white border-r border-gray-200 flex flex-col ">
        <div className="p-4 pb-[0.5rem] pt-1  border-b border-gray-200">
                  <Link to="Profilepage" className="flex align-center justify-left text-blue-600">
                   
                    <img 
                      src={logo} 
                      alt="Logo" 
                      className="flex-1 h-[2.9rem] w-[45%] object-cover relative right-4 " 
                    />
                  
                  </Link>
        </div>

        <nav className="flex-1 p-2">
          <div>
            <button
              onClick={toggleWorkspaceDropdown}
              className="bg-purple-100 w-full p-2 text-left rounded hover:bg-gray-100 flex items-center gap-2 justify-between"
            >
              <span className="text-purple-600 text-sm font-semibold">
                {workspace ? workspace.name : "My Space"}
              </span>
              {isWorkspaceOpen ? <ChevronUp className="text-purple-600" /> : <ChevronDown className="text-purple-600" />}
            </button>

            {isWorkspaceOpen && (
              <div
                ref={mySpaceRef}
                className="flex flex-col justify-between mt-2 bg-white border border-gray-200 rounded-lg shadow-sm fixed left-0 h-80 w-full p-1 z-50">
                <div className='h-[85%] overflow-auto'>
                  <div 
                    className="p-2 border-b border-gray-100 flex items-center justify-between mb-2 cursor-pointer hover:bg-purple-50 rounded-md"
                    onClick={handleSelectMySpace}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 text-sm bg-pink-200 rounded-full flex items-center justify-center text-pink-600 font-bold">
                        MS
                      </div>
                      <span className=" font-semibold text-gray-800">My Space</span>
                    </div>
                    <div className="flex justify-center items-center w-4 h-4 rounded-full bg-purple-500">
                      {(!workspace || workspace.id === 0) && (
                        <FaCheck className="text-white text-sm" />
                      )}
                    </div>
                  </div>

                  {/* Search */}
                  <div className="relative mb-2">
                    <input
                      className="w-full px-2 py-1 rounded-md focus:outline-none border border-purple-800"
                      type="text"
                      placeholder="Search workspaces..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                    />
                    {searchQuery && (
                      <button
                        onClick={clearSearch}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        ×
                      </button>
                    )}
                  </div>

                  {/* Search results info */}
                  {searchQuery && (
                    <div className="mb-2 px-2">
                      <p className="text-xs text-gray-500">
                        {filteredWorkspaces.length} workspace{filteredWorkspaces.length !== 1 ? 's' : ''} found
                      </p>
                    </div>
                  )}

                  {/* Workspaces list */}
                  <div className="">
                    {filteredWorkspaces.length > 0 ? (
                      filteredWorkspaces.map((workspaceItem,index) => (
                        <div 
                          key={workspaceItem.id} 
                          className={`cursor-pointer p-2 my-1 rounded-md border-b border-gray-100 flex items-center justify-between ${workspace && workspace.id === workspaceItem.id ? "bg-purple-100":"bg-transparent"} hover:bg-purple-50`}
                          onClick={() => handleSelectWorkspace(workspaceItem)}
                        >
                          <div className="flex items-center flex-col gap-2">
                            <div className="flex gap-2 items-center">
                              <div className="w-6 h-6 bg-pink-200 rounded-full flex items-center justify-center text-pink-600 font-bold">
                                {workspaceItem.name?.slice(0, 1).toUpperCase()}
                              </div>
                              <span className="text-sm text-gray-800">
                                {searchQuery ? (
                                  <span dangerouslySetInnerHTML={{
                                    __html: workspaceItem.name.replace(
                                      new RegExp(`(${searchQuery})`, 'gi'),
                                      '<mark class="bg-yellow-200">$1</mark>'
                                    )
                                  }} />
                                ) : (
                                  workspaceItem.name
                                )}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2 items-center relative">
                            <div 
                              onClick={(e) => toggleMenu(workspaceItem.id, e)}
                              className={`w-5 h-5 rounded-full flex justify-center items-center border border-transparent hover:border-purple-500 duration-300`}
                            >
                              <BsThreeDots className="text-[13px] cursor-pointers text-purple-500"/>
                            </div>
                            {activeMenuId === workspaceItem.id && (
                              <div ref={menuRef} className={`absolute bottom-6 right-2 bg-white shadow-lg rounded-lg z-10 py-2 w-40 `}>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setWorkspaceToEdit(workspaceItem);
                                    setIsEditModalOpen(true);
                                    setActiveMenuId(null);
                                  }}
                                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <FiEdit2 size={16} className="mr-2" />
                                  Edit
                                </button>
                                
                                <button
                                  onClick={(e) => handleDeleteClick(workspaceItem, e)}
                                  className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                >
                                  <Trash2 size={16} className="mr-2" />
                                  Delete
                                </button>
                              </div>
                            )}
                            <div className={`flex justify-center items-center w-5 h-5 rounded-full  ${workspace && workspace.id === workspaceItem.id ? "bg-purple-500":"bg-transparent"}`}>
                              {workspace && workspace.id === workspaceItem.id && (
                                <FaCheck className="text-white text-sm" />
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4">
                        {searchQuery ? (
                          <p className="text-gray-500 text-sm">
                            No workspaces found for "{searchQuery}"
                          </p>
                        ) : (
                          <p className="text-gray-500 text-sm">No workspaces found.</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div 
                  className="p-2 hover:bg-gray-50 cursor-pointer flex items-center justify-between border-t border-gray-100"
                  onClick={handleNewWorkspaceClick}
                >
                  <span className="text-sm text-gray-700">+ New Workspace</span>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-1 mt-2">
            {menuItems
              .filter((item) => item.canShow) 
              .map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setActive(item.path)}
                  className={`w-full p-2 text-left rounded flex items-center gap-2 transition-all ${
                    active === item.path ? "bg-purple-600 text-white" : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <span className={`${active === item.path ? "text-white" : "text-gray-500"}`}>
                    {item.icon}
                  </span>
                  <span className="text-sm">{item.name}</span>
                </Link>
              ))}
          </div>
        </nav>
      </aside>
      
      {/* Modal for creating new workspace */}
      <WorkspaceModal 
        isOpen={isNewWorkspaceModalOpen} 
        onClose={handleCloseNewWorkspaceModal}
      />

      {/* Modal for editing workspace */}
      <WorkspaceModal 
        isOpen={isEditModalOpen} 
        onClose={handleCloseEditModal}
        editWorkspace={workspaceToEdit}
      />

      {/* Modal for deleting workspace */}
      <DeleteWorkspaceModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        workspaceName={workspaceToDelete?.name}
        isDeleting={isDeletingWorkspace}
      />
    </>
  );
}