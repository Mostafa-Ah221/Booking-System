import { useState } from 'react';
import { X, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { assignInterViewToResource } from '../../../../redux/apiCalls/ResourceCallApi';
import { PiMonitorLight } from 'react-icons/pi';

export default function AssignedResourceToInterview({ isOpen, setIsOpen, interviewsForAssign, resourceId }) {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    const newSelected = {};
    (interviewsForAssign || []).forEach(item => {
      newSelected[item.id] = newSelectAll;
    });
    setSelectedItems(newSelected);
  };

  const handleItemSelect = (id) => {
    setSelectedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleAssign = async () => {
    const selectedInterviewIds = Object.keys(selectedItems).filter(id => selectedItems[id]);
    
    if (selectedInterviewIds.length === 0) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      for (const interviewId of selectedInterviewIds) {
        const formData = {
          interview_id: parseInt(interviewId)
        };
        
        // Send interview.id in the URL, interview_id in the body
        await dispatch(assignInterViewToResource(resourceId, formData));
      }
      
      // Reset and close after successful assignment
      setSelectedItems({});
      setSelectAll(false);
      setIsOpen(false);
    } catch (error) {
      console.error('Error assigning interviews:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter interviews based on search query
  const filteredInterviews = (interviewsForAssign || []).filter(interview =>
    interview.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="bg-white shadow-xl w-full max-w-md h-full overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Assign Interviews</h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center justify-start mt-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">Select All</span>
            </label>
          </div>
        </div>

        {/* List Items */}
        <div className="px-4 pb-4 max-h-96 overflow-y-auto">
          {filteredInterviews.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No interviews found
            </div>
          ) : (
            filteredInterviews.map((interview) => (
              <div 
                key={interview.id}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-600 font-semibold text-sm"><PiMonitorLight size={22} /></span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 truncate  max-w-[150px]">{interview.name}</div>
                    <div className="text-sm text-gray-500"><span className='truncate  max-w-[150px]'>{interview.name} </span>| {interview.duration_cycle}</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={selectedItems[interview.id] || false}
                  onChange={() => handleItemSelect(interview.id)}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
              </div>
            ))
          )}
        </div>

        

        {/* Footer Buttons */}
        <div className="flex gap-3 p-4 border-t">
          <button 
            onClick={handleAssign}
            disabled={isSubmitting || Object.values(selectedItems).every(val => !val)}
            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Assigning...' : 'Assign'}
          </button>
          <button 
            onClick={() => setIsOpen(false)}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}