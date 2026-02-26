import { useState, useEffect, useRef } from 'react';
import { useNavigate, useOutletContext } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { editInterviewById } from '../../../../../redux/apiCalls/interviewCallApi';
import { getWorkspace } from '../../../../../redux/apiCalls/workspaceCallApi';
import { usePermission } from "../../../../hooks/usePermission";
import InterviewDetailsEdit from './InterviewDetailsEdit';
import InterviewDetailsShow from './InterviewDetailsShow';
import Loader from '../../../../Loader';

const InterviewDetails = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true); // أضفنا state جديد
  const navigate = useNavigate();

  const { id } = useOutletContext();
  const dispatch = useDispatch();
  const { interview, loading } = useSelector(state => state.interview);
  const { workspaces } = useSelector(state => state.workspace);
  
  const prevIdRef = useRef(null);
  const fetchTimeoutRef = useRef(null);

  useEffect(() => {
    if (!id) return;
    
    // لو الـ ID اتغير، نشغل الـ loading
    if (id !== prevIdRef.current) {
      setIsInitialLoading(true);
    }
    
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }
    
    fetchTimeoutRef.current = setTimeout(async () => {
      prevIdRef.current = id;
      await Promise.all([
        dispatch(getWorkspace()),
        dispatch(editInterviewById(id))
      ]);
      // بعد ما الـ data ترجع، نوقف الـ loading
      setIsInitialLoading(false);
    }, 300); 
    
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

  // نعرض الـ Loader لو احنا في الـ initial loading أو لو مفيش interview
  if (isInitialLoading || loading || !interview) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="flex items-center justify-center py-20">
          <Loader />
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