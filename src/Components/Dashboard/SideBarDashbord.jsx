import React, { useState, useEffect, useRef } from "react";
import { Calendar, Layout, FileText, User, ChevronUp, ChevronDown, Trash2, ChartBar } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { FaCheck } from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux'
import { getWorkspace, deleteWorkspace } from '../../redux/apiCalls/workspaceCallApi'
import { workspaceAction } from '../../redux/slices/workspaceSlice'
import { BsThreeDots } from "react-icons/bs";
import { FiEdit2 } from "react-icons/fi";
import WorkspaceModal from "./AddMenus/ModelsForAdd/NewWorkspace";

export default function SideBarDashbord() {
  const location = useLocation();
  const [active, setActive] = useState("");
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [workspaceToEdit, setWorkspaceToEdit] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNewWorkspaceModalOpen, setIsNewWorkspaceModalOpen] = useState(false);
  const mySpaceRef = useRef(null);

  const dispatch = useDispatch()
  const { workspaces, workspace } = useSelector(state => state.workspace)
 
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
      : "analytics";
  
    setActive(currentPath);
  }, [location.pathname]);
  
  const menuItems = [
    { name: "Analytics", icon: <ChartBar size={18} />, path: "analytics" },
    { name: "Appointments", icon: <Calendar size={18} />, path: "userDashboard" },
    { name: "Interviews", icon: <FileText size={18} />, path: "interviews" },
    { name: "Booking Pages", icon: <Layout size={18} />, path: "bookPage" }, 
    { name: "My Profile", icon: <User size={18} />, path: "profilepage" },
  ];

  const toggleWorkspaceDropdown = () => {
    setIsWorkspaceOpen(!isWorkspaceOpen);
  };

  const handleSelectWorkspace = (selectedWorkspace) => {
    dispatch(workspaceAction.setWorkspace(selectedWorkspace)); 
    setIsWorkspaceOpen(false);
  };

  const handleSelectMySpace = () => {
    const mySpace = {
      id: 0,
      name: "My Space"
    }; 
    dispatch(workspaceAction.setWorkspace(mySpace));
    setIsWorkspaceOpen(false);
  };

  const toggleMenu = (workspaceId, e) => {
    e.stopPropagation(); 
    setActiveMenuId(activeMenuId === workspaceId ? null : workspaceId);
  };

  const handleNewWorkspaceClick = () => {
    setIsNewWorkspaceModalOpen(true);
    setIsWorkspaceOpen(false); // Close the dropdown when opening modal
  };

  const handleCloseNewWorkspaceModal = () => {
    setIsNewWorkspaceModalOpen(false);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setWorkspaceToEdit(null);
  };
  
  return (
    <>
      <aside className="w-full h-[100vh] bg-white border-r border-gray-200 flex flex-col ">
        <div className="p-4 pb-[1.22rem] border-b border-gray-200">
          <div className="flex items-center gap-2 text-blue-600">
          <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1024 1024"
              xmlSpace="preserve"
              width={18}
            >
              <path
                fill="#226DB4"
                d="M995.8,249.6c-16.5-39.1-40.2-74.3-70.4-104.5S860,91.3,820.9,74.7c-13-5.5-26.3-10.1-39.8-13.9V32.9  c0-16.5-13.4-29.9-29.9-29.9s-29.9,13.4-29.9,29.9v17.2c-9.4-0.8-18.9-1.2-28.4-1.2h-301c-16.5,0-29.9,13.4-29.9,29.9  c0,16.5,13.4,29.9,29.9,29.9H693c9.6,0,19,0.5,28.4,1.5v15.3c0,16.5,13.4,29.9,29.9,29.9s29.9-13.4,29.9-29.9v-2  c37.9,13.1,72.7,34.8,102,64c50.8,50.8,78.8,118.3,78.8,190.1v315.4c0,71.8-28,139.3-78.8,190.1c-50.8,50.8-118.3,78.8-190.1,78.8  h-73c-16.5,0-29.9,13.4-29.9,29.9s13.4,29.9,29.9,29.9h73c44.4,0,87.4-8.7,127.9-25.8c39.1-16.5,74.3-40.2,104.5-70.4  s53.9-65.3,70.4-104.5c17.2-40.5,25.8-83.6,25.8-127.9V377.5C1021.6,333.2,1012.9,290.1,995.8,249.6z"
              />
              <path
                fill="#226DB4"
                d="M659.6,692.6c0-44.4-8.7-87.4-25.8-127.9c-11.1-26.2-25.4-50.7-42.7-73l-43.9,40.9c34.2,46,52.7,101.6,52.7,160  c0,71.8-28,139.3-78.8,190.1c-50.8,50.8-118.3,78.8-190.1,78.8s-139.3-28-190.1-78.8c-50.8-50.8-78.8-118.3-78.8-190.1  s28-139.3,78.8-190.1c50.8-50.8,118.3-78.8,190.1-78.8c65.1,0,126.7,23,175.4,65.1l43.9-40.9c-27.1-24.4-57.8-43.9-91.4-58.1  c-40.5-17.2-83.6-25.8-127.9-25.8s-87.4,8.7-127.9,25.8c-39.1,16.5-74.3,40.2-104.5,70.4c-13.5,13.5-25.7,28-36.5,43.3v-126  c0-62.6,22-123.5,61.8-171.6c31.4-37.9,72.7-66.4,118.6-82.4v1.2c0,16.5,13.4,29.9,29.9,29.9s29.9-13.4,29.9-29.9V84.9  c0-0.1,0-0.3,0-0.4V32.3c0-16.5-13.4-29.9-29.9-29.9s-29.9,13.4-29.9,29.9V61c-64,17.9-121.8,55.2-164.6,106.8  c-23.9,28.9-42.6,61.3-55.5,96.3C9.1,300.4,2.4,338.5,2.4,377.5v315.4c0,44.4,8.7,87.4,25.8,127.9c16.5,39.1,40.2,74.3,70.4,104.5  c30.2,30.2,65.3,53.9,104.5,70.4c40.5,17.2,83.6,25.8,127.9,25.8c1.6,0,3.2-0.1,4.8-0.4c42.6-0.6,84-9.2,123.1-25.8  c39.1-16.5,74.3-40.2,104.5-70.4s53.9-65.3,70.4-104.5C651,780,659.6,736.9,659.6,692.6z"
              />
              <path
                fill="#089949"
                d="M332.4,650.7l-76.3-81.4c-11.3-12-30.2-12.7-42.2-1.4c-12,11.3-12.6,30.2-1.4,42.2l96.6,103.1  c5.9,6.3,13.8,9.5,21.8,9.5c7.3,0,14.6-2.7,20.3-8l195.8-182.3l43.9-40.9l56.8-52.9c12.1-11.2,12.8-30.2,1.5-42.2  c-11.2-12.1-30.1-12.8-42.2-1.5l-56.8,52.9l-43.9,40.9L332.4,650.7z"
              />
          </svg>
            <span className="text-xl">Bookings</span>
          </div>
        </div>
        <nav className="flex-1 p-2">
          <div>
            <button
              onClick={toggleWorkspaceDropdown}
              className="bg-purple-100 w-full p-2 text-left rounded hover:bg-gray-100 flex items-center gap-2 justify-between"
            >
              <span className="text-purple-600">
                {workspace ? workspace.name : "My Space"}
              </span>
              {isWorkspaceOpen ? <ChevronUp className="text-purple-600" /> : <ChevronDown className="text-purple-600" />}
            </button>

            {isWorkspaceOpen && (
              <div
                ref={mySpaceRef}
                className="flex flex-col justify-between mt-2 bg-white border border-gray-200 rounded-lg shadow-sm fixed h-80 w-full p-2">
                 <div>
                  <div 
                    className="p-2 border-b border-gray-100 flex items-center justify-between mb-2 cursor-pointer hover:bg-purple-50 rounded-md"
                    onClick={handleSelectMySpace}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-pink-200 rounded-full flex items-center justify-center text-pink-600 font-bold">
                        MS
                      </div>
                      <span className="text-xl font-semibold text-gray-800">My Space</span>
                    </div>
                    <div className="flex justify-center items-center w-4 h-4 rounded-full bg-purple-500">
                      {(!workspace || workspace.id === 0) && (
                        <FaCheck className="text-white text-sm" />
                      )}
                    </div>
                  </div>

                  {/* Search */}
                  <div>
                    <input
                      className="w-full px-2 py-1 rounded-md focus:outline-none border border-purple-800"
                      type="text"
                      placeholder="Search..."
                    />
                  </div>

                  {workspaces.length > 0 ? (
                    workspaces.map((workspaceItem) => (
                      <div 
                        key={workspaceItem.id} 
                        className={`cursor-pointer p-2 my-1 rounded-md border-b border-gray-100 flex items-center justify-between ${workspace && workspace.id === workspaceItem.id ? "bg-purple-100":"bg-transparent"}`}
                        onClick={() => handleSelectWorkspace(workspaceItem)}
                      >
                        <div className="flex items-center flex-col gap-2">
                          <div className="flex gap-2 items-center">
                            <div className="w-6 h-6 bg-pink-200 rounded-full flex items-center justify-center text-pink-600 font-bold">
                              {workspaceItem.name?.slice(0, 1).toUpperCase()}
                            </div>
                            <span className="text-sm text-gray-800">{workspaceItem.name}</span>
                          </div>
                          
                        </div>
                        <div className="flex gap-2 items-center">
                          <div 
                          onClick={(e) => toggleMenu(workspaceItem.id, e)}
                          className={`w-5 h-5 rounded-full flex justify-center items-center border border-transparent hover:border-purple-500 duration-300`}>
                            <BsThreeDots className="text-[13px] cursor-pointers text-purple-500"/>
                          </div>
                          {activeMenuId === workspaceItem.id && (
                            <div ref={menuRef} className="absolute top-12 right-2 bg-white shadow-lg rounded-lg z-10 py-2 w-40">
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
                                onClick={(e) => {
                                  e.stopPropagation();
                                  dispatch(deleteWorkspace(workspaceItem.id));
                                }}
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
                    <p className="text-gray-500 text-center mt-2">No workspaces found.</p>
                  )}
                </div>

                <div 
                  className="p-2 hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                  onClick={handleNewWorkspaceClick}
                >
                  <span className="text-sm text-gray-700">+ New Workspace</span>
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
                <span className={`${active === item.path ? "text-white" : "text-gray-500"}`}>{item.icon}</span>
                <span>{item.name}</span>
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
    </>
  );
}