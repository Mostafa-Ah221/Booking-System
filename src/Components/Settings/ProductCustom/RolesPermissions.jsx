import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Edit2, Trash2, Eye, Shield, Lock, X, Plus, MoreVertical } from 'lucide-react';
import { getRoles, deleteRoleById } from "../../../redux/apiCalls/RolesCallApli";
import RoleModal from '../../Dashboard/AddMenus/ModelsForAdd/NewRoleModal';
import { usePermission } from '../../hooks/usePermission';
import Loader from '../../Loader';

// DeleteConfirmationModal Component
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, roleName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <div className="flex justify-center mb-3 sm:mb-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center">
            <Trash2 className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
          </div>
        </div>

        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 text-center mb-2">
          Delete Role
        </h2>

        <p className="text-sm sm:text-base text-gray-600 text-center mb-4 sm:mb-6">
          Sure you want to delete "<span className="font-medium">{roleName}</span>" role?
        </p>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
          <button
            onClick={onConfirm}
            className="w-full sm:w-auto bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors font-medium text-sm"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="w-full sm:w-auto bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors font-medium text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const RolesPermissions = () => {
  const [expandedFeatures, setExpandedFeatures] = useState({});
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [editRole, setEditRole] = useState(null); 
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [openActionMenus, setOpenActionMenus] = useState({});

  const dispatch = useDispatch();

  const { roles, loading, error } = useSelector((state) => state.roles);
  
  // تأكد من البيانات الصحيحة
  const rolesData = Array.isArray(roles) ? roles : (roles?.data ? roles.data : []);
  
  console.log('Roles from Redux:', roles);
  console.log('Roles Data:', rolesData);
  
  // Get permissions
  const canEditRole = usePermission("edit roles");
  const canDeleteRole = usePermission("destroy roles");
  const canCreateRole = usePermission("create roles");

  useEffect(() => {
    dispatch(getRoles());
  }, [dispatch]);

  // Filter roles based on search term
  const filteredRoles = useMemo(() => {
    if (!searchTerm.trim()) return rolesData;
    
    return rolesData.filter(role => 
      role.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.permissions?.some(permission => 
        permission.tag_description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [rolesData, searchTerm]);

  // Handle action functions
  const handleEdit = (roleId, roleName) => {
    const role = rolesData.find(r => r.id === roleId);
    setEditRole(role);
    setIsRoleModalOpen(true);
    setOpenActionMenus({});
  };

  const handleNewRole = () => {
    setEditRole(null);
    setIsRoleModalOpen(true);
  };

  // فتح مودال التأكيد للحذف
  const handleDelete = (roleId, roleName) => {
    setRoleToDelete({ id: roleId, name: roleName });
    setIsDeleteModalOpen(true);
    setOpenActionMenus({});
  };

  // تنفيذ عملية الحذف
  const confirmDelete = async () => {
    if (roleToDelete) {
      try {
        await dispatch(deleteRoleById(roleToDelete.id));
        dispatch(getRoles());
        setIsDeleteModalOpen(false);
        setRoleToDelete(null);
      } catch (error) {
        console.error('Error deleting role:', error);
      }
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setRoleToDelete(null);
  };

  const toggleFeature = (roleId) => {
    setExpandedFeatures(prev => ({
      ...prev,
      [roleId]: !prev[roleId]
    }));
  };

  const toggleDropdown = (roleId) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [roleId]: !prev[roleId]
    }));
  };

  const toggleActionMenu = (roleId) => {
    setOpenActionMenus(prev => ({
      ...prev,
      [roleId]: !prev[roleId]
    }));
  };

  const handleModalClose = () => {
    setIsRoleModalOpen(false);
    setEditRole(null);
    // Refresh roles after modal closes
    dispatch(getRoles());
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-semibold mb-4">Roles and Permissions</h1>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:max-w-xs">
              <input
                type="text"
                placeholder="Search Role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <svg className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            
            {/* New Role Button */}
            {canCreateRole && (
              <button
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                onClick={handleNewRole}
              >
                <Plus className="w-4 h-4" />
                <span>New Role</span>
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white shadow-lg rounded-lg">
          {/* Table Header */}
          <div className="px-4 sm:px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">
              System Roles
              {searchTerm && (
                <span className="text-xs sm:text-sm font-normal text-gray-600 ml-2">
                  ({filteredRoles.length} of {rolesData.length} roles)
                </span>
              )}
            </h2>
          </div>
          
          {loading ? (
            <div className="p-8 flex items-center justify-center">
              <Loader />
            </div>
          ) : filteredRoles.length === 0 ? (
            <div className="px-6 py-12 text-center">
              {searchTerm ? (
                <div>
                  <p className="text-gray-500 mb-2 text-sm sm:text-base">No roles found matching "{searchTerm}"</p>
                  <button
                    onClick={() => setSearchTerm('')}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Clear search
                  </button>
                </div>
              ) : (
                <p className="text-gray-500 text-sm sm:text-base">No roles available</p>
              )}
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block ">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permissions</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredRoles.map((role, index) => (
                      <tr key={role.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors`}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {index + 1 || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                              <span className="text-indigo-600 font-medium text-sm">
                                {role.name ? role.name.charAt(0).toUpperCase() : '?'}
                              </span>
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900 capitalize">
                                {role.name || 'Unknown Role'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap relative">
                          <button
                            onClick={() => toggleDropdown(role.id)}
                            className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                          >
                            <Shield className="h-3 w-3 mr-1" />
                            {role.permissions?.length || 0} permissions
                            <Eye className="h-3 w-3 ml-1" />
                          </button>
                          
                          {openDropdowns[role.id] && (
                            <div 
                              className="absolute top-full left-0 mt-1 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                                <h4 className="text-sm font-semibold text-gray-800 flex items-center">
                                  <Lock className="h-4 w-4 mr-2 text-blue-600" />
                                  Permissions for "{role.name}"
                                </h4>
                              </div>
                              
                              <div className="max-h-48 overflow-y-auto">
                                {role.permissions && role.permissions.length > 0 ? (
                                  role.permissions.map((permission) => (
                                    <div 
                                      key={permission.id} 
                                      className="px-3 py-2 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                                    >
                                      <div className="flex items-start space-x-3">
                                        <div className="flex-shrink-0 mt-1.5">
                                          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm font-medium text-gray-900">
                                            {permission.tag_description || 'No description'}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="p-4 text-center text-gray-500">
                                    <Shield className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                                    <p className="text-sm">No permissions assigned</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {role.created_at ? new Date(role.created_at).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            {canEditRole && (
                              <button
                                onClick={() => handleEdit(role.id, role.name)}
                                className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-100 transition-colors"
                                title="Edit Role"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                            )}
                            {canDeleteRole && (
                              <button
                                onClick={() => handleDelete(role.id, role.name)}
                                className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100 transition-colors"
                                title="Delete Role"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile/Tablet Card View */}
              <div className="lg:hidden divide-y divide-gray-200">
                {filteredRoles.map((role, index) => (
                  <div key={role.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                    {/* Header Row */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center flex-1 min-w-0">
                        <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-indigo-600 font-medium">
                            {role.name ? role.name.charAt(0).toUpperCase() : '?'}
                          </span>
                        </div>
                        <div className="ml-3 flex-1 min-w-0">
                          <h3 className="text-base font-semibold text-gray-900 capitalize truncate">
                            {role.name || 'Unknown Role'}
                          </h3>
                          <p className="text-xs text-gray-500 mt-0.5">
                            ID: {index + 1}
                          </p>
                        </div>
                      </div>
                      
                      {/* Actions Menu */}
                      <div className="relative ml-2">
                        <button
                          onClick={() => toggleActionMenu(role.id)}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <MoreVertical className="h-5 w-5 text-gray-500" />
                        </button>
                        
                        {openActionMenus[role.id] && (
                          <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                            {canEditRole && (
                              <button
                                onClick={() => handleEdit(role.id, role.name)}
                                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <Edit2 className="h-4 w-4 mr-2" />
                                Edit
                              </button>
                            )}
                            {canDeleteRole && (
                              <button
                                onClick={() => handleDelete(role.id, role.name)}
                                className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Permissions Badge */}
                    <button
                      onClick={() => toggleDropdown(role.id)}
                      className="w-full mb-3 inline-flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      {role.permissions?.length || 0} permissions
                      <Eye className="h-4 w-4 ml-2" />
                    </button>

                    {/* Expanded Permissions */}
                    {openDropdowns[role.id] && (
                      <div className="mb-3 bg-gray-50 rounded-lg p-3 space-y-2">
                        <div className="flex items-center mb-2">
                          <Lock className="h-4 w-4 mr-2 text-blue-600" />
                          <span className="text-sm font-semibold text-gray-800">Permissions:</span>
                        </div>
                        {role.permissions && role.permissions.length > 0 ? (
                          role.permissions.map((permission) => (
                            <div key={permission.id} className="flex items-start space-x-2 pl-2">
                              <div className="flex-shrink-0 mt-1.5">
                                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                              </div>
                              <p className="text-sm text-gray-700">
                                {permission.tag_description || 'No description'}
                              </p>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500 text-center py-2">No permissions assigned</p>
                        )}
                      </div>
                    )}

                    {/* Created Date */}
                    <div className="text-xs text-gray-500">
                      Created: {role.created_at ? new Date(role.created_at).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Click outside to close dropdowns */}
          {(Object.keys(openDropdowns).some(key => openDropdowns[key]) || 
            Object.keys(openActionMenus).some(key => openActionMenus[key])) && (
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => {
                setOpenDropdowns({});
                setOpenActionMenus({});
              }}
            ></div>
          )}
        </div>
      </div>

      {/* مودال التعديل والإضافة */}
      <RoleModal
        isOpen={isRoleModalOpen} 
        onClose={handleModalClose} 
        editRole={editRole} 
      />

      {/* مودال تأكيد الحذف */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        roleName={roleToDelete?.name}
      />
    </div>
  );
};

export default RolesPermissions;