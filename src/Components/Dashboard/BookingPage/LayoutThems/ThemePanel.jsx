import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Eye, EyeOff, Upload, Check, X, Plus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { updateTheme, updateThemeStaff } from '../../../../redux/apiCalls/ThemeCallApi';
import { LAYOUT_TO_THEME } from '../LayoutWorkspaceTheme/LayoutShapes/themeMapping';
import ImageUploadCrop from '../../InterviewsPages/InterViewPage/ImageUploadCrop';

const ThemePanel = ({
  header,
  pageProperties,
  socialLinks,
  onLayoutChange,
  onColorChange,
  onHeaderChange,
  onPagePropertiesChange,
  onFooterChange,
}) => {

  const dispatch = useDispatch();
  const theme = useSelector(state => state.themes?.theme?.theme);
  
  const [openSection, setOpenSection] = useState('');
  const [selectedLayout, setSelectedLayout] = useState('sleek');
  const [selectedColor, setSelectedColor] = useState(null);
  const [customColor, setCustomColor] = useState({ color1: '#FFFFFF', color2: '#000000', textColor: '#FFFFFF', type: 'custom' });
  const [logoDeleted, setLogoDeleted] = useState(false);
  const [isImageUploadOpen, setIsImageUploadOpen] = useState(false);
  const userType = localStorage.getItem("userType");
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);


  useEffect(() => {
    if (theme) {
      // Helper function
      const toBool = (val) => val === 1 || val === "1" || val === true;
      
      // Layout
      const reverseMap = Object.fromEntries(
        Object.entries(LAYOUT_TO_THEME).map(([ui, api]) => [api, ui])
      );
      const uiLayout = reverseMap[theme.theme];
      if (uiLayout) {
        setSelectedLayout(uiLayout);
        onLayoutChange(uiLayout);
      }

      // Colors
      let parsedColors = {};
      try { 
        parsedColors = JSON.parse(theme.colors || '{}'); 
      } catch {}

      if (parsedColors.primary) {
        // Find matching color option
        const matchingColor = colorOptions.find(
          opt => `${opt.color1}-${opt.color2}` === parsedColors.primary
        );
        if (matchingColor) {
          setSelectedColor(matchingColor);
          onColorChange(matchingColor);
        } else {
          const [c1, c2] = parsedColors.primary.split('-');
          const tc = parsedColors.text_color || '#000000';
          const cust = { color1: c1 || '#FFFFFF', color2: c2 || '#000000', textColor: tc, type: 'custom' };
          setCustomColor(cust);
          setSelectedColor(cust);
          onColorChange(cust);
        }
      }

      const hasPhoto = theme.photo && theme.photo.trim() !== '';
      setLogoDeleted(!hasPhoto);

      if (theme.nickname) {
        onHeaderChange({
          ...header,
          title: theme.nickname,
          visibleTitle: toBool(theme.show_nickname),
          visibleLogo: toBool(theme.show_photo),
          logo: hasPhoto ? theme.photo : null 
        });
      }

      // Page Properties
      if (theme.page_title || theme.page_description) {
        onPagePropertiesChange({
          ...pageProperties,
          title: theme.page_title || pageProperties.title,
          description: stripHtml(theme.page_description || '') || pageProperties.description,
          visibleTitle: toBool(theme.show_page_title),
          visibleDescription: toBool(theme.show_page_description)
        });
      }

      
  onFooterChange({
    facebook: theme.footer_facebook || "",
    visibleFacebook: toBool(theme.show_facebook),
    
    instagram: theme.footer_instagram || "",
    visibleInstagram: toBool(theme.show_instagram),
    
    x: theme.footer_x || "",
    visibleX: toBool(theme.show_x),
    
    linkedin: theme.footer_linkedin || "",
    visibleLinkedin: toBool(theme.show_linkedin),
    
    tiktok: theme.footer_tiktok || "",  
    visibleTiktok: toBool(theme.show_tiktok),  
    
    snapchat: theme.footer_snapchat || "",  
    visibleSnapchat: toBool(theme.show_snapchat),
    
    whatsapp: theme.footer_whatsapp || "",  // ✅ جديد
    visibleWhatsapp: toBool(theme.show_whatsapp),  // ✅ جديد
    
    phone: theme.footer_phone || "",
    visiblePhone: toBool(theme.show_phone),
    
    email: theme.footer_email || "",
    visibleEmail: toBool(theme.show_email)
  });
  }
}, [theme]);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? '' : section);
  };

  const colorOptions = [
    { color1: '#A6517D', color2: '#F5F5F5', textColor: '#000000', type: 'split' },
    { color1: '#F6CB45', color2: '#1C3E74', textColor: '#FFFFFF', type: 'split' },
    { color1: '#F9E062', color2: '#33373A', textColor: '#FFFFFF', type: 'split' },
    { color1: '#F6CB45', color2: '#3B817B', textColor: '#FFFFFF', type: 'split' },
    { color1: '#FFC900', color2: '#2651C7', textColor: '#FFFFFF', type: 'split' },
    { color1: '#EB5380', color2: '#784CBC', textColor: '#FFFFFF', type: 'split' },
    { color1: '#FF5D6D', color2: '#755B5B', textColor: '#FFFFFF', type: 'split' },
    { color1: '#E95646', color2: '#F5F5F5', textColor: '#000000', type: 'split' },
    { color1: '#27D8A1', color2: '#F5F5F5', textColor: '#000000', type: 'split' },
    { color1: '#FF427F', color2: '#F5F5F5', textColor: '#000000', type: 'split' },
  ];

  const handleLayoutChange = (layout) => {
    setSelectedLayout(layout);
    onLayoutChange(layout);
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
    if (color.type === 'custom') {
      setCustomColor(color);
    }
    onColorChange(color);
  };

  const handleHeaderChange = (field, value) => {
    const updatedHeader = { ...header, [field]: value };
    
    if (field === 'logo' && value === null) {
      setLogoDeleted(true);
    } else if (field === 'logo' && value !== null) {
      setLogoDeleted(false);
    }
    
    onHeaderChange(updatedHeader);
  };

  const handlePagePropertiesChange = (field, value) => {
    const updatedPageProperties = { ...pageProperties, [field]: value };
    onPagePropertiesChange(updatedPageProperties);
  };

  const handleSocialLinksChange = (field, value) => {
    const updatedSocialLinks = { ...socialLinks, [field]: value };
    if (onFooterChange) {
      onFooterChange(updatedSocialLinks);
    }
  };

  const handleImageUpdate = (imageFile) => {
    handleHeaderChange('logo', imageFile);
    setIsImageUploadOpen(false);
  };

  const handleSaveTheme = () => {
    const apiThemeValue = LAYOUT_TO_THEME[selectedLayout];

    const payload = {
      theme: apiThemeValue,
      colors: JSON.stringify({
        primary: `${selectedColor.color1}-${selectedColor.color2}`,
        text_color: selectedColor.textColor,
      }),
    };
    if (userType === "staff") {
      dispatch(updateThemeStaff(payload));
    } else {
      dispatch(updateTheme(payload));
    }
  };

  const handleSaveHeader = async () => {
    const formData = new FormData();
    formData.append('nickname', header.title);
    formData.append('show_nickname', header.visibleTitle ? 1 : 0);
    formData.append('show_photo', header.visibleLogo ? 1 : 0);

    if (header.logo) {
      if (typeof header.logo === 'string' && header.logo.startsWith('data:')) {
        const response = await fetch(header.logo);
        const blob = await response.blob();
        const file = new File([blob], 'logo.png', { type: 'image/png' });
        formData.append('photo', file);
      } else if (header.logo instanceof File) {
        formData.append('photo', header.logo);
      }
    } else if (logoDeleted) {
      formData.append('photo', '');
      formData.append('remove_photo', '1')
    }

    if (userType === "staff") {
      await dispatch(updateThemeStaff(formData));
    } else {
      await dispatch(updateTheme(formData));
    }
    
    if (logoDeleted) {
      setLogoDeleted(false);
    }
  };

  const handleDeleteLogo = async () => {
    const formData = new FormData();
    formData.append('nickname', header.title);
    formData.append('show_nickname', header.visibleTitle ? 1 : 0);
    formData.append('show_photo', header.visibleLogo ? 1 : 0);
    formData.append('photo', '');
    formData.append('remove_photo', '1'); 

    if (userType === "staff") {
      await dispatch(updateThemeStaff(formData));
    } else {
      await dispatch(updateTheme(formData));
    }

    handleHeaderChange('logo', null);
    setLogoDeleted(true);
  };

 const handleSaveFooter = () => {
  const payload = {
    footer_facebook: socialLinks.facebook,
    show_facebook: socialLinks.visibleFacebook ? 1 : 0,
    footer_instagram: socialLinks.instagram,
    show_instagram: socialLinks.visibleInstagram ? 1 : 0,
    footer_x: socialLinks.x,
    show_x: socialLinks.visibleX ? 1 : 0,
    footer_linkedin: socialLinks.linkedin,
    show_linkedin: socialLinks.visibleLinkedin ? 1 : 0,
    footer_tiktok: socialLinks.tiktok,  
    show_tiktok: socialLinks.visibleTiktok ? 1 : 0,  
    footer_snapchat: socialLinks.snapchat, 
    show_snapchat: socialLinks.visibleSnapchat ? 1 : 0,
    footer_whatsapp: socialLinks.whatsapp,  // ✅ جديد
    show_whatsapp: socialLinks.visibleWhatsapp ? 1 : 0,  // ✅ جديد
    footer_phone: socialLinks.phone,
    show_phone: socialLinks.visiblePhone ? 1 : 0,
    footer_email: socialLinks.email,
    show_email: socialLinks.visibleEmail ? 1 : 0,
  };
  if (userType === "staff") {
    dispatch(updateThemeStaff(payload));
  } else {
    dispatch(updateTheme(payload));
  }
};

  const stripHtml = (html) => {
    return html.replace(/<[^>]*>/g, '');
  };

  const handleSavePageProperties = () => {
    const payload = {
      page_title: pageProperties.title,
      page_description: pageProperties.description,
      show_page_title: pageProperties.visibleTitle ? 1 : 0,
      show_page_description: pageProperties.visibleDescription ? 1 : 0,
    };
    if (userType === "staff") {
      dispatch(updateThemeStaff(payload));
    } else {
      dispatch(updateTheme(payload));
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow pb-3">
      <div className="divide-y">
        {/* Theme Section */}
        <div>
          <div 
            className="flex justify-between items-center p-4 cursor-pointer" 
            onClick={() => toggleSection('theme')}
          >
            <span className="text-sm font-medium">Theme</span>
            {openSection === 'theme' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </div>

          {openSection === 'theme' && (
            <div className="p-4 bg-gray-50">
              <div className="mb-4">
                <p className="text-sm font-medium mb-2">Layouts</p>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    onClick={() => handleLayoutChange('sleek')}
                    className={`p-2 bg-white rounded-lg cursor-pointer relative border-2 ${
                      selectedLayout === 'sleek' ? 'border-indigo-600' : 'border-gray-200'
                    }`}
                  >
                    <div className="mb-1 text-sm">Sleek</div>
                    <div className="w-full h-3 bg-gray-100 rounded mb-1"></div>
                    <div className="w-full h-3 bg-gray-100 rounded mb-1"></div>
                    <div className="w-full h-3 bg-gray-100 rounded"></div>
                    {selectedLayout === 'sleek' && (
                      <div className="absolute bottom-0 right-0 bg-indigo-600 rounded-tl-md rounded-br-md p-1">
                        <Check size={17} className="text-white" />
                      </div>
                    )}
                  </div>

                  {/* <div
                    onClick={() => handleLayoutChange('default')}
                    className={`p-2 bg-white rounded-lg cursor-pointer relative border-2 ${
                      selectedLayout === 'default' ? 'border-indigo-600' : 'border-gray-200'
                    }`}
                  >
                    <div className="mb-1 text-sm">Default</div>
                    <div className="w-full h-3 bg-gray-100 rounded mb-1"></div>
                    <div className="w-full h-3 bg-gray-100 rounded mb-1"></div>
                    <div className="w-full h-3 bg-gray-100 rounded"></div>
                    {selectedLayout === 'default' && (
                      <div className="absolute bottom-0 right-0 bg-indigo-600 rounded-tl-md rounded-br-md p-1">
                        <Check size={17} className="text-white" />
                      </div>
                    )}
                  </div> */}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium mb-2">Color Options</p>
                <div className="grid grid-cols-5 gap-2">
                  {colorOptions.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => handleColorChange(color)}
                      className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all ${
                        selectedColor && 
                        selectedColor.color1 === color.color1 && 
                        selectedColor.color2 === color.color2
                          ? 'ring-2 ring-offset-2 ring-indigo-600 border-indigo-600' 
                          : 'border-gray-300'
                      }`}
                      style={{
                        background: `linear-gradient(135deg, ${color.color1} 50%, ${color.color2} 50%)`
                      }}
                      title={`${color.color1} / ${color.color2}`}
                    />
                  ))}
                  <button
                    key="custom"
                    onClick={() => setIsColorModalOpen(true)}
                    className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all relative ${
                      selectedColor?.type === 'custom' 
                        ? 'ring-2 ring-offset-2 ring-indigo-600 border-indigo-600' 
                        : 'border-gray-300'
                    }`}
                    style={{
                      background: `linear-gradient(135deg, ${customColor.color1} 50%, ${customColor.color2} 50%)`
                    }}
                    title="Custom Color"
                  >
                  <Plus size={20} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white drop-shadow-md" />
                </button>
                </div>
              {/* Color Modal */}
              {isColorModalOpen && (
                <div 
                  className="absolute inset-0 flex items-center justify-center z-50"
                  onClick={() => setIsColorModalOpen(false)}
                >
                  <div 
                    className="bg-white rounded-2xl shadow-2xl w-96 max-w-[90%] overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Header */}
                    <div className="flex justify-between items-center p-5 border-b">
                      <h3 className="text-lg font-semibold text-gray-800">Custom Colors</h3>
                      <button
                        onClick={() => setIsColorModalOpen(false)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X size={24} />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                      {/* Color 1 */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Primary Color</label>
                        <div className="flex items-center gap-3">
                           <div className="relative">
                            <input
                              type="color"
                              value={customColor.color2}
                              onChange={(e) => {
                                const newColor = { ...customColor, color2: e.target.value };
                                setCustomColor(newColor);
                                handleColorChange(newColor);
                              }}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div 
                              className="w-8 h-8  rounded-lg border-2 border-gray-200 shadow-sm hover:border-gray-300 transition-colors cursor-pointer"
                              style={{ backgroundColor: customColor.color2 }}
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-600">Background Color</p>
                            {/* <p className="text-xs text-gray-400 font-mono">{customColor.color1}</p> */}
                          </div>
                        </div>
                      </div>

                      {/* Color 2 */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Selected Items</label>
                        <div className="flex items-center gap-3">
                         <div className="relative">
                            <input
                              type="color"
                              value={customColor.color1}
                              onChange={(e) => {
                                const newColor = { ...customColor, color1: e.target.value };
                                setCustomColor(newColor);
                                handleColorChange(newColor);
                              }}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div 
                              className="w-8 h-8 rounded-lg border-2 border-gray-200 shadow-sm hover:border-gray-300 transition-colors cursor-pointer"
                              style={{ backgroundColor: customColor.color1 }}
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-600">Background Items</p>
                            {/* <p className="text-xs text-gray-400 font-mono">{customColor.color2}</p> */}
                          </div>
                        </div>
                      </div>

                      {/* Text Color */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Text Color</label>
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <input
                              type="color"
                              value={customColor.textColor}
                              onChange={(e) => {
                                const newColor = { ...customColor, textColor: e.target.value };
                                setCustomColor(newColor);
                                handleColorChange(newColor);
                              }}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div 
                              className="w-8 h-8 rounded-lg border-2 border-gray-200 shadow-sm hover:border-gray-300 transition-colors cursor-pointer"
                              style={{ backgroundColor: customColor.textColor }}
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-600">Text & Icons</p>
                            {/* <p className="text-xs text-gray-400 font-mono">{customColor.textColor}</p> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              </div>

              <button 
                onClick={handleSaveTheme} 
                className="py-2 px-5 text-sm rounded-lg w-24 text-white bg-[#5646A5]"
                disabled={!selectedColor}
              >
                Save
              </button>
            </div>
          )}
        </div>

        {/* Header Section */}
        <div>
          <div
            className="flex justify-between items-center p-4 cursor-pointer"
            onClick={() => toggleSection('header')}
          >
            <span className="text-sm font-medium">Header</span>
            {openSection === 'header' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </div>

          {openSection === 'header' && (
            <div className="p-4 bg-gray-50">
              <div>
                <div className='flex justify-between mb-1'>
                  <label className="block text-sm font-medium">Title</label>
                  <button 
                    className='cursor-pointer text-gray-500 hover:text-gray-700'
                    onClick={() => handleHeaderChange('visibleTitle', !header.visibleTitle)}
                  >
                    {header.visibleTitle ? <Eye size={17} /> : <EyeOff size={17} />}
                  </button>
                </div>
                <input
                  type="text"
                  value={header.title}
                  onChange={(e) => handleHeaderChange('title', e.target.value)}
                  className="w-full p-2 border rounded-lg mb-4 text-sm"
                  placeholder="Header Title"
                />
              </div>

              <div>
                <div className='flex justify-between mb-1'>
                  <label className="block text-sm font-medium">Logo</label>
                  <button 
                    className='cursor-pointer text-gray-500 hover:text-gray-700'
                    onClick={() => handleHeaderChange('visibleLogo', !header.visibleLogo)}
                  >
                    {header.visibleLogo ? <Eye size={17} /> : <EyeOff size={17} />}
                  </button>
                </div>
                {header.logo ? (
                  <div className="flex items-center justify-between w-full p-3 border border-dashed border-gray-300 rounded-lg bg-gray-50 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded overflow-hidden">
                        <img src={typeof header.logo === 'string' ? header.logo : URL.createObjectURL(header.logo)} alt="Logo" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-sm text-gray-600">Logo uploaded</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setIsImageUploadOpen(true)}
                        className="text-indigo-600 text-sm hover:underline"
                      >
                        Change
                      </button>
                      <button
                        type="button"
                        onClick={handleDeleteLogo}
                        className="text-red-600 text-sm hover:underline"
                        title="Delete logo"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsImageUploadOpen(true)}
                    className="w-full p-3 border border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-between transition-colors mb-4"
                  >
                    <span className="text-sm text-gray-600">Upload logo</span>
                    <Upload size={17} className='text-gray-500' />
                  </button>
                )}
              </div>

              <button onClick={handleSaveHeader} className="py-2 px-5 text-sm rounded-lg w-24 text-white bg-[#5646A5]">
                Save
              </button>
            </div>
          )}
        </div>

        {/* Footer Section */}
        <div>
          <div
            className="flex justify-between items-center p-4 cursor-pointer"
            onClick={() => toggleSection('footer')}
          >
            <span className="text-sm font-medium">Footer</span>
            {openSection === 'footer' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </div>

          {openSection === 'footer' && (
            <div className="p-4 bg-gray-50 space-y-3">
              {/* Facebook */}
              <div className="flex flex-col gap-2">
                <div className='flex justify-between w-full items-center'>
                  <p className="text-sm text-gray-700">Facebook</p>
                  <button 
                    className='cursor-pointer text-gray-500 hover:text-gray-700'
                    onClick={() => handleSocialLinksChange('visibleFacebook', !socialLinks.visibleFacebook)}
                  >
                    {socialLinks.visibleFacebook ? <Eye size={17} /> : <EyeOff size={17} />}
                  </button>
                </div>
                <input
                  type="url"
                  placeholder="https://facebook.com/yourpage"
                  value={socialLinks.facebook}
                  onChange={(e) => handleSocialLinksChange('facebook', e.target.value)}
                  className="w-full p-2 border rounded-lg text-sm"
                />
              </div>

              {/* Instagram */}
              <div className="flex flex-col gap-2">
                <div className='flex justify-between w-full items-center'>
                  <p className="text-sm text-gray-700">Instagram</p>
                  <button 
                    className='cursor-pointer text-gray-500 hover:text-gray-700'
                    onClick={() => handleSocialLinksChange('visibleInstagram', !socialLinks.visibleInstagram)}
                  >
                    {socialLinks.visibleInstagram ? <Eye size={17} /> : <EyeOff size={17} />}
                  </button>
                </div>
                <input
                  type="url"
                  placeholder="https://instagram.com/yourhandle"
                  value={socialLinks.instagram}
                  onChange={(e) => handleSocialLinksChange('instagram', e.target.value)}
                  className="w-full p-2 border rounded-lg text-sm"
                />
              </div>

              {/* X (Twitter) */}
              <div className="flex flex-col gap-2">
                <div className='flex justify-between w-full items-center'>
                  <p className="text-sm text-gray-700">X</p>
                  <button 
                    className='cursor-pointer text-gray-500 hover:text-gray-700'
                    onClick={() => handleSocialLinksChange('visibleX', !socialLinks.visibleX)}
                  >
                    {socialLinks.visibleX ? <Eye size={17} /> : <EyeOff size={17} />}
                  </button>
                </div>
                <input
                  type="url"
                  placeholder="https://x.com/yourhandle"
                  value={socialLinks.x}
                  onChange={(e) => handleSocialLinksChange('x', e.target.value)}
                  className="w-full p-2 border rounded-lg text-sm"
                />
              </div>

              {/* LinkedIn */}
              <div className="flex flex-col gap-2">
                <div className='flex justify-between w-full items-center'>
                  <p className="text-sm text-gray-700">LinkedIn</p>
                  <button 
                    className='cursor-pointer text-gray-500 hover:text-gray-700'
                    onClick={() => handleSocialLinksChange('visibleLinkedin', !socialLinks.visibleLinkedin)}
                  >
                    {socialLinks.visibleLinkedin ? <Eye size={17} /> : <EyeOff size={17} />}
                  </button>
                </div>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/yourprofile"
                  value={socialLinks.linkedin}
                  onChange={(e) => handleSocialLinksChange('linkedin', e.target.value)}
                  className="w-full p-2 border rounded-lg text-sm"
                />
              </div>
               {/* TikTok */}
                <div className="flex flex-col gap-2">
                  <div className='flex justify-between w-full items-center'>
                    <p className="text-sm text-gray-700">TikTok</p>
                    <button 
                      className='cursor-pointer text-gray-500 hover:text-gray-700'
                      onClick={() => handleSocialLinksChange('visibleTiktok', !socialLinks.visibleTiktok)}
                    >
                      {socialLinks.visibleTiktok ? <Eye size={17} /> : <EyeOff size={17} />}
                    </button>
                  </div>
                  <input
                    type="url"
                    placeholder="https://tiktok.com/@yourhandle"
                    value={socialLinks.tiktok}
                    onChange={(e) => handleSocialLinksChange('tiktok', e.target.value)}
                    className="w-full p-2 border rounded-lg text-sm"
                  />
                </div>

           {/* Snapchat */}
            <div className="flex flex-col gap-2">
              <div className='flex justify-between w-full items-center'>
                <p className="text-sm text-gray-700">Snapchat</p>
                <button 
                  className='cursor-pointer text-gray-500 hover:text-gray-700'
                  onClick={() => handleSocialLinksChange('visibleSnapchat', !socialLinks.visibleSnapchat)}
                >
                  {socialLinks.visibleSnapchat ? <Eye size={17} /> : <EyeOff size={17} />}
                </button>
              </div>
              <input
                type="url"
                placeholder="https://snapchat.com/add/yourhandle"
                value={socialLinks.snapchat}
                onChange={(e) => handleSocialLinksChange('snapchat', e.target.value)}
                className="w-full p-2 border rounded-lg text-sm"
              />
            </div>
           {/*whatsapp */}
            <div className="flex flex-col gap-2">
              <div className='flex justify-between w-full items-center'>
                <p className="text-sm text-gray-700">WhatsApp</p>
                <button 
                  className='cursor-pointer text-gray-500 hover:text-gray-700'
                  onClick={() => handleSocialLinksChange('visibleWhatsapp', !socialLinks.visibleWhatsapp)}
                >
                  {socialLinks.visibleWhatsapp ? <Eye size={17} /> : <EyeOff size={17} />}
                </button>
              </div>
              <input
                type="url"
                placeholder="https://wa.me/201234567890"
                value={socialLinks.whatsapp}
                onChange={(e) => handleSocialLinksChange('whatsapp', e.target.value)}
                className="w-full p-2 border rounded-lg text-sm"
              />
            </div>
              {/* Phone */}
              <div className="flex flex-col gap-2">
                <div className='flex justify-between w-full items-center'>
                  <p className="text-sm text-gray-700">Phone</p>
                  <button 
                    className='cursor-pointer text-gray-500 hover:text-gray-700'
                    onClick={() => handleSocialLinksChange('visiblePhone', !socialLinks.visiblePhone)}
                  >
                    {socialLinks.visiblePhone ? <Eye size={17} /> : <EyeOff size={17} />}
                  </button>
                </div>
                <input
                  type="tel"
                  placeholder="+1234567890"
                  value={socialLinks.phone}
                  onChange={(e) => handleSocialLinksChange('phone', e.target.value)}
                  className="w-full p-2 border rounded-lg text-sm"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">
                <div className='flex justify-between w-full items-center'>
                  <p className="text-sm text-gray-700">Email</p>
                  <button 
                    className='cursor-pointer text-gray-500 hover:text-gray-700'
                    onClick={() => handleSocialLinksChange('visibleEmail', !socialLinks.visibleEmail)}
                  >
                    {socialLinks.visibleEmail ? <Eye size={17} /> : <EyeOff size={17} />}
                  </button>
                </div>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={socialLinks.email}
                  onChange={(e) => handleSocialLinksChange('email', e.target.value)}
                  className="w-full p-2 border rounded-lg text-sm"
                />
              </div>

              <button onClick={handleSaveFooter} className="py-2 px-5 text-sm rounded-lg w-24 text-white bg-[#5646A5]">
                Save
              </button>
            </div>
          )}
        </div>

        {/* Page Properties Section */}
        <div>
          <div
            className="flex justify-between items-center p-4 cursor-pointer"
            onClick={() => toggleSection('properties')}
          >
            <span className="text-sm font-medium">Page Properties</span>
            {openSection === 'properties' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </div>

          {openSection === 'properties' && (
            <div className="p-4 bg-gray-50">
              <div>
                <div className='flex justify-between mb-1'>
                  <label className="block text-sm font-medium">Page Title</label>
                  <button 
                    className='cursor-pointer text-gray-500 hover:text-gray-700'
                    onClick={() => handlePagePropertiesChange('visibleTitle', !pageProperties.visibleTitle)}
                  >
                    {pageProperties.visibleTitle ? <Eye size={17} /> : <EyeOff size={17} />}
                  </button>
                </div>
                <input
                  type="text"
                  value={pageProperties.title}
                  onChange={(e) => handlePagePropertiesChange('title', e.target.value)}
                  className="w-full p-2 border rounded-lg mb-4 text-sm"
                  placeholder="Page Title"
                />
              </div>

              <div>
                <div className='flex justify-between mb-1'>
                  <label className="block text-sm font-medium">Page Description</label>
                  <button 
                    className='cursor-pointer text-gray-500 hover:text-gray-700'
                    onClick={() => handlePagePropertiesChange('visibleDescription', !pageProperties.visibleDescription)}
                  >
                    {pageProperties.visibleDescription ? <Eye size={17} /> : <EyeOff size={17} />}
                  </button>
                </div>
                <textarea
                  value={pageProperties.description}
                  onChange={(e) => handlePagePropertiesChange('description', e.target.value)}
                  placeholder="Page Description"
                  className="w-full h-32 p-2 border rounded-lg mb-4 text-sm"
                />
              </div>

              <button onClick={handleSavePageProperties} className="py-2 px-5 text-sm rounded-lg w-24 text-white bg-[#5646A5]">
                Save
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ImageUploadCrop Component for Logo */}
      <ImageUploadCrop
        isOpen={isImageUploadOpen}
        onClose={() => setIsImageUploadOpen(false)}
        onImageUpdate={handleImageUpdate}
        currentImage={typeof header.logo === 'string' ? header.logo : header.logo}
      />
    </div>
  );
};

export default ThemePanel;