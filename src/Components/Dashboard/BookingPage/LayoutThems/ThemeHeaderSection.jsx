import { ChevronDown, ChevronRight, Eye, EyeOff, Upload, X } from 'lucide-react';
import { updateTheme, updateThemeStaff } from '../../../../redux/apiCalls/ThemeCallApi';
import { LAYOUT_TO_THEME } from '../LayoutWorkspaceTheme/LayoutShapes/themeMapping';

const ThemeHeaderSection = ({
  header,
  openSection,
  toggleSection,
  onHeaderChange,
  isImageUploadOpen,
  setIsImageUploadOpen,
  logoDeleted,
  setLogoDeleted,
  getCurrentColorPayload,
  selectedLayout,
  userType,
  dispatch,
}) => {

  const handleHeaderChange = (field, value) => {
    const updatedHeader = { ...header, [field]: value };
    if (field === 'logo' && value === null) setLogoDeleted(true);
    else if (field === 'logo' && value !== null) setLogoDeleted(false);
    onHeaderChange(updatedHeader);
  };

  const handleSaveHeader = async () => {
    const formData = new FormData();
    formData.append('theme', LAYOUT_TO_THEME[selectedLayout]);
    formData.append('colors', getCurrentColorPayload().colors);
    formData.append('nickname', header.title);
    formData.append('show_nickname', header.visibleTitle ? 1 : 0);
    formData.append('show_photo', header.visibleLogo ? 1 : 0);

    if (header.logo) {
      if (typeof header.logo === 'string' && header.logo.startsWith('data:')) {
        const response = await fetch(header.logo);
        const blob = await response.blob();
        formData.append('photo', new File([blob], 'logo.png', { type: 'image/png' }));
      } else if (header.logo instanceof File) {
        formData.append('photo', header.logo);
      }
    } else if (logoDeleted) {
      formData.append('photo', '');
      formData.append('remove_photo', '1');
    }

    if (userType === "staff") {
      await dispatch(updateThemeStaff(formData));
    } else {
      await dispatch(updateTheme(formData));
    }

    if (logoDeleted) setLogoDeleted(false);
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

  return (
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
          {/* Title */}
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

          {/* Logo */}
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
                    <img
                      src={typeof header.logo === 'string' ? header.logo : URL.createObjectURL(header.logo)}
                      alt="Logo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-sm text-gray-600">Logo uploaded</span>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setIsImageUploadOpen(true)} className="text-indigo-600 text-sm hover:underline">
                    Change
                  </button>
                  <button type="button" onClick={handleDeleteLogo} className="text-red-600 text-sm hover:underline">
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
  );
};

export default ThemeHeaderSection;