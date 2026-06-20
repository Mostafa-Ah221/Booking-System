import { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, Check, Upload, EyeOff, Eye, X, Plus } from 'lucide-react';
import ImageUploadCrop from '../../InterviewsPages/InterViewPage/ImageUploadCrop';
import { useDispatch, useSelector } from 'react-redux';
import { updateTheme } from '../../../../redux/apiCalls/ThemeCallApi';
import { LAYOUT_TO_THEME } from './LayoutShapes/themeMapping';

const WorkspaceThemePanelContent = ({
  onLayoutChange,
  onThemeChange,
  currentId,
  isInterview,
  workspace,
  interview,
  onSaveTheme,
  onSaveHeader,
  onSaveFooter,
  onSavePageProperties,
  onSavePageTexts,
  onDeleteLogo,
}) => {
  const dispatch = useDispatch();
  const theme = useSelector(state => state.themes?.theme?.theme);

  const [openSection, setOpenSection] = useState('');
  const [selectedLayout, setSelectedLayout] = useState('');
  const [selectedColor, setSelectedColor] = useState(null);
  const [customColor, setCustomColor] = useState({ color1: '#FFFFFF', color2: '#000000', textColor: '#FFFFFF', type: 'custom' });
  const [isCustom, setIsCustom] = useState(false);
  const [textColor, setTextColor] = useState('');
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [backgroundOpacity, setBackgroundOpacity] = useState(100);
  const [removeBrand, setRemoveBrand] = useState(false); // ✅ NEW

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
    tiktok: '', visibleTiktok: true,
    snapchat: '', visibleSnapchat: true,
    whatsapp: '', visibleWhatsapp: true,
    phone: '', visiblePhone: true,
    email: '', visibleEmail: true,
  });

  const [pageTexts, setPageTexts] = useState({
    work_space_text: '',
    interview_text: '',
    staff_text: '',
    mode_text: '',
    details_text: '',
  });

  const [isImageUploadOpen, setIsImageUploadOpen] = useState(false);
  const [isBackgroundUploadOpen, setIsBackgroundUploadOpen] = useState(false);
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);

  const colorOptions = [
    { color2: '#A6517D', color1: '#F5F5F5', textColor: '#000000', type: 'split' },
    { color2: '#F6CB45', color1: '#1C3E74', textColor: '#FFFFFF', type: 'split' },
    { color2: '#F9E062', color1: '#33373A', textColor: '#FFFFFF', type: 'split' },
    { color2: '#F6CB45', color1: '#3B817B', textColor: '#FFFFFF', type: 'split' },
    { color2: '#FFC900', color1: '#2651C7', textColor: '#FFFFFF', type: 'split' },
    { color2: '#EB5380', color1: '#784CBC', textColor: '#FFFFFF', type: 'split' },
    { color2: '#FF5D6D', color1: '#755B5B', textColor: '#FFFFFF', type: 'split' },
    { color2: '#E95646', color1: '#F5F5F5', textColor: '#000000', type: 'split' },
    { color2: '#27D8A1', color1: '#F5F5F5', textColor: '#000000', type: 'split' },
    { color2: '#FF427F', color1: '#F5F5F5', textColor: '#000000', type: 'split' },
  ];

  useEffect(() => {
    if (theme) {
      const toBool = (val) => val === 1 || val === "1" || val === true;
    console.log('theme.remove_brand from API:', theme.remove_brand);
      setRemoveBrand(toBool(theme.remove_brand));

      const reverseMap = Object.fromEntries(
        Object.entries(LAYOUT_TO_THEME).map(([ui, api]) => [api, ui])
      );
      const uiLayout = reverseMap[theme.theme];
      setSelectedLayout(uiLayout || '');

      let parsedColors = {};
      try { parsedColors = JSON.parse(theme.colors || '{}'); } catch {}

      if (parsedColors.primary) {
        const matchingColor = colorOptions.find(
          opt => `${opt.color1}-${opt.color2}` === parsedColors.primary
        );
        if (matchingColor) {
          setSelectedColor(`${matchingColor.color1}-${matchingColor.color2}`);
          setTextColor(matchingColor.textColor);
          setIsCustom(false);
        } else {
          const [c1, c2] = parsedColors.primary.split('-');
          const tc = parsedColors.text_color || '#000000';
          const cust = { color1: c1 || '#FFFFFF', color2: c2 || '#000000', textColor: tc, type: 'custom' };
          setCustomColor(cust);
          setSelectedColor(`${c1}-${c2}`);
          setTextColor(tc);
          setIsCustom(true);
        }
      }

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
        tiktok: theme.footer_tiktok || '',
        visibleTiktok: toBool(theme.show_tiktok),
        snapchat: theme.footer_snapchat || '',
        visibleSnapchat: toBool(theme.show_snapchat),
        whatsapp: theme.footer_whatsapp || '',
        visibleWhatsapp: toBool(theme.show_whatsapp),
        phone: theme.footer_phone || '',
        visiblePhone: toBool(theme.show_phone),
        email: theme.footer_email || '',
        visibleEmail: toBool(theme.show_email),
      });

      setPageTexts({
        work_space_text: theme.work_space_text || '',
        interview_text: theme.interview_text || '',
        staff_text: theme.staff_text || '',
        mode_text: theme.mode_text || '',
        details_text: theme.details_text || '',
      });
    } else {
      setSelectedLayout('modernWeb');
      const firstColor = colorOptions[0];
      setSelectedColor(`${firstColor.color1}-${firstColor.color2}`);
      setTextColor(firstColor.textColor);
      setIsCustom(false);
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
      pageTexts,
      removeBrand, // ✅ تمرير removeBrand للـ parent
    });
  }, [selectedLayout, selectedColor, backgroundImage, backgroundOpacity, header, pageProperties, buttonText, preSelect, socialLinks, textColor, removeBrand, onThemeChange]);

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

  const handleLayoutChange = (layout) => {
    setSelectedLayout(layout);
    onLayoutChange(layout);
  };

  const handleColorChange = (colorKey, txtColor) => {
    setSelectedColor(colorKey);
    setTextColor(txtColor);
    setIsCustom(false);
  };

  const handleOpenCustomModal = () => {
    const [c1, c2] = selectedColor ? selectedColor.split('-') : ['#FFFFFF', '#000000'];
    setCustomColor({ color1: c1 || '#FFFFFF', color2: c2 || '#000000', textColor: textColor || '#FFFFFF', type: 'custom' });
    setIsColorModalOpen(true);
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

  const handleSaveThemeClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const backgroundBase64 = await toBase64(backgroundImage);
    const apiThemeValue = LAYOUT_TO_THEME[selectedLayout];

    const themeData = {
      backgroundBase64,
      apiThemeValue,
      selectedColor,
      textColor,
      backgroundOpacity,
      buttonText,
      preSelect,
      currentId,
      isInterview,
    };

    onSaveTheme(themeData);
  };

  const handleSaveHeaderClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    onSaveHeader({ header, logoDeleted, currentId, isInterview, setLogoDeleted });
  };

  const handleDeleteLogoClick = async () => {
    onDeleteLogo({ header, currentId, isInterview, setHeader, setLogoDeleted });
  };

  const handleSaveFooterClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // ✅ تمرير removeBrand مع باقي البيانات
    onSaveFooter({ socialLinks, removeBrand, currentId, isInterview });
  };

  const handleSavePagePropertiesClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onSavePageProperties({ pageProperties, currentId, isInterview });
  };

  const handleSavePageTextsClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onSavePageTexts({ pageTexts, currentId, isInterview });
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

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow pb-3">
      <div className="divide-y">

        {/* ======================== Theme Section ======================== */}
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
                  {['newLayout', 'modernWeb', 'classic'].map((layout) => (
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
                    <p className="text-sm font-medium mb-2">Color Options</p>
                    <div className="relative grid grid-cols-5 gap-2">
                      {colorOptions.map((color, index) => (
                        <button
                          key={index}
                          onClick={() => handleColorChange(`${color.color1}-${color.color2}`, color.textColor)}
                          className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all ${
                            selectedColor === `${color.color1}-${color.color2}` && !isCustom
                              ? 'ring-2 ring-offset-2 ring-indigo-600 border-indigo-600'
                              : 'border-gray-300'
                          }`}
                          style={{ background: `linear-gradient(135deg, ${color.color2} 50%, ${color.color1} 50%)` }}
                          title={`${color.color1} / ${color.color2}`}
                        />
                      ))}
                      <button
                        key="custom"
                        onClick={handleOpenCustomModal}
                        className={`w-10 h-10 mb-7 rounded-full overflow-hidden border-2 transition-all relative ${
                          isCustom
                            ? 'ring-2 ring-offset-2 ring-indigo-600 border-indigo-600'
                            : 'border-gray-300'
                        }`}
                        style={{ background: `linear-gradient(135deg, ${customColor.color1} 50%, ${customColor.color2} 50%)` }}
                        title="Custom Color"
                      >
                        <Plus size={20} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white drop-shadow-md" />
                      </button>

                      {/* Color Modal */}
                      {isColorModalOpen && (
                        <div
                          className="absolute inset-0 top-56 flex items-center justify-center z-50"
                          onClick={() => setIsColorModalOpen(false)}
                        >
                          <div
                            className="bg-white rounded-2xl shadow-2xl w-96 max-w-[90%] overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex justify-between items-center p-5 border-b">
                              <h3 className="text-lg font-semibold text-gray-800">Custom Colors</h3>
                              <button onClick={() => setIsColorModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={24} />
                              </button>
                            </div>

                            <div className="p-6 space-y-6">
                              {/* Primary Color */}
                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Primary Color</label>
                                <div className="flex items-center gap-3">
                                  <div className="relative">
                                    <input
                                      type="color"
                                      value={customColor.color2}
                                      onChange={(e) => {
                                        const newC2 = e.target.value;
                                        setCustomColor({ ...customColor, color2: newC2 });
                                        setSelectedColor(`${newC2}-${customColor.color1}`);
                                        setIsCustom(true);
                                      }}
                                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <div
                                      className="w-8 h-8 rounded-lg border-2 border-gray-200 shadow-sm hover:border-gray-300 transition-colors cursor-pointer"
                                      style={{ backgroundColor: customColor.color2 }}
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm text-gray-600">Background Color</p>
                                  </div>
                                </div>
                              </div>

                              {/* Selected Items */}
                              <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Selected Items</label>
                                <div className="flex items-center gap-3">
                                  <div className="relative">
                                    <input
                                      type="color"
                                      value={customColor.color1}
                                      onChange={(e) => {
                                        const newC1 = e.target.value;
                                        setCustomColor({ ...customColor, color1: newC1 });
                                        setSelectedColor(`${customColor.color2}-${newC1}`);
                                        setIsCustom(true);
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
                                        const newTc = e.target.value;
                                        setCustomColor({ ...customColor, textColor: newTc });
                                        setTextColor(newTc);
                                        setIsCustom(true);
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
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {selectedLayout === 'modernWeb' && (
                  <div className="mb-4">
                    <p className="mb-2">Button Text</p>
                    <input
                      type="text"
                      value={buttonText}
                      onChange={(e) => setButtonText(e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                )}

                <button type="button" onClick={handleSaveThemeClick} className="py-2 px-5 text-sm rounded-lg w-24 text-white bg-[#5646A5]">
                  Save
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ======================== Header Section ======================== */}
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
                        onClick={handleDeleteLogoClick}
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

              <button
                type="button"
                onClick={handleSaveHeaderClick}
                className="py-2 px-5 text-sm rounded-lg w-24 text-white bg-[#5646A5]"
              >
                Save
              </button>
            </div>
          )}
        </div>

        {/* ======================== Footer Section ======================== */}
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
                  <button type="button" className='cursor-pointer text-gray-500 hover:text-gray-700' onClick={() => setSocialLinks({ ...socialLinks, visibleFacebook: !socialLinks.visibleFacebook })}>
                    {socialLinks.visibleFacebook ? <Eye size={17} /> : <EyeOff size={17} />}
                  </button>
                </div>
                <input type="url" placeholder="https://facebook.com/yourpage" value={socialLinks.facebook} onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })} className="flex-1 p-2 border rounded-lg text-sm w-full" />
              </div>

              {/* Instagram */}
              <div className="flex flex-col gap-2">
                <div className='flex justify-between w-full items-center'>
                  <p className="font-sans text-sm text-gray-700">Instagram</p>
                  <button type="button" className='cursor-pointer text-gray-500 hover:text-gray-700' onClick={() => setSocialLinks({ ...socialLinks, visibleInstagram: !socialLinks.visibleInstagram })}>
                    {socialLinks.visibleInstagram ? <Eye size={17} /> : <EyeOff size={17} />}
                  </button>
                </div>
                <input type="url" placeholder="https://instagram.com/yourhandle" value={socialLinks.instagram} onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })} className="flex-1 p-2 border rounded-lg text-sm w-full" />
              </div>

              {/* X (Twitter) */}
              <div className="flex flex-col gap-2">
                <div className='flex justify-between w-full items-center'>
                  <p className="font-sans text-sm text-gray-700">X</p>
                  <button type="button" className='cursor-pointer text-gray-500 hover:text-gray-700' onClick={() => setSocialLinks({ ...socialLinks, visibleX: !socialLinks.visibleX })}>
                    {socialLinks.visibleX ? <Eye size={17} /> : <EyeOff size={17} />}
                  </button>
                </div>
                <input type="url" placeholder="https://x.com/yourhandle" value={socialLinks.x} onChange={(e) => setSocialLinks({ ...socialLinks, x: e.target.value })} className="flex-1 p-2 border rounded-lg text-sm w-full" />
              </div>

              {/* LinkedIn */}
              <div className="flex flex-col gap-2">
                <div className='flex justify-between w-full items-center'>
                  <p className="font-sans text-sm text-gray-700">LinkedIn</p>
                  <button type="button" className='cursor-pointer text-gray-500 hover:text-gray-700' onClick={() => setSocialLinks({ ...socialLinks, visibleLinkedin: !socialLinks.visibleLinkedin })}>
                    {socialLinks.visibleLinkedin ? <Eye size={17} /> : <EyeOff size={17} />}
                  </button>
                </div>
                <input type="url" placeholder="https://linkedin.com/in/yourprofile" value={socialLinks.linkedin} onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })} className="flex-1 p-2 border rounded-lg text-sm w-full" />
              </div>

              {/* TikTok */}
              <div className="flex flex-col gap-2">
                <div className='flex justify-between w-full items-center'>
                  <p className="font-sans text-sm text-gray-700">TikTok</p>
                  <button type="button" className='cursor-pointer text-gray-500 hover:text-gray-700' onClick={() => setSocialLinks({ ...socialLinks, visibleTiktok: !socialLinks.visibleTiktok })}>
                    {socialLinks.visibleTiktok ? <Eye size={17} /> : <EyeOff size={17} />}
                  </button>
                </div>
                <input type="url" placeholder="https://tiktok.com/@yourhandle" value={socialLinks.tiktok} onChange={(e) => setSocialLinks({ ...socialLinks, tiktok: e.target.value })} className="flex-1 p-2 border rounded-lg text-sm w-full" />
              </div>

              {/* Snapchat */}
              <div className="flex flex-col gap-2">
                <div className='flex justify-between w-full items-center'>
                  <p className="font-sans text-sm text-gray-700">Snapchat</p>
                  <button type="button" className='cursor-pointer text-gray-500 hover:text-gray-700' onClick={() => setSocialLinks({ ...socialLinks, visibleSnapchat: !socialLinks.visibleSnapchat })}>
                    {socialLinks.visibleSnapchat ? <Eye size={17} /> : <EyeOff size={17} />}
                  </button>
                </div>
                <input type="url" placeholder="https://snapchat.com/add/yourhandle" value={socialLinks.snapchat} onChange={(e) => setSocialLinks({ ...socialLinks, snapchat: e.target.value })} className="flex-1 p-2 border rounded-lg text-sm w-full" />
              </div>

              {/* WhatsApp */}
              <div className="flex flex-col gap-2">
                <div className='flex justify-between w-full items-center'>
                  <p className="font-sans text-sm text-gray-700">WhatsApp</p>
                  <button type="button" className='cursor-pointer text-gray-500 hover:text-gray-700' onClick={() => setSocialLinks({ ...socialLinks, visibleWhatsapp: !socialLinks.visibleWhatsapp })}>
                    {socialLinks.visibleWhatsapp ? <Eye size={17} /> : <EyeOff size={17} />}
                  </button>
                </div>
                <input type="tel" placeholder="https://wa.me/201234567890" value={socialLinks.whatsapp} onChange={(e) => setSocialLinks({ ...socialLinks, whatsapp: e.target.value })} className="flex-1 p-2 border rounded-lg text-sm w-full" />
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-2">
                <div className='flex justify-between w-full items-center'>
                  <p className="font-sans text-sm text-gray-700">Phone</p>
                  <button type="button" className='cursor-pointer text-gray-500 hover:text-gray-700' onClick={() => setSocialLinks({ ...socialLinks, visiblePhone: !socialLinks.visiblePhone })}>
                    {socialLinks.visiblePhone ? <Eye size={17} /> : <EyeOff size={17} />}
                  </button>
                </div>
                <input type="tel" placeholder="+1234567890" value={socialLinks.phone} onChange={(e) => setSocialLinks({ ...socialLinks, phone: e.target.value })} className="flex-1 p-2 border rounded-lg text-sm w-full" />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">
                <div className='flex justify-between w-full items-center'>
                  <p className="font-sans text-sm text-gray-700">Email</p>
                  <button type="button" className='cursor-pointer text-gray-500 hover:text-gray-700' onClick={() => setSocialLinks({ ...socialLinks, visibleEmail: !socialLinks.visibleEmail })}>
                    {socialLinks.visibleEmail ? <Eye size={17} /> : <EyeOff size={17} />}
                  </button>
                </div>
                <input type="email" placeholder="your@email.com" value={socialLinks.email} onChange={(e) => setSocialLinks({ ...socialLinks, email: e.target.value })} className="flex-1 p-2 border rounded-lg text-sm w-full" />
              </div>

              <div className="flex justify-between items-center py-2 border-t pt-3">
  <div className="flex flex-col">
    <p className="font-sans text-sm font-medium text-gray-700">Powered by Appoint Roll</p>
    <p className="text-xs text-gray-400">{removeBrand ? 'Hidden' : 'Visible'}</p>
  </div>
  <button
    type="button"
    onClick={() => setRemoveBrand(!removeBrand)}
    className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors duration-200 focus:outline-none ${
      removeBrand ? 'bg-gray-300' : 'bg-[#5646A5]'
    }`}
  >
    <span
      className={`inline-block h-3 w-3 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
        removeBrand ? 'translate-x-1' : 'translate-x-4'
      }`}
    />
  </button>
</div>

              {/* Save Button */}
              <button
                type="button"
                onClick={handleSaveFooterClick}
                className="py-2 px-5 text-sm rounded-lg w-24 text-white mt-4 bg-[#5646A5]"
              >
                Save
              </button>
            </div>
          )}
        </div>

        {/* ======================== Page Properties ======================== */}
        <div>
          <div
            className="flex justify-between items-center p-4 cursor-pointer"
            onClick={() => toggleSection('pageProperties')}
          >
            <span className="text-sm">Page Properties</span>
            {openSection === 'pageProperties' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
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

              <button
                type="button"
                onClick={handleSavePagePropertiesClick}
                className="py-2 px-5 text-sm rounded-lg w-24 text-white bg-[#5646A5]"
              >
                Save
              </button>
            </div>
          )}
        </div>

        {/* ======================== Page Texts Section ======================== */}
        <div>
          <div
            className="flex justify-between items-center p-4 cursor-pointer"
            onClick={() => toggleSection('pageTexts')}
          >
            <span className="text-sm">Page Texts</span>
            {openSection === 'pageTexts' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </div>

          {openSection === 'pageTexts' && (
            <div className="p-4 bg-gray-50 space-y-4">
              {!isInterview && (
                <div>
                  <label className="block text-sm font-medium mb-1">Interview Text</label>
                  <input
                    type="text"
                    value={pageTexts.interview_text}
                    onChange={(e) => setPageTexts({ ...pageTexts, interview_text: e.target.value })}
                    placeholder="Enter interview text..."
                    className="w-full p-2 border rounded-lg text-sm"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">Staff Text</label>
                <input
                  type="text"
                  value={pageTexts.staff_text}
                  onChange={(e) => setPageTexts({ ...pageTexts, staff_text: e.target.value })}
                  placeholder="Enter staff text..."
                  className="w-full p-2 border rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Mode Text</label>
                <input
                  type="text"
                  value={pageTexts.mode_text}
                  onChange={(e) => setPageTexts({ ...pageTexts, mode_text: e.target.value })}
                  placeholder="Enter mode text..."
                  className="w-full p-2 border rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Details Text</label>
                <input
                  type="text"
                  value={pageTexts.details_text}
                  onChange={(e) => setPageTexts({ ...pageTexts, details_text: e.target.value })}
                  placeholder="Enter details text..."
                  className="w-full p-2 border rounded-lg text-sm"
                />
              </div>

              <button
                type="button"
                onClick={handleSavePageTextsClick}
                className="py-2 px-5 text-sm rounded-lg w-24 text-white bg-[#5646A5]"
              >
                Save
              </button>
            </div>
          )}
        </div>

      </div>

      {/* ImageUploadCrop for Logo */}
      <ImageUploadCrop
        isOpen={isImageUploadOpen}
        onClose={() => setIsImageUploadOpen(false)}
        onImageUpdate={handleImageUpdate}
        currentImage={typeof header.logo === 'string' ? header.logo : header.logo}
      />

      {/* ImageUploadCrop for Background */}
      <ImageUploadCrop
        isOpen={isBackgroundUploadOpen}
        onClose={() => setIsBackgroundUploadOpen(false)}
        onImageUpdate={handleBackgroundImageUpdate}
        currentImage={typeof backgroundImage === 'string' ? backgroundImage : backgroundImage}
      />
    </div>
  );
};

export default WorkspaceThemePanelContent;