import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Check, Plus, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { updateTheme, updateThemeStaff } from '../../../../redux/apiCalls/ThemeCallApi';
import { LAYOUT_TO_THEME } from '../LayoutWorkspaceTheme/LayoutShapes/themeMapping';
import ImageUploadCrop from '../../InterviewsPages/InterViewPage/ImageUploadCrop';
import ThemeHeaderSection from './ThemeHeaderSection';
import ThemeFooterSection from './ThemeFooterSection';

const ThemePanel = ({
  header,
  pageProperties,
  socialLinks,
  pageTexts,           
  onLayoutChange,
  onColorChange,
  onHeaderChange,
  onPagePropertiesChange,
  onFooterChange,
  onPageTextsChange, 
   

}) => {
  const dispatch = useDispatch();
  const theme = useSelector(state => state.themes?.theme?.theme);
  const userType = localStorage.getItem("userType");

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

  const [openSection, setOpenSection] = useState('');
  const [selectedLayout, setSelectedLayout] = useState('sleek');
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const [customColor, setCustomColor] = useState({ color1: '#FFFFFF', color2: '#000000', textColor: '#FFFFFF', type: 'custom' });
  const [logoDeleted, setLogoDeleted] = useState(false);
  const [isImageUploadOpen, setIsImageUploadOpen] = useState(false);
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);

  const stripHtml = (html) => html.replace(/<[^>]*>/g, '');

  useEffect(() => {
    if (theme) {
      const toBool = (val) => val === 1 || val === "1" || val === true;

      const reverseMap = Object.fromEntries(
        Object.entries(LAYOUT_TO_THEME).map(([ui, api]) => [api, ui])
      );
      const uiLayout = reverseMap[theme.theme];
      if (uiLayout) {
        setSelectedLayout(uiLayout);
        onLayoutChange(uiLayout);
      }

      let parsedColors = {};
      try { parsedColors = JSON.parse(theme.colors || '{}'); } catch {}

      if (parsedColors.primary) {
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

      if (theme.page_title || theme.page_description) {
        onPagePropertiesChange({
          ...pageProperties,
          title: theme.page_title || pageProperties.title,
          description: stripHtml(theme.page_description || '') || pageProperties.description,
          visibleTitle: toBool(theme.show_page_title),
          visibleDescription: toBool(theme.show_page_description)
        });
      }

      // ✅ تحميل page texts من الـ API
      onPageTextsChange({
        work_space_text: theme.work_space_text || '',
        interview_text: theme.interview_text || '',
        staff_text: theme.staff_text || '',
        mode_text: theme.mode_text || '',
        details_text: theme.details_text || '',
      });

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
        whatsapp: theme.footer_whatsapp || "",
        visibleWhatsapp: toBool(theme.show_whatsapp),
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

  const getCurrentColorPayload = () => ({
    theme: LAYOUT_TO_THEME[selectedLayout],
    colors: JSON.stringify({
      primary: selectedColor
        ? `${selectedColor.color1}-${selectedColor.color2}`
        : `${colorOptions[0].color1}-${colorOptions[0].color2}`,
      text_color: selectedColor?.textColor || colorOptions[0].textColor,
    }),
  });

  const handleLayoutChange = (layout) => {
    setSelectedLayout(layout);
    onLayoutChange(layout);
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
    if (color.type === 'custom') setCustomColor(color);
    onColorChange(color);
  };

  const handleSaveTheme = () => {
    const payload = {
      ...getCurrentColorPayload(),
      theme: LAYOUT_TO_THEME[selectedLayout],
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

        {/* ===== Theme Section ===== */}
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
                      style={{ background: `linear-gradient(135deg, ${color.color1} 50%, ${color.color2} 50%)` }}
                    />
                  ))}
                  <button
                    onClick={() => setIsColorModalOpen(true)}
                    className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all relative ${
                      selectedColor?.type === 'custom'
                        ? 'ring-2 ring-offset-2 ring-indigo-600 border-indigo-600'
                        : 'border-gray-300'
                    }`}
                    style={{ background: `linear-gradient(135deg, ${customColor.color1} 50%, ${customColor.color2} 50%)` }}
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
                      <div className="flex justify-between items-center p-5 border-b">
                        <h3 className="text-lg font-semibold text-gray-800">Custom Colors</h3>
                        <button onClick={() => setIsColorModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                          <X size={24} />
                        </button>
                      </div>
                      <div className="p-6 space-y-6">
                        {[
                          { label: 'Primary Color', sublabel: 'Background Color', key: 'color2' },
                          { label: 'Selected Items', sublabel: 'Background Items', key: 'color1' },
                          { label: 'Text Color', sublabel: 'Text & Icons', key: 'textColor' },
                        ].map(({ label, sublabel, key }) => (
                          <div key={key} className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">{label}</label>
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <input
                                  type="color"
                                  value={customColor[key]}
                                  onChange={(e) => {
                                    const newColor = { ...customColor, [key]: e.target.value };
                                    setCustomColor(newColor);
                                    handleColorChange(newColor);
                                  }}
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div
                                  className="w-8 h-8 rounded-lg border-2 border-gray-200 shadow-sm cursor-pointer"
                                  style={{ backgroundColor: customColor[key] }}
                                />
                              </div>
                              <p className="text-sm text-gray-600">{sublabel}</p>
                            </div>
                          </div>
                        ))}
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

        {/* ===== Header Section — مكون منفصل ===== */}
        <ThemeHeaderSection
          header={header}
          openSection={openSection}
          toggleSection={toggleSection}
          onHeaderChange={onHeaderChange}
          isImageUploadOpen={isImageUploadOpen}
          setIsImageUploadOpen={setIsImageUploadOpen}
          logoDeleted={logoDeleted}
          setLogoDeleted={setLogoDeleted}
          getCurrentColorPayload={getCurrentColorPayload}
          selectedLayout={selectedLayout}
          userType={userType}
          dispatch={dispatch}
        />

        {/* ===== Footer + Page Properties + Page Texts — مكون منفصل ===== */}
        <ThemeFooterSection
          socialLinks={socialLinks}
          pageProperties={pageProperties}
          pageTexts={pageTexts}
          openSection={openSection}
          toggleSection={toggleSection}
          onFooterChange={onFooterChange}
          onPagePropertiesChange={onPagePropertiesChange}
          onPageTextsChange={onPageTextsChange}
          getCurrentColorPayload={getCurrentColorPayload}
          selectedLayout={selectedLayout}
          userType={userType}
          dispatch={dispatch}
           
        />

      </div>

      <ImageUploadCrop
        isOpen={isImageUploadOpen}
        onClose={() => setIsImageUploadOpen(false)}
        onImageUpdate={(imageFile) => {
          onHeaderChange({ ...header, logo: imageFile });
          setLogoDeleted(false);
          setIsImageUploadOpen(false);
        }}
        currentImage={typeof header.logo === 'string' ? header.logo : header.logo}
      />
    </div>
  );
};

export default ThemePanel;