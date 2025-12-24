
import { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, Check, Info, Upload, EyeOff, Eye, X } from 'lucide-react';
import ImageUploadCrop from '../../InterviewsPages/InterViewPage/ImageUploadCrop';
import { useDispatch, useSelector } from 'react-redux';
import { updateTheme } from '../../../../redux/apiCalls/ThemeCallApi';
import { LAYOUT_TO_THEME } from './LayoutShapes/themeMapping';

const WorkspaceThemePanel = ({ onLayoutChange, onThemeChange, currentId, isInterview,workspace ,interview }) => {
  const dispatch = useDispatch();
  const theme = useSelector(state => state.themes?.theme?.theme);

  const [openSection, setOpenSection] = useState('');
  const [selectedLayout, setSelectedLayout] = useState('');
  const [selectedColor, setSelectedColor] = useState('#4f46e5');
  const [textColor, setTextColor] = useState('');
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [backgroundOpacity, setBackgroundOpacity] = useState(100);

  const [header, setHeader] = useState({
    title: '',
    logo: null,
    visibleTitle: true,
    visibleLogo: true
  });

  const [logoDeleted, setLogoDeleted] = useState(false);

  const [pageProperties, setPageProperties] = useState({
    title: 'Welcome',
    description: 'Book your appointment in a few simple steps: Choose a service, pick your date and time, and fill in your details. See you soon',
    visibleTitle: true,
    visibleDescription: true
  });

  const [buttonText, setButtonText] = useState('Book appointment');
  const [preSelect, setPreSelect] = useState(true);

  const [socialLinks, setSocialLinks] = useState({
    facebook: '', visibleFacebook: true,
    instagram: '', visibleInstagram: true,
    x: '', visibleX: true,
    linkedin: '', visibleLinkedin: true,
    phone: '', visiblePhone: true,
    email: '', visibleEmail: true,
  });

  const [isImageUploadOpen, setIsImageUploadOpen] = useState(false);
  const [isBackgroundUploadOpen, setIsBackgroundUploadOpen] = useState(false);

  useEffect(() => {
    if (theme) {
      const toBool = (val) => val === 1 || val === "1" || val === true;

      const reverseMap = Object.fromEntries(
        Object.entries(LAYOUT_TO_THEME).map(([ui, api]) => [api, ui])
      );
      const uiLayout = reverseMap[theme.theme];
      setSelectedLayout(uiLayout || '');

      let parsedColors = {};
      try { parsedColors = JSON.parse(theme.colors || '{}'); } catch {}

      setSelectedColor(parsedColors.primary || '#4f46e5');
      setTextColor(parsedColors.text_color || '');
      setBackgroundImage(parsedColors.background_image ? `data:image/png;base64,${parsedColors.background_image}` : null);
      setBackgroundOpacity((parsedColors.background_opacity || 1) * 100);
      setButtonText(theme.book_button || 'Book appointment');
      setPreSelect(toBool(theme.for_interviews));

      const hasPhoto = theme.photo && theme.photo.trim() !== '';
      setLogoDeleted(!hasPhoto);

      setHeader({
        title: theme.nickname || 'Ahmed',
        logo: logoDeleted ? null : (theme.photo || null),
        visibleTitle: toBool(theme.show_nickname),
        visibleLogo: toBool(theme.show_photo),
      });

      setPageProperties({
        title: theme.page_title || 'Welcome',
        description: theme.page_description || '',
        visibleTitle: toBool(theme.show_page_title),
        visibleDescription: toBool(theme.show_page_description),
      });

      setSocialLinks({
        facebook: theme.footer_facebook || '',
        visibleFacebook: toBool(theme.show_facebook),
        instagram: theme.footer_instagram || '',
        visibleInstagram: toBool(theme.show_instagram),
        x: theme.footer_x || '',
        visibleX: toBool(theme.show_x),
        linkedin: theme.footer_linkedin || '',
        visibleLinkedin: toBool(theme.show_linkedin),
        phone: theme.footer_phone || '',
        visiblePhone: toBool(theme.show_phone),
        email: theme.footer_email || '',
        visibleEmail: toBool(theme.show_email),
      });
    }else {
      setSelectedLayout('modernWeb');
      const firstColor = colorOptions[0];
      setSelectedColor(`${firstColor.color1}-${firstColor.color2}`);
      setTextColor(firstColor.textColor);
    }
  }, [theme]);

  useEffect(() => {
    onThemeChange({
      layout: selectedLayout,
      color: selectedColor,
      textColor,
      backgroundImage,
      backgroundOpacity,
      header,
      pageProperties,
      buttonText,
      preSelect,
      socialLinks,
    });
  }, [selectedLayout, selectedColor, backgroundImage, backgroundOpacity, header, pageProperties, buttonText, preSelect, socialLinks, textColor, onThemeChange]);

  useEffect(() => {
    return () => {
      if (header.logo && typeof header.logo === 'string' && header.logo.startsWith('blob:')) {
        URL.revokeObjectURL(header.logo);
      }
      if (backgroundImage && typeof backgroundImage === 'string' && backgroundImage.startsWith('blob:')) {
        URL.revokeObjectURL(backgroundImage);
      }
    };
  }, [header.logo, backgroundImage]);

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

  const handleColorChange = (colorKey, textColor) => {
    setSelectedColor(colorKey);
    setTextColor(textColor);
  };

  const handleImageUpdate = (imageFile) => {
    setHeader({ ...header, logo: imageFile });
    setLogoDeleted(false);
    setIsImageUploadOpen(false);
  };

  const handleBackgroundImageUpdate = (imageFile) => {
    setBackgroundImage(imageFile);
    setIsBackgroundUploadOpen(false);
  };

  const toBase64 = async (fileOrUrl) => {
    if (!fileOrUrl) return null;
    if (typeof fileOrUrl === 'string' && fileOrUrl.startsWith('data:')) {
      return fileOrUrl.split(',')[1];
    }
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(fileOrUrl);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
    });
  };

  const handleSaveTheme = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const backgroundBase64 = await toBase64(backgroundImage);
    const apiThemeValue = LAYOUT_TO_THEME[selectedLayout];

    const payload = {
      ...(isInterview ? { interview_id: currentId } : { work_space_id: currentId }),
      theme: apiThemeValue,
      colors: JSON.stringify({
        primary: selectedColor,
        text_color: textColor,
        background_image: backgroundBase64,
        background_opacity: backgroundOpacity / 100,
      }),
      book_button: buttonText,
      for_interviews: preSelect,
    };

    dispatch(updateTheme(payload));
  };

  const handleSaveHeader = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const formData = new FormData();

    if (isInterview) {
      formData.append('interview_id', currentId);
    } else {
      formData.append('work_space_id', currentId);
    }

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
      formData.append('remove_photo', '1');
    }

    await dispatch(updateTheme(formData));

    if (logoDeleted) {
      setLogoDeleted(false);
    }
  };

  const handleDeleteLogo = async () => {
    const formData = new FormData();

    if (isInterview) {
      formData.append('interview_id', currentId);
    } else {
      formData.append('work_space_id', currentId);
    }

    formData.append('nickname', header.title);
    formData.append('show_nickname', header.visibleTitle ? 1 : 0);
    formData.append('show_photo', header.visibleLogo ? 1 : 0);
    formData.append('photo', '');
    formData.append('remove_photo', '1');

    await dispatch(updateTheme(formData));

    setHeader({ ...header, logo: null });
    setLogoDeleted(true);
  };

  const handleSaveFooter = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const payload = {
      ...(isInterview ? { interview_id: currentId } : { work_space_id: currentId }),
      footer_facebook: socialLinks.facebook,
      show_facebook: socialLinks.visibleFacebook ? 1 : 0,
      footer_instagram: socialLinks.instagram,
      show_instagram: socialLinks.visibleInstagram ? 1 : 0,
      footer_x: socialLinks.x,
      show_x: socialLinks.visibleX ? 1 : 0,
      footer_linkedin: socialLinks.linkedin,
      show_linkedin: socialLinks.visibleLinkedin ? 1 : 0,
      footer_phone: socialLinks.phone,
      show_phone: socialLinks.visiblePhone ? 1 : 0,
      footer_email: socialLinks.email,
      show_email: socialLinks.visibleEmail ? 1 : 0,
    };

    dispatch(updateTheme(payload));
  };

  const cleanHTML = (html) => {
    if (!html) return '';

    let cleaned = html;

    cleaned = cleaned.replace(/<span class="ql-cursor">.*?<\/span>/g, '');

    cleaned = cleaned.replace(/\sclass="[^"]*"/g, '');

    for (let i = 0; i < 5; i++) {
      cleaned = cleaned.replace(/<(\w+)><\/\1>/g, '');
      cleaned = cleaned.replace(/<(\w+)\s*><\/\1>/g, '');
    }

    cleaned = cleaned.replace(/<(em|strong|u|i|b)>\s*<\/\1>/g, '');

    cleaned = cleaned.replace(/[\u200B-\u200D\uFEFF\u00A0]/g, '');
    cleaned = cleaned.replace(/\uFEFF/g, '');

    cleaned = cleaned.replace(/>\s+</g, '><');

    cleaned = cleaned.replace(/\s{2,}/g, ' ');

    return cleaned.trim();
  };

  const handleSavePageProperties = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const payload = {
      ...(isInterview ? { interview_id: currentId } : { work_space_id: currentId }),
      page_title: pageProperties.title,
      page_description: cleanHTML(pageProperties.description),
      show_page_title: pageProperties.visibleTitle ? 1 : 0,
      show_page_description: pageProperties.visibleDescription ? 1 : 0,
    };

    dispatch(updateTheme(payload));
  };

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow pb-3">
      <div className="divide-y">
        {/* === Theme Section === */}
        <div>
          <div className="flex justify-between items-center p-4 cursor-pointer" onClick={() => toggleSection('theme')}>
            <span className="text-sm">Theme</span>
            {openSection === 'theme' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </div>

          {openSection === 'theme' && (
            <div className="p-4 bg-gray-50">
              <div className="mb-4">
                <p className="mb-2">Layouts</p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {['newLayout', 'modernWeb', 'classic', 'fresh'].map((layout) => (
                    <div
                      key={layout}
                      className={`p-2 bg-white rounded-lg cursor-pointer relative ${selectedLayout === layout ? 'border border-indigo-600' : 'border'}`}
                      onClick={() => handleLayoutChange(layout)}
                    >
                      <div className="mb-1 text-sm capitalize">{layout.replace(/([A-Z])/g, ' $1').trim()}</div>
                      <div className="w-full h-4 bg-gray-100 rounded mb-1"></div>
                      <div className="w-full h-4 bg-gray-100 rounded mb-1"></div>
                      <div className="w-full h-4 bg-gray-100 rounded"></div>
                      {selectedLayout === layout && (
                        <div className="absolute bottom-0 right-0 bg-indigo-600 rounded-tl-md rounded-br-md p-1">
                          <Check size={17} className="text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {selectedLayout !== 'fresh' && (
                  <>
                    <p className="mb-2">Color Options</p>
                    <div className="grid grid-cols-6 sm:grid-cols-7 md:grid-cols-8 gap-1 mb-4">
                     {colorOptions.map((option, index) => {
                    const colorKey = `${option.color1}-${option.color2}`;
                    const isSelected = selectedColor === colorKey;
                    
                    return (
                      <div
                        key={index}
                        className={`w-7 h-7 rounded-md cursor-pointer overflow-hidden relative ${isSelected ? 'ring-2 ring-offset-2 ring-indigo-600' : ''}`}
                        style={isSelected ? { '--tw-ring-color': option.color2 } : {}}
                        onClick={() => handleColorChange(colorKey, option.textColor)}
                      >
                        <span 
                          className="absolute inset-0"
                          style={{
                            backgroundColor: option.color1
                          }}
                        />
                        <span 
                          className="absolute inset-0"
                          style={{
                            backgroundColor: option.color2,
                            clipPath: 'polygon(100% 0, 100% 100%, 0 100%)'
                          }}
                        />
                        <span 
                          className="absolute w-full"
                          style={{
                            height: '1px',
                            backgroundColor: 'white',
                            transform: 'rotate(-45deg)',
                            transformOrigin: 'center',
                            top: '50%',
                            left: '0',
                            width: '141.42%',
                            marginLeft: '-20.71%'
                          }}
                        />
                      </div>
                    );
                  })}
                      
                    </div>

                    {/* <div className="mb-4">
                      <p className="mb-2">Background Image</p>
                      {backgroundImage ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between w-full p-3 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                            <div className="flex items-center gap-2">
                              <div className="w-12 h-12 rounded overflow-hidden">
                                <img src={typeof backgroundImage === 'string' ? backgroundImage : URL.createObjectURL(backgroundImage)} alt="Background" className="w-full h-full object-cover" />
                              </div>
                              <span className="text-sm text-gray-600">uploaded</span>
                            </div>
                            <div className="flex gap-2">
                              <button type="button" onClick={() => setIsBackgroundUploadOpen(true)} className="text-indigo-600 text-sm hover:underline">Change</button>
                              <button type="button" onClick={() => { setBackgroundImage(null); setBackgroundOpacity(100); }} className="text-red-600 text-sm hover:underline"><X size={16} /></button>
                            </div>
                          </div>
                          <div className="w-full">
                            <div className="flex justify-between items-center mb-2">
                              <label className="text-sm text-gray-600">opacity %</label>
                              <span className="text-sm font-medium text-gray-900">{backgroundOpacity}</span>
                            </div>
                            <input type="range" min="0" max="100" value={backgroundOpacity} onChange={(e) => setBackgroundOpacity(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                          </div>
                        </div>
                      ) : (
                        <button type="button" onClick={() => setIsBackgroundUploadOpen(true)} className="w-full p-3 border border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-between transition-colors">
                          <span className="text-sm text-gray-600">Upload background image</span>
                          <Upload size={17} className='text-gray-500' />
                        </button>
                      )}
                    </div> */}
                  </>
                )}

                {selectedLayout === 'modernWeb' && (
                  <>
                    <div className="mb-4">
                      <p className="mb-2">Button Text</p>
                      <input type="text" value={buttonText} onChange={(e) => setButtonText(e.target.value)} className="w-full p-2 border rounded" />
                    </div>
                    <div className="mb-4 flex items-center">
                      <input type="checkbox" id="pre-select" checked={preSelect} onChange={(e) => setPreSelect(e.target.checked)} className="mr-2 h-4 w-4 accent-indigo-600" />
                      <label htmlFor="pre-select" className="text-sm">Pre-select options in booking page</label>
                      <Info size={16} className="ml-2 text-gray-400" />
                    </div>
                  </>
                )}

                <button type="button" onClick={handleSaveTheme} className="py-2 px-5 text-sm rounded-lg w-24 text-white bg-[#5646A5]" >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Header Section */}
        <div>
          <div
            className="flex justify-between items-center p-4 cursor-pointer"
            onClick={() => toggleSection('header')}
          >
            <span className="text-sm">Header</span>
            {openSection === 'header' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </div>
          {openSection === 'header' && (
            <div className="p-4 bg-gray-50">
              <div>
                <div className='flex justify-between mb-1'>
                  <label className="block text-sm font-medium">Title</label>
                  <button 
                    type="button"
                    className='cursor-pointer text-gray-500 hover:text-gray-700'
                    onClick={() => setHeader({ ...header, visibleTitle: !header.visibleTitle })}
                  >
                    {header.visibleTitle ? <Eye size={17} /> : <EyeOff size={17} />}
                  </button>
                </div>
              <input
                type="text"
                placeholder="Header Title"
                value={header.title}
                onChange={(e) => setHeader({ ...header, title: e.target.value })}
                className="w-full p-2 border rounded-lg mb-4 text-sm"
              />
              </div>
              <div>
                <div className='flex justify-between mb-1'>
                  <label className="block text-sm font-medium">Logo</label>
                  <button 
                    type="button"
                    className='cursor-pointer text-gray-500 hover:text-gray-700'
                    onClick={() => setHeader({ ...header, visibleLogo: !header.visibleLogo })}
                  >
                    {header.visibleLogo ? <Eye size={17} /> : <EyeOff size={17} />}
                  </button>
                </div>
              {header.logo ? (
                <div className="flex items-center justify-between w-full p-3 border border-dashed border-gray-300 rounded-lg bg-gray-50 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded overflow-hidden">
                      <img 
                        src={typeof header.logo === 'string' ? header.logo : URL.createObjectURL(header.logo)} 
                        alt="Logo" 
                        className="w-full h-full object-cover" 
                      />
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

              {/* Save Button for Header */}
              <button
                type="button"
                onClick={handleSaveHeader}
                className="py-2 px-5 text-sm rounded-lg w-24 text-white bg-[#5646A5]"
              >
                Save
              </button>
            </div>
          )}
        </div>

        {/* Footer Section */}
        <div>
          <div
            className="flex justify-between items-center p-4 cursor-pointer"
            onClick={() => toggleSection('social')}
          >
            <span className="text-sm">Footer</span>
            {openSection === 'social' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </div>

          {openSection === 'social' && (
            <div className="p-4 bg-gray-50 space-y-3">
              {/* Facebook */}
              <div className="flex flex-col gap-2">
                <div className='flex justify-between w-full items-center'>
                  <p className="font-sans text-sm text-gray-700">Facebook</p>
                  <button 
                    type="button"
                    className='cursor-pointer text-gray-500 hover:text-gray-700'
                    onClick={() => setSocialLinks({ ...socialLinks, visibleFacebook: !socialLinks.visibleFacebook })}
                  >
                    {socialLinks.visibleFacebook ? <Eye size={17} /> : <EyeOff size={17} />}
                  </button>
                </div>
                <input
                  type="url"
                  placeholder="https://facebook.com/yourpage"
                  value={socialLinks.facebook}
                  onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })}
                  className="flex-1 p-2 border rounded-lg text-sm w-full"
                />
              </div>

              {/* Instagram */}
              <div className="flex flex-col gap-2">
                <div className='flex justify-between w-full items-center'>
                  <p className="font-sans text-sm text-gray-700">Instagram</p>
                  <button 
                    type="button"
                    className='cursor-pointer text-gray-500 hover:text-gray-700'
                    onClick={() => setSocialLinks({ ...socialLinks, visibleInstagram: !socialLinks.visibleInstagram })}
                  >
                    {socialLinks.visibleInstagram ? <Eye size={17} /> : <EyeOff size={17} />}
                  </button>
                </div>
                <input
                  type="url"
                  placeholder="https://instagram.com/yourhandle"
                  value={socialLinks.instagram}
                  onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
                  className="flex-1 p-2 border rounded-lg text-sm w-full"
                />
              </div>

              {/* X (Twitter) */}
              <div className="flex flex-col gap-2">
                <div className='flex justify-between w-full items-center'>
                  <p className="font-sans text-sm text-gray-700">X</p>
                  <button 
                    type="button"
                    className='cursor-pointer text-gray-500 hover:text-gray-700'
                    onClick={() => setSocialLinks({ ...socialLinks, visibleX: !socialLinks.visibleX })}
                  >
                    {socialLinks.visibleX ? <Eye size={17} /> : <EyeOff size={17} />}
                  </button>
                </div>
                <input
                  type="url"
                  placeholder="https://x.com/yourhandle"
                  value={socialLinks.x}
                  onChange={(e) => setSocialLinks({ ...socialLinks, x: e.target.value })}
                  className="flex-1 p-2 border rounded-lg text-sm w-full"
                />
              </div>

              {/* LinkedIn */}
              <div className="flex flex-col gap-2">
                <div className='flex justify-between w-full items-center'>
                  <p className="font-sans text-sm text-gray-700">LinkedIn</p>
                  <button 
                    type="button"
                    className='cursor-pointer text-gray-500 hover:text-gray-700'
                    onClick={() => setSocialLinks({ ...socialLinks, visibleLinkedin: !socialLinks.visibleLinkedin })}
                  >
                    {socialLinks.visibleLinkedin ? <Eye size={17} /> : <EyeOff size={17} />}
                  </button>
                </div>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/yourprofile"
                  value={socialLinks.linkedin}
                  onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
                  className="flex-1 p-2 border rounded-lg text-sm w-full"
                />
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-2">
                <div className='flex justify-between w-full items-center'>
                  <p className="font-sans text-sm text-gray-700">Phone</p>
                  <button 
                    type="button"
                    className='cursor-pointer text-gray-500 hover:text-gray-700'
                    onClick={() => setSocialLinks({ ...socialLinks, visiblePhone: !socialLinks.visiblePhone })}
                  >
                    {socialLinks.visiblePhone ? <Eye size={17} /> : <EyeOff size={17} />}
                  </button>
                </div>
                <input
                  type="tel"
                  placeholder="+1234567890"
                  value={socialLinks.phone}
                  onChange={(e) => setSocialLinks({ ...socialLinks, phone: e.target.value })}
                  className="flex-1 p-2 border rounded-lg text-sm w-full"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">
                <div className='flex justify-between w-full items-center'>
                  <p className="font-sans text-sm text-gray-700">Email</p>
                  <button 
                    type="button"
                    className='cursor-pointer text-gray-500 hover:text-gray-700'
                    onClick={() => setSocialLinks({ ...socialLinks, visibleEmail: !socialLinks.visibleEmail })}
                  >
                    {socialLinks.visibleEmail ? <Eye size={17} /> : <EyeOff size={17} />}
                  </button>
                </div>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={socialLinks.email}
                  onChange={(e) => setSocialLinks({ ...socialLinks, email: e.target.value })}
                  className="flex-1 p-2 border rounded-lg text-sm w-full"
                />
              </div>

              {/* Save Button */}
              <button
                type="button"
                onClick={handleSaveFooter}
                className="py-2 px-5 text-sm rounded-lg w-24 text-white mt-4 bg-[#5646A5]"
              >
                Save
              </button>
            </div>
          )}
        </div>

        {/* Page Properties */}
        <div>
          <div
            className="flex justify-between items-center p-4 cursor-pointer"
            onClick={() => toggleSection('pageProperties')}
          >
            <span className="text-sm">Page Properties</span>
            {openSection === 'pageProperties' ? (
              <ChevronDown size={20} />
            ) : (
              <ChevronRight size={20} />
            )}
          </div>
          {openSection === 'pageProperties' && (
            <div className="p-4 bg-gray-50">
              <div>
                <div className='flex justify-between mb-1'>
                  <label className="block text-sm font-medium">Page Title</label>
                  <button 
                    type="button"
                    className='cursor-pointer text-gray-500 hover:text-gray-700'
                    onClick={() => setPageProperties({ ...pageProperties, visibleTitle: !pageProperties.visibleTitle })}
                  >
                    {pageProperties.visibleTitle ? <Eye size={17} /> : <EyeOff size={17} />}
                  </button>
                </div>
              <input
                type="text"
                placeholder="Page Title"
                value={pageProperties.title}
                onChange={(e) => setPageProperties({ ...pageProperties, title: e.target.value })}
                className="w-full p-2 border rounded-lg mb-4 text-sm"
              />
              </div>
              <div>
                <div className='flex justify-between mb-1'>
                  <label className="block text-sm font-medium">Page Description</label>
                  <button 
                    type="button"
                    className='cursor-pointer text-gray-500 hover:text-gray-700'
                    onClick={() => setPageProperties({ ...pageProperties, visibleDescription: !pageProperties.visibleDescription })}
                  >
                    {pageProperties.visibleDescription ? <Eye size={17} /> : <EyeOff size={17} />}
                  </button>
                </div>
             <textarea
  value={pageProperties.description}
  onChange={(e) => setPageProperties({ ...pageProperties, description: e.target.value })}
  placeholder="Page Description"
  className="w-full h-32 p-2 border rounded-lg mb-4 text-sm"
/>
              </div>
              
      {/* Save Button */}
      <button
        type="button"
        onClick={handleSavePageProperties}
        className="py-2 px-5 text-sm rounded-lg w-24 text-white bg-[#5646A5]"
        
      >
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

      {/* ImageUploadCrop Component for Background */}
      <ImageUploadCrop
        isOpen={isBackgroundUploadOpen}
        onClose={() => setIsBackgroundUploadOpen(false)}
        onImageUpdate={handleBackgroundImageUpdate}
        currentImage={typeof backgroundImage === 'string' ? backgroundImage : backgroundImage}
      />
    </div>
  );
};

export default WorkspaceThemePanel;