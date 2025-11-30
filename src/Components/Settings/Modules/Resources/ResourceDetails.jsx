import { useState, useEffect, useCallback } from 'react';
import ResourceAvailability from './ResourceAvailability';
import AssignedResource from './AssignedResource';
import { VscEdit } from "react-icons/vsc";
import { HiOutlineChevronLeft } from "react-icons/hi2";
import { useDispatch, useSelector } from 'react-redux';
import { updateResource, getResourceById } from '../../../../redux/apiCalls/ResourceCallApi';
import { getAllWorkspaces } from '../../../../redux/apiCalls/workspaceCallApi';

const WorkspaceCheckboxes = ({ workspaces, selectedIds, onChange, disabled }) => {
  const handleToggle = (workspaceId) => {
    if (selectedIds.includes(workspaceId)) {
      // Remove from array
      onChange(selectedIds.filter(id => id !== workspaceId));
    } else {
      // Add to array
      onChange([...selectedIds, workspaceId]);
    }
  };

  return (
    <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-300 rounded-lg p-4 bg-white">
      {workspaces && workspaces.length > 0 ? (
        workspaces.map((workspace) => (
          <label 
            key={workspace.id}
            className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer transition-colors"
          >
            <input
              type="checkbox"
              checked={selectedIds.includes(workspace.id)}
              onChange={() => handleToggle(workspace.id)}
              disabled={disabled}
              className="w-3 h-3 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2 cursor-pointer"
            />
            <span className="text-sm text-gray-900 font-medium truncate block max-w-[150px]">
              {workspace.name}
            </span>
          </label>
        ))
      ) : (
        <p className="text-sm text-gray-500 text-center py-2">No workspaces available</p>
      )}
    </div>
  );
};

