import { themeActions } from '../../../../../redux/slices/themeSlice'; 

import { useState, useEffect, useCallback } from 'react';
import ClassicLayout from './ClassicLayout';
import FreshLayout from './FreshLayout';
import ModernWebLayout from './ModernWebLayout';
import NewLayout from './NewLayout';
import { Menu, X } from 'lucide-react';
import WorkspaceThemePanel from '../WorkspaceThemePanal';
import Footer from './Footer';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getTheme } from '../../../../../redux/apiCalls/ThemeCallApi';
import { LAYOUT_TO_THEME } from './themeMapping';
import { FaArrowLeft } from "react-icons/fa";

export default function AllLayout() {
  const dispatch = useDispatch();
  const { theme, loading, error } = useSelector(state => ({
    theme: state.themes?.theme?.theme || null,
    loading: state.themes?.loading || false,
    error: state.themes?.error || null
  }));

  const location = useLocation();
  const { workspaceData, workspaceTheme, interviewData, interviewTheme } = location.state || {};
  console.log(interviewTheme);
  
  const isInterview = Boolean(interviewData?.id);
  const currentId = isInterview ? interviewData?.id : workspaceData?.id;
  const currentTheme = isInterview ? interviewTheme : workspaceTheme;

  const [selectedLayout, setSelectedLayout] = useState('modernWeb');
const [themeData, setThemeData] = useState({
  color: '',
  textColor: '', 
  header: { title: '', logo: null, visibleTitle: true, visibleLogo: true },
  pageProperties: { title: 'Welcome', description: '', visibleTitle: true, visibleDescription: true },
  workspaceProperties: { name: 'Ahmed', description: '' },
  buttonText: 'Book appointment',
  preSelect: true,
  socialLinks: {
    facebook: '', visibleFacebook: true,
    instagram: '', visibleInstagram: true,
    x: '', visibleX: true,
    linkedin: '', visibleLinkedin: true,
    tiktok: theme?.footer_tiktok || '', 
    visibleTiktok: theme?.show_tiktok ?? true, 
    snapchat: theme?.footer_snapchat || '', 
    visibleSnapchat: theme?.show_snapchat ?? true, 
    whatsapp: theme?.footer_whatsapp || '', 
    visibleWhatsapp: theme?.show_whatsapp ?? true, 
    phone: '', visiblePhone: true,
    email: '', visibleEmail: true,
  },
});
  
  const isGradient = themeData.color?.includes('-') || false;  
  const [firstColor, secondColor] = isGradient 
    ? themeData.color.split('-') 
    : [themeData.color || '#FFFFFF', themeData.color || '#FFFFFF'];
 
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
useEffect(() => {
  dispatch(themeActions.clearTheme());
  
  setThemeData({
    color: '',
    textColor: '#000000', 
    header: { title: '', logo: null, visibleTitle: true, visibleLogo: true },
    pageProperties: { title: 'Welcome', description: '', visibleTitle: true, visibleDescription: true },
    buttonText: 'Book appointment',
    preSelect: true,
    socialLinks: {
      facebook: '', visibleFacebook: true,
      instagram: '', visibleInstagram: true,
      x: '', visibleX: true,
      linkedin: '', visibleLinkedin: true,
      tiktok: '', visibleTiktok: true,
      snapchat: '', visibleSnapchat: true,
      whatsapp: '', visibleWhatsapp: true,
      phone: '', visiblePhone: true,
      email: '', visibleEmail: true,
    },
  });
  setSelectedLayout('modernWeb');
  
  if (currentTheme?.id) {
    dispatch(getTheme(currentTheme.id));
  }
}, [currentId, dispatch, currentTheme?.id]);

useEffect(() => {
  const checkScreenSize = () => {
    const compact = window.innerWidth < 1024;
    setIsCompact(compact);
    
    if (window.innerWidth >= 1024) {
      setIsPanelVisible(true);
    }
  };

  checkScreenSize();
  
  const mediaQuery = window.matchMedia('(min-width: 1024px)');
  
  const handleMediaChange = (e) => {
    if (e.matches) {
      setIsPanelVisible(true);
      setIsCompact(false);
    } else {
      setIsCompact(true);
    }
  };

  mediaQuery.addEventListener('change', handleMediaChange);
  
  return () => {
    mediaQuery.removeEventListener('change', handleMediaChange);
  };
}, []);
useEffect(() => {
  if (theme) {
    let parsedColors = {};
    try { parsedColors = JSON.parse(theme.colors || '{}'); } catch {}

    const reverseMap = Object.fromEntries(
      Object.entries(LAYOUT_TO_THEME).map(([ui, api]) => [api, ui])
    );
    const uiLayout = reverseMap[theme.theme];

    const mappedData = {
      layout: uiLayout,
      color: parsedColors.primary || '#4f46e5',
      textColor: parsedColors.text_color || '#000000', 
      backgroundOpacity: (parsedColors.background_opacity || 1) * 100,
      header: {
        title: theme.nickname || 'Ahmed',
        logo: theme.photo ? theme.photo : null,
        visibleTitle: theme.show_nickname ?? true,
        visibleLogo: theme.show_photo ?? true,
      },
      pageProperties: {
        title: theme.page_title || 'Welcome',
        description: theme.page_description || '',
        visibleTitle: theme.show_page_title ?? true,
        visibleDescription: theme.show_page_description ?? true,
      },
      buttonText: theme.book_button || 'Book appointment',
      preSelect: theme.for_interviews ?? true,
      socialLinks: {
        facebook: theme.footer_facebook || '', visibleFacebook: theme.show_facebook ?? true,
        instagram: theme.footer_instagram || '', visibleInstagram: theme.show_instagram ?? true,
        x: theme.footer_x || '', visibleX: theme.show_x ?? true,
        linkedin: theme.footer_linkedin || '', visibleLinkedin: theme.show_linkedin ?? true,
        tiktok: theme.footer_tiktok || '', visibleTiktok: theme.show_tiktok ?? true,
        snapchat: theme.footer_snapchat || '', visibleSnapchat: theme.show_snapchat ?? true,
        whatsapp: theme.footer_whatsapp || '', visibleWhatsapp: theme.show_whatsapp ?? true,
        phone: theme.footer_phone || '', visiblePhone: theme.show_phone ?? true,
        email: theme.footer_email || '', visibleEmail: theme.show_email ?? true,
      },
    };

    setThemeData(mappedData);
    setSelectedLayout(mappedData.layout);
  }
}, [theme]);

// ✅ 3️⃣ تحديث الـ layout في themeData
useEffect(() => {
  setThemeData(prev => ({ ...prev, layout: selectedLayout }));
}, [selectedLayout]);



  const handleThemeChange = useCallback((newTheme) => {
    console.log(newTheme);
    
    setThemeData((prev) => {
      const newHeader = {
        title: newTheme.header?.title ?? prev.header.title,
        visibleTitle: newTheme.header?.visibleTitle ?? prev.header.visibleTitle,
        visibleLogo: newTheme.header?.visibleLogo ?? prev.header.visibleLogo,
        logo: newTheme.header?.logo
          ? (typeof newTheme.header.logo === 'string' ? newTheme.header.logo : URL.createObjectURL(newTheme.header.logo))
          : prev.header.logo,
      };

      return {
        ...prev,
        ...newTheme,
        header: newHeader,
        socialLinks: { ...prev.socialLinks, ...newTheme.socialLinks },
      };
    });
  }, []); 

  const handleLayoutChange = useCallback((layout) => {
    setSelectedLayout(layout);
  }, []);

  const togglePanel = useCallback(() => {
    setIsPanelVisible(prev => !prev);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-lg text-gray-600 font-medium">Loading theme...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {isCompact && (
        <button
          onClick={togglePanel}
          className="fixed top-4 right-4 z-50 bg-indigo-600 text-white p-2 rounded-full shadow-lg"
        >
          {isPanelVisible ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      )}

      <div className='border-b p-4 flex items-center gap-2'>
        <Link to='/layoutDashboard/bookPage'>
          <FaArrowLeft className="w-4 h-4" />
        </Link>
        <span>{isInterview ? 'Interview Page' : 'Booking Page'}</span> 
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4">
        <div
          style={
            selectedLayout === 'newLayout' 
              ? { background: firstColor } 
              : selectedLayout !== 'fresh' 
                ? { background: firstColor } 
                : selectedLayout === 'modernWeb'
                ? { background: firstColor }
                : {}
          }
          className={`${
            isPanelVisible && isCompact ? 'opacity-50' : 'opacity-100'
          } col-span-1 lg:col-span-9 transition-opacity duration-300 border rounded-lg h-[75%] overflow-y-auto`}
        >
          {/* Header Section */}
          <div 
            className="mb-6"
            style={selectedLayout === 'newLayout' || selectedLayout === 'modernWeb' ? { background: firstColor } : {}}
          >
            <div className="flex flex-col items-start gap-3">
              <div className="flex space-x-1 bg-gray-100 w-full py-4 px-4 rounded-t-lg">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="flex items-center gap-3 px-4 pb-4">
                {themeData?.header.visibleLogo && themeData?.header.logo ? (
                  <img
                    src={themeData?.header.logo}
                    alt="Logo"
                    className="w-10 h-10 rounded-md object-cover shadow-sm"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : null}
                {themeData.header.visibleTitle && (
                  <h1 className="text-xl font-medium" style={{ color: themeData.textColor }}>
                    {themeData.header.title}
                  </h1>
                )}
              </div>
            </div>
          </div>

          {selectedLayout !== 'fresh' && selectedLayout !== 'newLayout' && (
            <div className="mb-8 text-center" >
              {themeData.pageProperties.visibleTitle && (
                <h2 className="text-2xl font-bold mb-2" style={{ color: themeData.textColor }}>
                  {themeData.pageProperties.title}
                </h2>
              )}
              {themeData.pageProperties.visibleDescription && (
                <div 
                  className="text-sm mb-3 px-4" 
                  style={{ color: themeData.textColor }}
                  dangerouslySetInnerHTML={{ __html: themeData.pageProperties.description }}
                />
              )}
              <hr className='bg-gray-400 opacity-25 mx-7'/>
            </div>
          )}
         
          {selectedLayout === 'classic' && <ClassicLayout themeData={themeData} />}
          {selectedLayout === 'fresh' && <FreshLayout themeData={themeData} />}
          {selectedLayout === 'modernWeb' && <ModernWebLayout themeData={themeData} />}
          {selectedLayout === 'newLayout' && <NewLayout themeData={themeData} />}
          
          {/* Footer Section */}
          <div style={selectedLayout === 'newLayout' ? { background: firstColor } : {}}>
            <Footer themeData={themeData} />
          </div>
        </div>

        {isPanelVisible && (
          <div
            className={`${
              isCompact
                ? 'fixed inset-y-0 right-0 z-40 w-full md:w-72 shadow-xl bg-white overflow-y-auto'
                : 'col-span-3'
            }`}
          >
            <WorkspaceThemePanel
             key={currentId} 
              onLayoutChange={handleLayoutChange}
              onThemeChange={handleThemeChange}
              currentId={currentId}
              isInterview={isInterview}
              workspaceTheme={theme}
              interview={interviewData}
              workspace={workspaceData}
            />
          </div>
        )}
      </div>

      {isPanelVisible && isCompact && (
         <div
    className="fixed inset-0 bg-black bg-opacity-20 z-30"
    onMouseDown={(e) => {
      if (e.target === e.currentTarget) {
        setIsPanelVisible(false);
      }
    }}
    onTouchStart={(e) => {
      if (e.target === e.currentTarget) {
        setIsPanelVisible(false);
      }
    }}
    aria-hidden="true"
  />
      )}
    </div>
  );
}