import { useState, useEffect, useRef } from 'react';
import { useNavigate, useOutletContext } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { editInterviewById } from '../../../../../redux/apiCalls/interviewCallApi';
import { getWorkspace } from '../../../../../redux/apiCalls/workspaceCallApi';
import { usePermission } from "../../../../hooks/usePermission";
import InterviewDetailsEdit from './InterviewDetailsEdit';
import InterviewDetailsShow from './InterviewDetailsShow';

const InterviewDetails = () => {
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const { id } = useOutletContext();
  const dispatch = useDispatch();
  const { interview, loading } = useSelector(state => state.interview);
  const { workspaces } = useSelector(state => state.workspace);
  
  const prevIdRef = useRef(null);
  const fetchTimeoutRef = useRef(null);

  useEffect(() => {
    if (!id) return;
    
    if (id === prevIdRef.current) return;
    
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }
    
    fetchTimeoutRef.current = setTimeout(() => {
      prevIdRef.current = id;
      dispatch(getWorkspace());
      dispatch(editInterviewById(id));
    }, 300); 
    
    // Cleanup
    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, [id, dispatch]);

  const canEdit = usePermission("edit interview");

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleBack = () => {
    navigate('/layoutDashboard/interviews');
  };

  if (!loading && !interview) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Loading Interview...</p>
          <button 
            onClick={handleBack}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Interview
          </button>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <InterviewDetailsEdit
        interview={interview}
        workspaces={workspaces}
        loading={loading}
        id={id}
        onCancel={handleCancelClick}
      />
    );
  }

  return (
    <InterviewDetailsShow
      interview={interview}
      canEdit={canEdit}
      onEditClick={handleEditClick}
    />
  );
};

export default InterviewDetails;