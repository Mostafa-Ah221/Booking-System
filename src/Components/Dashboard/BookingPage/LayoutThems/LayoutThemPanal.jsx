import { useState, useEffect } from 'react';
import ThemePanel from './ThemePanel';
import ThemeBody from './ThemeBody';
import { Menu, X } from 'lucide-react';
import { getCustomerTheme, getStaffTheme } from '../../../../redux/apiCalls/ThemeCallApi';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const LayoutThemPanel = () => {
  const [layout, setLayout] = useState('default');
  const [themeColor, setThemeColor] = useState('bg-indigo-600');
  const [header, setHeader] = useState({ 
    title: '', 
    logo: null,
    visibleTitle: true,
    visibleLogo: true
  });
  const [pageProperties, setPageProperties] = useState({
    title: 'Welcome!',
    description: 'Book your appointment in a few simple steps...',
    visibleTitle: true,
    visibleDescription: true
  });
const [footer, setFooter] = useState({
  facebook: '', 
  visibleFacebook: true,
  instagram: '', 
  visibleInstagram: true,
  x: '', 
  visibleX: true,
  linkedin: '', 
  visibleLinkedin: true,
  tiktok: '',       
  visibleTiktok: true, 
  snapchat: '',      
  visibleSnapchat: true,
  whatsapp: '',    
  visibleWhatsapp: true,  
  phone: '', 
  visiblePhone: true,
  email: '', 
  visibleEmail: true,
});
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const [isCompactView, setIsCompactView] = useState(false);
    const dispatch = useDispatch();
 const {  loading,  } = useSelector(state => ({
    theme: state.themes?.theme?.theme || null,
    loading: state.themes?.loading || false,
    error: state.themes?.error || null
  }));
const userType = localStorage.getItem("userType");
 const theme = useSelector(state => state.themes?.theme?.theme);

  useEffect(() => {
    if (userType === "staff") {
      dispatch(getStaffTheme()); 
    } else {
      dispatch(getCustomerTheme()); 
    } 
}, [dispatch]);
useEffect(() => {
  const checkScreenSize = () => {
    const isCompact = window.innerWidth < 1024;
    setIsCompactView(isCompact);
    
    if (window.innerWidth >= 1024) {
      setIsPanelVisible(true);
    }
  };

  checkScreenSize();
  
  const mediaQuery = window.matchMedia('(min-width: 1024px)');
  
  const handleMediaChange = (e) => {
    if (e.matches) {
      setIsPanelVisible(true);
      setIsCompactView(false);
    } else {
      setIsCompactView(true);
    }
  };

  mediaQuery.addEventListener('change', handleMediaChange);
  
  return () => {
    mediaQuery.removeEventListener('change', handleMediaChange);
  };
}, []);

  const togglePanel = () => {
    setIsPanelVisible(!isPanelVisible);
  };
  // Loading State
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
    <div className="relative min-h-screen">
     {isCompactView && (
  <button 
    onClick={togglePanel}
    className="fixed top-2 right-4 z-50 bg-indigo-600 text-white p-2 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
    aria-label="Toggle theme panel"
  >
    {isPanelVisible ? (
      <X className="w-6 h-6" />
    ) : (
      <Menu className="w-6 h-6" />
    )}
  </button>
)}
      <div className=' p-4 flex items-center gap-2 fixed top-0 left-0 bg-white w-full z-40'>
        <Link to={`${userType === 'staff' ? "/staff_dashboard_layout/Staff_Profilepage" : "/layoutDashboard/bookPage"}`}>
          <FaArrowLeft  className="w-4 h-4 "/>
        </Link>
        <span>Booking Page</span> 
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 mt-14">
        <div 
          className={`
            ${isPanelVisible && isCompactView ? 'opacity-50' : 'opacity-100'} 
            col-span-1 lg:col-span-9 
            transition-opacity duration-300
          `}
        >
          <ThemeBody
            layout={layout} 
            themeColor={themeColor}
            header={header}
            pageProperties={pageProperties}
            footer={footer}
            themeData={theme || null}
          />
        </div>
        
        {/* Always render ThemePanel, but hide it with CSS on mobile */}
        <div 
          className={`
            ${isCompactView 
              ? `fixed inset-y-0 top-14 right-0 z-40 w-full md:w-80 shadow-xl bg-white overflow-y-auto transform transition-transform duration-300 ease-in-out ${
                  isPanelVisible ? 'translate-x-0' : 'translate-x-full'
                }` 
              : 'col-span-3 sticky top-0'
            }
          `}
        >
          <ThemePanel
            header={header} 
            pageProperties={pageProperties}
            socialLinks={footer}
            onHeaderChange={setHeader}
            onLayoutChange={setLayout} 
            onColorChange={setThemeColor}            
            onPagePropertiesChange={setPageProperties}
            onFooterChange={setFooter}
          />
        </div>
      </div>
      
      {isPanelVisible && isCompactView && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-20 z-30"
          onClick={() => setIsPanelVisible(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default LayoutThemPanel;