const DisplayView = ({ formData, onEdit }) => (
  <div className="px-6 py-6 bg-gray-50">
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
        <div className="w-full lg:flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2.5">Resource Name</p>
              <p className="text-sm text-gray-900 font-medium truncate block max-w-[150px]">{formData.name}</p>
            </div>

            <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-2.5">Work Spaces</p>
                {formData.work_spaces && formData.work_spaces.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {formData.work_spaces.map((workspace) => (
                      <span 
                        key={workspace.id}
                        className="inline-flex items-center truncate  max-w-[150px] px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700"
                      >
                        {workspace.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Not assigned</p>
                )}
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 mb-2.5">Status</p>
                <div className="flex gap-2.5">
                  <button
                    disabled
                    className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all cursor-default ${
                      formData.status
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    Active
                  </button>
                  <button
                    disabled
                    className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all cursor-default ${
                      !formData.status
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    Inactive
                  </button>
                </div>
              </div>
            </div>

            <div className="col-span-1 md:col-span-2">
              <p className="text-xs font-medium text-gray-500 mb-2.5">Description</p>
              <p className="text-sm text-gray-700 leading-relaxed">
                {formData.description || 'No description available'}
              </p>
            </div>
          </div>
        </div>
        <button 
          onClick={onEdit}
          className="px-5 py-1 text-sm border border-indigo-600 rounded-lg flex items-center gap-2 hover:bg-indigo-600 hover:text-white text-indigo-600 transition-all font-medium self-start group"
        >
          <VscEdit className='w-4 h-4 group-hover:scale-110 transition-transform' />
          Edit
        </button>
      </div>
    </div>
  </div>
);

// ✅ Edit View مع الـ Checkboxes
const EditView = ({ formData, setFormData, loading, allWorkspaces, onCancel, onSave }) => (
  <div className="px-6 py-6 bg-gray-50">
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className=" text-xs font-semibold text-gray-700 mb-2.5 truncate block max-w-[150px]">
            Resource Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white placeholder-gray-400"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            disabled={loading}
            placeholder="Enter resource name"
          />
        </div>
        
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2.5">Status</label>
          <div className="inline-flex rounded-lg border border-gray-300 overflow-hidden">
            <button
              className={`w-32 px-2 py-2.5 text-sm font-medium transition-all border-r border-gray-300 ${
                formData.status
                  ? "bg-indigo-200 text-blue-600 shadow-sm"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setFormData({ ...formData, status: true })}
              disabled={loading}
            >
              Active
            </button>

            <button
              className={`w-32 px-2 py-2.5 text-sm font-medium transition-all ${
                !formData.status
                  ? "bg-indigo-200 text-blue-600 shadow-sm"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setFormData({ ...formData, status: false })}
              disabled={loading}
            >
              Inactive
            </button>
          </div>
        </div>
        
        <div className="col-span-1 md:col-span-2">
          <label className="block text-xs font-semibold text-gray-700 mb-2.5">
            Work Spaces <span className="text-red-500">*</span>
          </label>
          <WorkspaceCheckboxes
            workspaces={allWorkspaces}
            selectedIds={formData.work_space_id}
            onChange={(newIds) => setFormData({...formData, work_space_id: newIds})}
            disabled={loading}
          />
          {formData.work_space_id && formData.work_space_id.length > 0 && (
            <p className="text-xs text-gray-500 mt-2">
              {formData.work_space_id.length} workspace(s) selected
            </p>
          )}
        </div>
        
        <div className="col-span-1 md:col-span-2">
          <label className="block text-xs font-semibold text-gray-700 mb-2.5">Description</label>
          <textarea
            className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all placeholder-gray-400"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows="4"
            disabled={loading}
            placeholder="Enter description"
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
        <button 
          onClick={onCancel} 
          className="px-6 py-2.5 text-sm border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all font-medium text-gray-700"
          disabled={loading}
        >
          Cancel
        </button>
        <button 
          onClick={onSave} 
          className="px-6 py-2.5 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-sm hover:shadow-md"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  </div>
);

// ✅ Main Component
const ResourceDetails = ({ resource, onBack }) => {
  const dispatch = useDispatch();
  const { resource: resourceDetails, loading } = useSelector((state) => state.resources);
  const { allWorkspaces } = useSelector((state) => state.workspace);
  
  const [activeTab, setActiveTab] = useState('basic');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    status: true,
    description: '',
    work_space_id: [] // ✅ array بس الاسم work_space_id
  });

  useEffect(() => {
    dispatch(getAllWorkspaces());
  }, [dispatch]);

  useEffect(() => {
    if (resource?.id) {
      dispatch(getResourceById(resource?.id));
    }
  }, [dispatch, resource?.id]);

  // ✅ Update formData when resource changes
  useEffect(() => {
    if (!isEditing && resourceDetails?.resource) {
      setFormData({
        name: resourceDetails.resource.name || '',
        status: resourceDetails.resource.status === "1" || resourceDetails.resource.status === 1 || resourceDetails.resource.status === true,
        description: resourceDetails.resource.description || '',
        work_space_id: resourceDetails.resource.work_spaces?.map(ws => ws.id) || [], // ✅ حوّل لـ array من الـ IDs
        work_spaces: resourceDetails.resource.work_spaces || [] 
      });
    }
  }, [resourceDetails?.resource?.id, isEditing]);

  // ✅ Handle Save
  const handleSave = useCallback(async () => {
    const dataToUpdate = {
      name: formData.name,
      description: formData.description,
      status: formData.status ? 1 : 0,
      work_space_id: formData.work_space_id 
    };

    const result = await dispatch(updateResource(resourceDetails.resource.id, dataToUpdate));
    
    if (result?.success) {
      await dispatch(getResourceById(resource?.id));
      setIsEditing(false);
    }
  }, [formData, dispatch, resourceDetails?.resource?.id, resource?.id]);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  // ✅ Handle Cancel
  const handleCancel = useCallback(() => {
    setIsEditing(false);
    // Reset form data to original values
    if (resourceDetails?.resource) {
      setFormData({
        name: resourceDetails.resource.name || '',
        status: resourceDetails.resource.status === "1" || resourceDetails.resource.status === 1 || resourceDetails.resource.status === true,
        description: resourceDetails.resource.description || '',
        work_space_id: resourceDetails.resource.work_spaces?.map(ws => ws.id) || [], // ✅ array
        work_spaces: resourceDetails.resource.work_spaces || [] 
      });
    }
  }, [resourceDetails?.resource]);

  const Header = () => (
    <div className="border-b bg-white">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack} 
            className="text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            <HiOutlineChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <span className="text-purple-600 font-semibold text-sm">
                {formData.name?.substring(0, 2).toUpperCase() || 'RS'}
              </span>
            </div>
            <span className="font-semibold text-gray-900 text-lg truncate  max-w-[150px]">{formData.name}</span>
          </div>
        </div>
      </div>
      
      <div className="flex overflow-x-auto whitespace-nowrap px-4 sm:px-6">
        <button 
          onClick={() => setActiveTab('basic')} 
          className={`pb-3 px-4 text-sm font-medium transition-colors ${activeTab === 'basic' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Basic Information
        </button>
        <button 
          onClick={() => setActiveTab('assigned')} 
          className={`pb-3 px-4 text-sm font-medium transition-colors ${activeTab === 'assigned' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Assigned Interviews
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full mx-auto border border-gray-200 rounded-lg bg-white shadow-sm">
      <Header />
      {activeTab === 'basic' && (
        isEditing ? (
          <EditView 
            formData={formData}
            setFormData={setFormData}
            loading={loading}
            allWorkspaces={allWorkspaces}
            onCancel={handleCancel}
            onSave={handleSave}
          />
        ) : (
          <DisplayView 
            formData={formData}
            onEdit={handleEdit}
          />
        )
      )}
      {activeTab === 'assigned' && <AssignedResource resource={resourceDetails?.resource} />}
    </div>
  );
};

export default ResourceDetails;