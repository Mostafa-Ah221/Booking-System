import { useEffect, useState, useRef } from 'react';
import { Monitor, Search, UserRound, X } from 'lucide-react';
import { getAvailableRecourseForWorkspace, getAvailableStaffForWorkspace } from '../../../../redux/apiCalls/workspaceCallApi';
import { useDispatch, useSelector } from 'react-redux';
import profileImg from '../../../../assets/image/profile.png';
import { addNewGroupToInterview, assignInterViewToStaff, updateNewGroupToInterview } from '../../../../redux/apiCalls/interviewCallApi';

export default function AssignGroupsModal({ 
  isOpen, 
  onClose, 
  onComplete, 
  workspaceId, 
  interviewId,
  editingGroup,
  groups,
  interviewType,
  resources: assignedResources = []
}) {
  const [modalSearchQuery, setModalSearchQuery] = useState('');
  const [selectAll, setSelectAll] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { availableStForWorkS, availableResourcesForWorkS } = useSelector(state => state.workspace);
  const dispatch = useDispatch();
  
  const fetchedRef = useRef({ workspaceId: null, mode: null });
  
  const isResourceMode = interviewType === 'resource';
  const availableItems = isResourceMode ? availableResourcesForWorkS : availableStForWorkS;
  
  const filteredMembers = availableItems?.filter(member => 
    member?.name?.toLowerCase().includes(modalSearchQuery.toLowerCase())
  ) || [];

  useEffect(() => {
    if (!isOpen || !workspaceId) return;
    
    const shouldFetch = 
      fetchedRef.current.workspaceId !== workspaceId ||
      fetchedRef.current.mode !== isResourceMode;
    
    if (!shouldFetch) return;
    
    // حدّث الـ ref قبل الـ fetch
    fetchedRef.current = { workspaceId, mode: isResourceMode };
    
    if (isResourceMode) {
      dispatch(getAvailableRecourseForWorkspace(workspaceId));
    } else {
      dispatch(getAvailableStaffForWorkspace(workspaceId));
    }
  }, [workspaceId, isOpen, isResourceMode, dispatch]);
   
  useEffect(() => {
    if (editingGroup && groups && !isResourceMode) {
      // ✅ استخدم group_id بدلاً من id
      const currentGroup = groups.find(g => g.group_id === editingGroup.id);
      
      if (currentGroup) {
        setGroupName(currentGroup.group_name || '');
        const staffIds = currentGroup.staff?.map(s => s.id) || [];
        setSelectedMembers(staffIds);
      }
    } else {
      setGroupName('');
      setSelectedMembers([]);
    }
  }, [editingGroup, groups, isResourceMode]);

  useEffect(() => {
    if (filteredMembers && filteredMembers.length > 0) {
      const allSelected = filteredMembers.every(m => selectedMembers.includes(m.id));
      setSelectAll(allSelected);
    }
  }, [selectedMembers, filteredMembers]);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(filteredMembers.map(m => m.id));
    }
    setSelectAll(!selectAll);
  };

  const handleMemberToggle = (id) => {
    if (selectedMembers.includes(id)) {
      setSelectedMembers(selectedMembers.filter(mid => mid !== id));
    } else {
      setSelectedMembers([...selectedMembers, id]);
    }
  };

  const handleComplete = async () => {
    if (selectedMembers.length === 0) return;
    if (!isResourceMode && !groupName.trim()) return;

    setIsSubmitting(true);

    try {
      if (isResourceMode) {
        const results = [];
        
        for (const resourceId of selectedMembers) {
          const formData = new FormData();
          formData.append('resource_id', resourceId);
          
          const result = await dispatch(
            assignInterViewToStaff(interviewId, formData)
          );
          results.push(result);
        }
        
        const allSuccess = results.every(r => r?.success);
        
        if (allSuccess) {
          if (onComplete) onComplete();
          handleClose();
        }
      } else {
        const formData = new FormData();
        formData.append('name', groupName.trim());
        
        selectedMembers.forEach((memberId, index) => {
          formData.append(`staff_ids[${index}]`, memberId);
        });

        let result;
        if (editingGroup) {
          result = await dispatch(
            updateNewGroupToInterview(editingGroup.id, interviewId, formData)
          );
        } else {
          result = await dispatch(
            addNewGroupToInterview(interviewId, formData)
          );
        }

        if (result?.success) {
          if (onComplete) onComplete();
          handleClose();
        }
      }
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedMembers([]);
    setSelectAll(false);
    setModalSearchQuery('');
    setGroupName('');
    if (onClose) onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={handleClose}
      />

      <div
        className="fixed top-0 right-0 h-full w-[500px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out"
        dir="ltr"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              {isResourceMode 
                ? 'Assign Resources' 
                : (editingGroup ? 'Edit Group' : 'Create Group')}
            </h2>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="mb-4">
              <div className="flex items-center justify-between gap-7 mb-4">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder={isResourceMode ? "Search Resources" : "Search Recruiters"}
                    value={modalSearchQuery}
                    onChange={(e) => setModalSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring focus:ring-blue-500 focus:border-transparent"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                
                <label className="flex items-center gap-2 mr-4 cursor-pointer">
                  <span className="text-sm text-gray-600">Select All</span>
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="w-3.5 h-3.5 text-blue-600 accent-blue-700 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  />
                </label>
              </div>
            </div>

            <div className="space-y-2">
              {filteredMembers?.map((member) => {
                const isAlreadyAssigned = isResourceMode && 
                  assignedResources.some(r => r.id === member.id);
                
                return (
                  <div
                    key={member.id}
                    className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                      isAlreadyAssigned 
                        ? 'bg-gray-100 cursor-not-allowed opacity-60' 
                        : 'hover:bg-gray-50 cursor-pointer'
                    }`}
                    onClick={() => !isAlreadyAssigned && handleMemberToggle(member.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                        <span className="text-xl">{isResourceMode ? <Monitor /> : <UserRound />}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-700 truncate  max-w-[150px]">
                          {member.name}
                        </span>
                        {isAlreadyAssigned && (
                          <span className="text-xs text-gray-500">Already assigned</span>
                        )}
                      </div>
                    </div>
                    
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(member.id) || isAlreadyAssigned}
                      onChange={() => !isAlreadyAssigned && handleMemberToggle(member.id)}
                      onClick={(e) => e.stopPropagation()}
                      disabled={isAlreadyAssigned}
                      className="w-3.5 h-3.5 text-blue-600 accent-blue-700 border-gray-300 rounded focus:ring-blue-500 cursor-pointer disabled:cursor-not-allowed"
                    />
                  </div>
                );
              })}

              {filteredMembers?.length === 0 && (
                <div className="text-center py-8 text-gray-400 text-sm">
                  {isResourceMode ? 'No resources found' : 'No members found'}
                </div>
              )}
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-200">
            {!isResourceMode && (
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full flex items-center justify-center">
                    <img src={profileImg} alt="" />
                  </div>
                </div>
              </div>
            )}

            {!isResourceMode && (
              <div className="flex gap-3 mb-3">
                <input 
                  type="text"
                  placeholder="Your Group Name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="flex-1 border-b text-sm border-gray-300 outline-none hover:border-blue-700 px-2 py-1"
                />
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 px-2 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleComplete}
                disabled={
                  selectedMembers.length === 0 || 
                  (!isResourceMode && !groupName.trim()) || 
                  isSubmitting
                }
                className={`flex-1 px-2 py-2 rounded-lg transition-colors text-[13px] font-medium ${
                  selectedMembers.length > 0 && 
                  (isResourceMode || groupName.trim()) && 
                  !isSubmitting
                    ? 'border border-gray-400 text-sky-800 hover:border-blue-700'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isSubmitting 
                  ? 'Saving...' 
                  : isResourceMode 
                    ? 'Assign' 
                    : (editingGroup ? 'Update' : 'Create')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}