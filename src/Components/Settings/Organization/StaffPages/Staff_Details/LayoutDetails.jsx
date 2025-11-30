import React, { useEffect, useState } from 'react';
import { ArrowLeft, Share } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import StaffProfile from './StaffProfile';
import StaffAvailability from './StaffAvailability/StaffAvailability';
import AssignStaff from './AssignStaff';
import ShareModalProfile from '../../../../Dashboard/Profile_Page/ShareModalPrpfile';
import { getStaffById, updateShareLinkStaff } from '../../../../../redux/apiCalls/StaffCallApi';
import { usePermission } from '../../../../hooks/usePermission';

export default function LayoutDetails() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { staff, loading, error } = useSelector(state => state.staff);
  const [activeTab, setActiveTab] = useState('Profile');
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false); 
 const [isUpdatingShareLink, setIsUpdatingShareLink] = useState(false);
  const canEditStaff = usePermission("edit staff");
  console.log(staff?.staff);
  
  useEffect(() => {
    if (id) {
      dispatch(getStaffById(id)).then(() => {
        setInitialLoadComplete(true); 
      });
    }
  }, [id, dispatch]);
  const handleUpdateShareLink = async (newShareLink, id) => {
      try {
        setIsUpdatingShareLink(true);
        await dispatch(updateShareLinkStaff(newShareLink, id));
        await dispatch(getStaffById(id));
        setIsShareModalOpen(false);
      } catch (error) {
        console.error('Error updating share link:', error);
      } finally {
        setIsUpdatingShareLink(false);
      }
    };

  const handleBackClick = () => {
    navigate('/layoutDashboard/setting/recruiterPage');
  };

  const handleShareClick = () => {
    setIsShareModalOpen(true);
  };


  const tabs = [
    { name: 'Profile', label: 'Profile', canShow: true },
    { name: 'Availability', label: 'Availability', canShow: canEditStaff },
    { name: 'Assigned Recruiter', label: 'Assigned Recruiter', canShow: true },
  ].filter(tab => tab.canShow);

 
  useEffect(() => {
    const isActiveTabAvailable = tabs.some(tab => tab.name === activeTab);
    if (!isActiveTabAvailable && tabs.length > 0) {
      setActiveTab(tabs[0].name);
    }
  }, [canEditStaff]);

  if (loading && !initialLoadComplete) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Recruiter details...</p>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Profile':
        return <StaffProfile staff={staff} />;
      case 'Availability':
        return canEditStaff ? <StaffAvailability staff={staff} /> : null;
      case 'Assigned Recruiter':
        return <AssignStaff staff={staff} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6" dir="ltr">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button 
            onClick={handleBackClick}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900 truncate block max-w-[150px]">{staff?.staff.name || 'user name'}</h1>
        </div>

        <button 
          onClick={handleShareClick}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium px-4 py-2 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
        >
          <Share className="w-4 h-4" />
          Share
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex gap-0">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`pb-3 px-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.name
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {renderTabContent()}
      </div>

      <ShareModalProfile
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        shareLink={`s/${staff?.staff.share_link}`}
        profile={staff?.staff}
        onUpdateLink={handleUpdateShareLink}
        canShowEdit={canEditStaff}
      />
    </div>
  );
}