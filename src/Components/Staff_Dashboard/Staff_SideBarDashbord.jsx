import { useState, useEffect, useRef, useMemo } from "react";
import { Calendar, FileText, User, ChevronUp, ChevronDown, Bell} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaCheck } from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux';
import { workspaceAction } from '../../redux/slices/workspaceSlice';
import { staff_GetWorkspaces } from "../../redux/apiCalls/StaffapiCalls/StaffapiCalls";
import logo from '../../assets/image/logo.png';

export default function StaffSideBarDashboard({selectWorkspace}) {
  const location = useLocation();
  const [active, setActive] = useState("");
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  
  const mySpaceRef = useRef(null);
  const menuRef = useRef(null);

  const dispatch = useDispatch();
  const { workspace } = useSelector(state => state.workspace);
  const navigate = useNavigate();
  const { staff_workspaces = [] } = useSelector(state => state.staffApis || {});

  useEffect(() => {
    dispatch(staff_GetWorkspaces());

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
  }, [dispatch]);

  useEffect(() => {
    const currentPath = location.pathname.includes("Staff_Interviews")
  ? "Staff_Interviews"
       : location.pathname.includes("Staff_Profilepage") || location.pathname.includes("Staff_Profilepage")
      ? "Staff_Profilepage"
       : location.pathname.includes("Staff_Analytics") || location.pathname.includes("Staff_Analytics")
      ? "Staff_Analytics"
       : location.pathname.includes("Staff_Notifications") || location.pathname.includes("Staff_Notifications")
      ? "Staff_Notifications"
       : location.pathname.includes("Staff_Availability") || location.pathname.includes("Staff_Availability")
      ? "Staff_Availability"
      : location.pathname.includes("Staff_Appointment")
      ? "Staff_Appointment"
      : "Staff_Profilepage";
    
    setActive(currentPath);
  }, [location.pathname]);

  const menuItems = [
    { name: "My Profile", icon: <User size={18} />, path: "Staff_Profilepage" },
    { name: "Analytics", icon: <User size={18} />, path: "Staff_Analytics" },
    { name: "Availability", icon: <User size={18} />, path: "Staff_Availability" },
    { name: "Appointments", icon: <Calendar size={18} />, path: "Staff_Appointment" },
    { name: "Interviews", icon: <FileText size={18} />, path: "Staff_Interviews" },
    { name: "Product Notifications", icon: <Bell size={18} />, path: "Staff_Notifications" },
  ];

  const workspaceDataRef = useRef(staff_workspaces);

  useEffect(() => {
    if (staff_workspaces && staff_workspaces.length > 0) {
      workspaceDataRef.current = staff_workspaces;
    }
  }, [staff_workspaces]);

  const filteredWorkspaces = useMemo(() => {
    const dataToUse = (staff_workspaces && staff_workspaces.length > 0) ? staff_workspaces : workspaceDataRef.current;
    
    if (!dataToUse || !Array.isArray(dataToUse)) {
      return [];
    }
    
    if (!searchQuery.trim()) return dataToUse;
    
    const query = searchQuery.toLowerCase();
    return dataToUse.filter(workspaceItem => 
      workspaceItem && workspaceItem.name && 
      workspaceItem.name.toLowerCase().includes(query)
    );
  }, [staff_workspaces, searchQuery]);

  const toggleWorkspaceDropdown = () => {
    setIsWorkspaceOpen(prev => !prev);
    if (isWorkspaceOpen) {
      setSearchQuery('');
    }
  };


  const handleSelectWorkspace = (selectedWorkspace) => {
    dispatch(workspaceAction.setWorkspace(selectedWorkspace)); 
    selectWorkspace(selectedWorkspace?.id);
    setIsWorkspaceOpen(false);
    setSearchQuery('');
  };

  const handleSelectMySpace = () => {
    const mySpace = {
      id: 0,
      name: "My Space"
    }; 
    selectWorkspace(0);
    dispatch(workspaceAction.setWorkspace(mySpace));
    
    if (location.pathname.includes("WorkspaceAvailability")) {
      navigate("profilepage");
      setActive("profilepage");
    }
    
    setIsWorkspaceOpen(false);
    setSearchQuery('');
  };

  

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

 

  return (
    <>
      <aside className="w-full h-[100vh] bg-white border-r border-gray-200 flex flex-col">
         <div className="p-4 pb-[0.5rem] pt-2  border-b border-gray-200">
                  <Link to="Staff_Profilepage" className="flex align-center justify-left text-blue-600">
                   
                    <img 
                      src={logo} 
                      alt="Logo" 
                      className="flex-1 h-10 w-[45%] object-cover relative right-4 " 
                    />
                  
                  </Link>
                </div>

        <nav className="flex-1 p-2">
          <div>
            <button
              onClick={toggleWorkspaceDropdown}
              className="bg-purple-100 w-full p-2 text-left rounded hover:bg-gray-100 flex items-center gap-2 justify-between"
            >
              <span className="text-purple-600 text-sm font-semibold truncate  max-w-[150px]">
                {workspace ? workspace.name : "My Space"}
              </span>
              {isWorkspaceOpen ? <ChevronUp className="text-purple-600" /> : <ChevronDown className="text-purple-600" />}
            </button>

            {isWorkspaceOpen && (
              <div
                ref={mySpaceRef}
                className="flex flex-col justify-between mt-2 bg-white border border-gray-200 rounded-lg shadow-sm fixed left-0 h-80 w-full p-1 z-50"
              >
                <div className='h-[85%] overflow-auto'>
                  <div 
                    className="p-2 border-b border-gray-100 flex items-center justify-between mb-2 cursor-pointer hover:bg-purple-50 rounded-md"
                    onClick={handleSelectMySpace}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 text-sm bg-pink-200 rounded-full flex items-center justify-center text-pink-600 font-bold">
                        MS
                      </div>
                      <span className="font-semibold text-gray-800">My Space</span>
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
                      filteredWorkspaces.map((workspaceItem) => (
                        <div 
                          key={workspaceItem.id} 
                          className={`cursor-pointer p-2 my-1 rounded-md border-b border-gray-100 flex items-center justify-between ${workspace && workspace.id === workspaceItem.id ? "bg-purple-100" : "bg-transparent"} hover:bg-purple-50`}
                          onClick={() => handleSelectWorkspace(workspaceItem)}
                        >
                          <div className="flex items-center flex-col gap-2">
                            <div className="flex gap-2 items-center">
                              <div className="w-6 h-6 bg-pink-200 rounded-full flex items-center justify-center text-pink-600 font-bold">
                                {workspaceItem.name?.slice(0, 1).toUpperCase()}
                              </div>
                              <div className="truncate  max-w-[150px]">
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
                          </div>
                          <div className="flex gap-2 items-center relative">
                            <div className={`flex justify-center items-center w-5 h-5 rounded-full ${workspace && workspace.id === workspaceItem.id ? "bg-purple-500" : "bg-transparent"}`}>
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
              </div>
            )}
          </div>

          <div className="space-y-1 mt-2">
            {menuItems.map((item) => (
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
                <span className="text-sm truncate  max-w-[150px]">{item.name}</span>
              </Link>
            ))}
          </div>
        </nav>
      </aside>
    </>
  );
}