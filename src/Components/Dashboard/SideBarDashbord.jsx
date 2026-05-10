import { useState, useEffect, useRef, useMemo } from "react";
import { Calendar, Layout, FileText, User, ChevronUp, ChevronDown, ChartBar, Clock5, Users } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaCheck } from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux';
import { getWorkspace, deleteWorkspace } from '../../redux/apiCalls/workspaceCallApi';
import { workspaceAction } from '../../redux/slices/workspaceSlice';
import WorkspaceModal from "./AddMenus/ModelsForAdd/NewWorkspace";
import DeleteWorkspaceModal from "./DeleteWorkspaceModal";
import WorkspaceList from "./WorkspaceList";
import { usePermission } from "../hooks/usePermission";
import toast from "react-hot-toast";
import logo from '../../assets/image/Appoint Roll logo-svg.svg';

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
  const menuRef = useRef(null);
  const toggleButtonRef = useRef(null);
  const manualWorkspaceSelection = useRef(false);
  const dispatch = useDispatch();

  const { workspaces, workspace } = useSelector(state => state.workspace);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getWorkspace({ force: true }));

    const handleClickOutside = (event) => {
      if (event.clientX >= document.documentElement.clientWidth) return;
      if (event.clientY >= document.documentElement.clientHeight) return;
      if (!event.target || !document.body.contains(event.target)) return;

      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuId(null);
      }
      if (
        mySpaceRef.current &&
        !mySpaceRef.current.contains(event.target) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(event.target)
      ) {
        setIsWorkspaceOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dispatch]);

  useEffect(() => {
    if (!isEditModalOpen && !isNewWorkspaceModalOpen && !isDeleteModalOpen) {
      dispatch(getWorkspace({ force: true })).then((result) => {
        if (workspace && workspace.id !== 0) {
          const updatedList = result?.payload?.data || result?.payload || [];
          const updatedWorkspace = updatedList.find(w => w.id === workspace.id);
          if (updatedWorkspace) {
            dispatch(workspaceAction.setWorkspace(updatedWorkspace));
          }
        }
      });
    }
  }, [isEditModalOpen, isNewWorkspaceModalOpen, isDeleteModalOpen, dispatch]);

  useEffect(() => {
    const currentPath = location.pathname.includes("interviews")
      ? "interviews"
      : location.pathname.includes("booking-pages") || location.pathname.includes("bookPage")
      ? "bookPage"
      : location.pathname.includes("analytics")
      ? "analytics"
      : location.pathname.includes("my-profile") || location.pathname.includes("profilepage")
      ? "profilepage"
      : location.pathname.includes("userDashboard")
      ? "userDashboard"
      : location.pathname.includes("WorkspaceAvailability")
      ? "WorkspaceAvailability"
      : location.pathname.includes("recruiter")
      ? "recruiterPage"
      : location.pathname === "/layoutDashboard"
      ? "analytics"
      : "";

    setActive(currentPath);
  }, [location.pathname]);

  const canViewAppointments = usePermission("view appointment");
  const canViewInterview = usePermission("view interview");
  const canViewClients = usePermission("view clients");
  const canViewStaff = usePermission("view staff");
  const canViewAnalytics = canViewAppointments || canViewInterview || canViewClients || canViewStaff;

  const menuItems = [
    { name: "My Profile", icon: <User size={18} />, path: "profilepage", canShow: true },
    { name: "Analytics", icon: <ChartBar size={18} />, path: "analytics", canShow: canViewAnalytics },
    { name: "Appointments", icon: <Calendar size={18} />, path: "userDashboard", canShow: canViewAppointments },
    { name: "Interviews", icon: <FileText size={18} />, path: "interviews", canShow: canViewInterview },
    { name: "Users", icon: <Users size={18} />, path: "users", canShow: canViewStaff },
    { name: "Booking Pages", icon: <Layout size={18} />, path: "bookPage", canShow: true },
    {
      name: "Availability Workspace",
      icon: <Clock5 size={18} />,
      path: "WorkspaceAvailability",
      canShow: workspace && workspace.id !== 0,
    },
  ];

  useEffect(() => {
    const visibleItems = menuItems.filter(item => item.canShow);
    if (visibleItems.length > 0 && !active) {
      setActive(prev => {
        if (prev) return prev;
        const stillVisible = visibleItems.some(item => item.path === prev);
        return stillVisible ? prev : visibleItems[0].path;
      });
    }
  }, [canViewAnalytics, canViewAppointments, canViewInterview, canViewClients, canViewStaff]);

  const filteredWorkspaces = useMemo(() => {
    if (!workspaces || !Array.isArray(workspaces)) return [];
    if (!searchQuery.trim()) return workspaces;
    const query = searchQuery.toLowerCase();
    return workspaces.filter(ws => ws?.name?.toLowerCase().includes(query));
  }, [workspaces, searchQuery]);

  const toggleWorkspaceDropdown = () => {
    setIsWorkspaceOpen(prev => !prev);
    if (isWorkspaceOpen) setSearchQuery('');
  };

  const handleSelectWorkspace = (selectedWorkspace) => {
    dispatch(workspaceAction.setWorkspace(selectedWorkspace));
    if (selectedWorkspace.id !== 0) {
      setActive("WorkspaceAvailability");
      navigate("WorkspaceAvailability");
    }
    setIsWorkspaceOpen(false);
    setSearchQuery('');
  };

  const handleSelectMySpace = () => {
    manualWorkspaceSelection.current = true;
    dispatch(workspaceAction.setWorkspace({ id: 0, name: "My Space" }));
    if (location.pathname.includes("WorkspaceAvailability")) {
      navigate("profilepage");
      setActive("profilepage");
    }
    setIsWorkspaceOpen(false);
    setSearchQuery('');
  };

  const handleNewWorkspaceClick = () => {
    setIsNewWorkspaceModalOpen(true);
    setIsWorkspaceOpen(false);
    setSearchQuery('');
  };

  const handleDeleteClick = (workspaceItem, e) => {
    e.stopPropagation();
    setWorkspaceToDelete(workspaceItem);
    setIsDeleteModalOpen(true);
    setActiveMenuId(null);
  };

  const handleConfirmDelete = async () => {
    if (!workspaceToDelete) return;
    setIsDeletingWorkspace(true);
    try {
      const response = await dispatch(deleteWorkspace(workspaceToDelete.id));
      if (response?.success) {
        if (workspace && workspace.id === workspaceToDelete.id) {
          dispatch(workspaceAction.setWorkspace({ id: 0, name: "My Space" }));
          if (location.pathname.includes("WorkspaceAvailability")) {
            navigate("profilepage");
            setActive("profilepage");
          }
        }
      } else {
        toast.error(response?.message || "Failed to delete workspace");
      }
    } catch (error) {
      console.error("Error deleting workspace:", error);
      toast.error("An error occurred while deleting the workspace");
    } finally {
      setIsDeletingWorkspace(false);
      setIsDeleteModalOpen(false);
      setWorkspaceToDelete(null);
    }
  };

  return (
    <>
      <aside className="w-full h-[100vh] bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 pb-[0.5rem] pt-1 border-b border-gray-200">
          <Link to="Profilepage" className="flex align-center justify-left text-blue-600">
            <img
              src={logo}
              alt="Logo"
              className="flex-1 h-[2.9rem] w-[45%] object-cover relative right-4"
            />
          </Link>
        </div>

        <nav className="flex-1 p-2">
          <div>
            <button
              ref={toggleButtonRef}
              onClick={toggleWorkspaceDropdown}
              className="bg-purple-100 w-full p-2 text-left rounded hover:bg-gray-100 flex items-center gap-2 justify-between"
            >
              <span className="text-purple-600 text-sm font-semibold truncate max-w-[150px]">
                {workspace ? workspace.name : "My Space"}
              </span>
              {isWorkspaceOpen
                ? <ChevronUp className="text-purple-600" />
                : <ChevronDown className="text-purple-600" />}
            </button>

            {isWorkspaceOpen && (
              <div
                ref={mySpaceRef}
                onMouseDown={(e) => e.stopPropagation()}
                className="flex flex-col justify-between mt-2 bg-white border border-gray-200 rounded-lg shadow-sm fixed left-0 h-80 w-full p-1 z-50"
              >
                <div className="h-[85%] overflow-auto">
                  {/* My Space */}
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
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        ×
                      </button>
                    )}
                  </div>

                  {searchQuery && (
                    <div className="mb-2 px-2">
                      <p className="text-xs text-gray-500">
                        {filteredWorkspaces.length} workspace{filteredWorkspaces.length !== 1 ? 's' : ''} found
                      </p>
                    </div>
                  )}

                  {/* Workspace List with drag-and-drop */}
                  <WorkspaceList
                    filteredWorkspaces={filteredWorkspaces}
                    searchQuery={searchQuery}
                    activeMenuId={activeMenuId}
                    setActiveMenuId={setActiveMenuId}
                    menuRef={menuRef}
                    onEditClick={(ws) => {
                      setWorkspaceToEdit(ws);
                      setIsEditModalOpen(true);
                    }}
                    onDeleteClick={handleDeleteClick}
                    onSelectWorkspace={handleSelectWorkspace}
                  />
                </div>

                {/* New Workspace */}
                <div
                  className="p-2 hover:bg-gray-50 cursor-pointer flex items-center justify-between border-t border-gray-100"
                  onClick={handleNewWorkspaceClick}
                >
                  <span className="text-sm text-gray-700">+ New Workspace</span>
                </div>
              </div>
            )}
          </div>

          {/* Nav Items */}
          <div className="space-y-1 mt-2">
            {menuItems
              .filter(item => item.canShow)
              .map(item => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setActive(item.path)}
                  className={`w-full p-2 text-left rounded flex items-center gap-2 transition-all ${
                    active === item.path
                      ? "bg-purple-600 text-white"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <span className={active === item.path ? "text-white" : "text-gray-500"}>
                    {item.icon}
                  </span>
                  <span className="text-sm truncate max-w-[150px]">{item.name}</span>
                </Link>
              ))}
          </div>
        </nav>
      </aside>

      <WorkspaceModal
        isOpen={isNewWorkspaceModalOpen}
        onClose={() => setIsNewWorkspaceModalOpen(false)}
      />
      <WorkspaceModal
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); setWorkspaceToEdit(null); }}
        editWorkspace={workspaceToEdit}
      />
      <DeleteWorkspaceModal
        isOpen={isDeleteModalOpen}
        onClose={() => { setIsDeleteModalOpen(false); setWorkspaceToDelete(null); }}
        onConfirm={handleConfirmDelete}
        workspaceName={workspaceToDelete?.name}
        isDeleting={isDeletingWorkspace}
      />
    </>
  );
}