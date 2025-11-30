import { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import { fetchAllInterviews, fetchInterviews } from '../../../../../redux/apiCalls/interviewCallApi';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getAllWorkspaces ,assignWorkSpToStaff,getAvailableInterviewsForWorkspace} from '../../../../../redux/apiCalls/workspaceCallApi';
import { assignInterviewsToStaff } from '../../../../../redux/apiCalls/StaffCallApi';

const AssignModal = ({ isOpen, onClose, activeTab,interviewsAssigned }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const dispatch = useDispatch();
  const { workspaces,allWorkspaces,availableInterviewsForWorkS } = useSelector(state => state.workspace);
   console.log(interviewsAssigned);
   

  const { id } = useParams();
  console.log(interviewsAssigned);
  
 useEffect(() => {
  dispatch(getAllWorkspaces());
}, [dispatch]);

useEffect(() => {
  // ✅ فحص أن workspaces موجود وليس null قبل استخدام map
  if (workspaces && Array.isArray(workspaces) && workspaces.length > 0) {
    const workspaceIds = workspaces.map(workspace => workspace.id);
    dispatch(getAvailableInterviewsForWorkspace(workspaceIds));
  }
}, [dispatch, workspaces, isOpen]);

  // Reset selections when tab changes
useEffect(() => {
  if (isOpen) {
    setSearchTerm('');
    
    // If activeTab is interview and interviewsAssigned exists, pre-select them
    if (activeTab === 'interview' && Array.isArray(interviewsAssigned) && interviewsAssigned.length > 0) {
      const assignedIds = interviewsAssigned.map(interview => interview.id);
      setSelectedItems(assignedIds);
    } else {
      setSelectedItems([]);
    }
    
    setSelectAll(false);
  }
}, [isOpen, activeTab, interviewsAssigned]);

  if (!isOpen) return null;

  // Get data based on active tab - with safety check
  const getData = () => {
    const data = activeTab === 'workspace' ? allWorkspaces : availableInterviewsForWorkS;
    // Ensure we always return an array
    return Array.isArray(data) ? data : [];
  };

  const currentData = getData();

  const filteredItems = currentData.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map(i => i.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectItem = (id) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleAssign = async () => {
  if (selectedItems.length === 0) return;

  setIsLoading(true);
  try {
    const formData = {
      [activeTab === 'workspace' ? 'workspace_id' : 'interview_ids']: selectedItems
    };

    let result;
    if (activeTab === 'workspace') {
      result = await dispatch(assignWorkSpToStaff(id, formData));
    } else {
      result = await dispatch(assignInterviewsToStaff(id, formData));
    }

    if (result.success) {
      console.log(`Successfully assigned ${activeTab}s:`, selectedItems);
      
      // Force refresh the interviews
      if (activeTab === 'interview') {
        await dispatch(fetchInterviews({ staff_id: id, force: true }));
      }
      
      setSelectedItems([]);
      setSelectAll(false);
      onClose();
    } else {
      console.error(`Failed to assign ${activeTab}s:`, result.message);
    }
  } catch (error) {
    console.error(`Error assigning ${activeTab}s:`, error);
  } finally {
    setIsLoading(false);
  }
};

  const getModalTitle = () => {
    return activeTab === 'workspace' ? 'Assign Workspace' : 'Assign Interview';
  };

  const getSearchPlaceholder = () => {
    return activeTab === 'workspace' ? 'Search workspaces...' : 'Search interviews...';
  };

  const getEmptyMessage = () => {
    return activeTab === 'workspace' ? 'No workspaces found' : 'No interviews found';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50">
      <div 
        className="bg-white h-full w-full max-w-md flex flex-col shadow-2xl animate-slide-in"
        style={{
          animation: 'slideIn 0.3s ease-out'
        }}
      >
        <style>{`
          @keyframes slideIn {
            from {
              transform: translateX(100%);
            }
            to {
              transform: translateX(0);
            }
          }
        `}</style>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">{getModalTitle()}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search and Select All */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={getSearchPlaceholder()}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center justify-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-sm text-gray-600">Select All</span>
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
            </label>
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto px-6 py-2">
          {filteredItems.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500 text-sm">
              {getEmptyMessage()}
            </div>
          ) : (
            <div className="space-y-1">
              {filteredItems.map((item) => {
                const initials = item.name
                  .split(' ')
                  .map(word => word[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2);

                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectItem(item.id)}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`w-10 h-10 ${
                        activeTab === 'workspace' 
                          ? 'bg-blue-200 text-blue-700' 
                          : 'bg-purple-200 text-purple-700'
                      } rounded-full flex items-center justify-center text-sm font-medium`}>
                        {initials}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900 truncate block max-w-[150px]">
                          {item.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {activeTab === 'workspace' 
                            ? `${item.description || 'Workspace'}  `
                            : `${item.type} `
                          }
                        </span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={selectedItems.length === 0 || isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            {isLoading ? 'Assigning...' : `Assign ${activeTab === 'workspace' ? 'Workspace' : 'Interview'}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignModal;