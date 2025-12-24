import {  useEffect, useRef } from 'react';
import { useNavigate, useOutletContext } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { editInterviewStaffById } from '../../../redux/apiCalls/StaffapiCalls/StaffapiCalls';
import InterviewDetailsShow from '../../Dashboard/InterviewsPages/InterViewPage/InterviewDetails/InterviewDetailsShow';

const InterviewDetails_Staff = () => {
  const navigate = useNavigate();

  const { id } = useOutletContext();
  const dispatch = useDispatch();
  const { staff_interview, loading } = useSelector(state => state.staffApis);
  
  const prevIdRef = useRef(null);
  const fetchTimeoutRef = useRef(null);
console.log(staff_interview);

  useEffect(() => {
    if (!id) return;
    
    if (id === prevIdRef.current) return;
    
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }
    
    fetchTimeoutRef.current = setTimeout(() => {
      prevIdRef.current = id;
      dispatch(editInterviewStaffById(id));
    }, 300); 
    
    // Cleanup
    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, [id, dispatch]);


  const handleBack = () => {
    navigate('/staff_dashboard_layout/Staff_Interviews');
  };

  if (!loading && !staff_interview) {
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


  return (
    <InterviewDetailsShow
      interview={staff_interview}
    />
  );
};

export default InterviewDetails_Staff;