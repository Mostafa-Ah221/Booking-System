import { useState, useEffect } from 'react';
import { Share2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import WorkspaceAvailability from './WorkspaceFolder/WorkspaceAvailability';
import AssignWorkSpToStaff from './AssignWorkSpToStaff';
import ShareBookingModal from '../Profile_Page/ShareModalPrpfile';
import { updateShareLinkWorkspace, editWorkspaceById, getWorkspace } from '../../../redux/apiCalls/workspaceCallApi';
import { workspaceAction } from '../../../redux/slices/workspaceSlice';

export default function WorkspaceDetails() {
  const [activeTab, setActiveTab] = useState('availability');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { id } = useParams();

  const dispatch = useDispatch();
  const { workspace: reduxWorkspace, workspaces } = useSelector(state => state.workspace);

  const workspace = reduxWorkspace?.id
    ? reduxWorkspace
    : workspaces?.find(ws => ws.id === parseInt(id));

  // جيب الـ workspaces لو مفيش في Redux (بعد refresh)
  useEffect(() => {
    if (!workspaces || workspaces.length === 0) {
      dispatch(getWorkspace({ force: true }));
    }
  }, []);

  // بعد ما workspaces اترجعت، set الـ workspace في Redux
  useEffect(() => {
    if (workspaces && id && !reduxWorkspace?.id) {
      const found = workspaces.find(ws => ws.id === parseInt(id));
      if (found) dispatch(workspaceAction.setWorkspace(found));
    }
  }, [workspaces, id]);

  const handleUpdateShareLink = async (newShareLink, id) => {
    try {
      await dispatch(updateShareLinkWorkspace(newShareLink, id));
      dispatch(editWorkspaceById(id));
      setIsShareModalOpen(false);
    } catch (error) {
      console.error('Error updating share link:', error);
    }
  };

  const handleShareClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsShareModalOpen(true);
  };

  return (
    <div className="w-full mt-7">
      <div className="border-b border-gray-200 flex justify-between">
        <div className="flex gap-8 ml-7">
          <button
            onClick={() => setActiveTab('availability')}
            className={`pb-4 px-2 font-medium transition-colors ${
              activeTab === 'availability'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Availability
          </button>
          <button
            onClick={() => setActiveTab('assignStaff')}
            className={`pb-4 px-2 font-medium transition-colors ${
              activeTab === 'assignStaff'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Assign Recruiter
          </button>
        </div>

        <button
          onClick={handleShareClick}
          className="flex items-center gap-1 text-sm mb-2 mr-7 px-4 py-1 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
          title='Share Link'
        >
          <Share2 className="w-3 h-3" />
          <span>Share</span>
        </button>
      </div>

      <div className="mt-6 mx-5">
        {activeTab === 'availability' && (
          <div className="text-gray-700">
            <WorkspaceAvailability />
          </div>
        )}

        {activeTab === 'assignStaff' && (
          <div className="text-gray-700">
            <AssignWorkSpToStaff />
          </div>
        )}
      </div>

      <ShareBookingModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shareLink={`w/${workspace?.share_link}`}
        profile={workspace}
        onUpdateLink={handleUpdateShareLink}
      />
    </div>
  );
}