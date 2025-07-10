import React, { useState, useRef, useEffect } from 'react';
import { Share2, MoreVertical, X, Copy } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux';
import { editInterviewById } from '../../../redux/apiCalls/interviewCallApi';

export default function NavInterview() {
  const [showShareModal, setShowShareModal] = useState(false);
  const [showEmbedWidget, setShowEmbedWidget] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const { id } = useParams()

  const shareModalRef = useRef(null);
  const menuModalRef = useRef(null);
  const menuButtonRef = useRef(null);
  const dispatch = useDispatch();
  
  const { interview } = useSelector(state => state.interview);
  // console.log(interview);

useEffect(() => {
  if (id) {
    dispatch(editInterviewById(id));
  }
}, [id, dispatch]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (shareModalRef.current && !shareModalRef.current.contains(event.target)) {
        setShowShareModal(false);
        setShowEmbedWidget(false);
      }
      if (
        showMenuModal &&
        menuModalRef.current &&
        !menuModalRef.current.contains(event.target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target)
      ) {
        setShowMenuModal(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenuModal]);

  // تم تغيير الـ share link ليروح على صفحة share/:id
  const shareLink = interview?.share_link 
    ? `${window.location.origin}/share/${interview.share_link}` 
    : '';

  // تم تحديث الـ iframe code ليشير على نفس الـ route
  const iframeCode = interview?.share_link 
    ? `<iframe width="400px" height="400px" src="${window.location.origin}/share/${interview.share_link}" frameborder="0" allowfullscreen></iframe>` 
    : '';

  return (
    <div className="relative">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-200 rounded-lg flex items-center justify-center">
                <span className="text-green-800 font-medium">RS</span>
              </div>
              <div>
                <h1 className="text-[11px] md:text-lg font-semibold">Recruitment Strategy Meeting</h1>
                <p className="text-sm text-gray-500">One-on-One</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
                onClick={() => {
                  setShowShareModal(true);
                  setShowEmbedWidget(false);
                }}
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
              <button 
                ref={menuButtonRef}
                className="p-2 hover:bg-gray-100 rounded-lg relative"
                onClick={() => setShowMenuModal(!showMenuModal)}
              >
                <MoreVertical className="w-5 h-5" />
              </button> 
              <Link to='/layoutDashboard/interviews' className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div ref={shareModalRef} className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Share Booking Link</h2>
              <button onClick={() => setShowShareModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-200 rounded-lg flex items-center justify-center">
                <span className="text-green-800 font-medium">RS</span>
              </div>
              <div>
                <h3 className="font-medium">Recruitment Strategy Meeting</h3>
                <p className="text-sm text-gray-500">30 mins · One-on-One</p>
              </div>
            </div>

            <div className="border-b mb-4 flex">
              <button 
                className={`pb-2 flex-1 ${!showEmbedWidget ? "border-b-2 border-indigo-600 text-indigo-600 font-medium" : "text-gray-500"}`}
                onClick={() => setShowEmbedWidget(false)}
              >
                Share Link
              </button>
              <button 
                className={`pb-2 flex-1 ${showEmbedWidget ? "border-b-2 border-indigo-600 text-indigo-600 font-medium" : "text-gray-500"}`}
                onClick={() => setShowEmbedWidget(true)}
              >
                Embed as Widget
              </button>
            </div>

            {!showEmbedWidget ? (
              <div className="mb-4">
                <div className="flex items-center mt-4">
                  <div className="flex-1 border rounded-l-lg p-2 text-sm text-gray-500 overflow-hidden">
                    {shareLink}
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText(shareLink)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-700 flex items-center"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </button>
                </div>
              </div>
            ) : (
              <div className="mb-4">
                <textarea 
                  className="w-full border rounded-lg p-2 text-sm text-gray-500"
                  readOnly
                  rows="3"
                  value={iframeCode}
                />
                <button
                  onClick={() => navigator.clipboard.writeText(iframeCode)}
                  className="bg-indigo-600 w-fit text-white px-4 py-2 mt-2 rounded-lg hover:bg-indigo-700 flex items-center"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Code
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Menu Modal */}
      {showMenuModal && (
        <div ref={menuModalRef} className="absolute top-16 right-12 bg-white border rounded-lg shadow-lg z-40 w-40 py-1">
          <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center">
            <span className="w-4 h-4 mr-2 text-gray-600">📄</span>
            <span>Make a copy</span>
          </button>
          <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center">
            <span className="w-4 h-4 mr-2 text-gray-600">📁</span>
            <span>Move</span>
          </button>
          <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center text-red-500">
            <span className="w-4 h-4 mr-2">🗑️</span>
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
}