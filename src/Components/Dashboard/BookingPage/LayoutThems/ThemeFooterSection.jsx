import { ChevronDown, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { updateTheme, updateThemeStaff } from '../../../../redux/apiCalls/ThemeCallApi';
import { LAYOUT_TO_THEME } from '../LayoutWorkspaceTheme/LayoutShapes/themeMapping';

const PAGE_TEXT_FIELDS = [
  { key: 'work_space_text', label: 'Work Space Text', placeholder: 'Enter workspace text...' },
  { key: 'interview_text',  label: 'Interview Text',  placeholder: 'Enter interview text...' },
  { key: 'staff_text',      label: 'Staff Text',      placeholder: 'Enter staff text...' },
  { key: 'mode_text',       label: 'Mode Text',       placeholder: 'Enter mode text...' },
  { key: 'details_text',    label: 'Details Text',    placeholder: 'Enter details text...' },
];

const SOCIAL_FIELDS = [
  { key: 'facebook',  visibleKey: 'visibleFacebook',  label: 'Facebook',  type: 'url',   placeholder: 'https://facebook.com/yourpage' },
  { key: 'instagram', visibleKey: 'visibleInstagram', label: 'Instagram', type: 'url',   placeholder: 'https://instagram.com/yourhandle' },
  { key: 'x',         visibleKey: 'visibleX',         label: 'X',         type: 'url',   placeholder: 'https://x.com/yourhandle' },
  { key: 'linkedin',  visibleKey: 'visibleLinkedin',  label: 'LinkedIn',  type: 'url',   placeholder: 'https://linkedin.com/in/yourprofile' },
  { key: 'tiktok',    visibleKey: 'visibleTiktok',    label: 'TikTok',    type: 'url',   placeholder: 'https://tiktok.com/@yourhandle' },
  { key: 'snapchat',  visibleKey: 'visibleSnapchat',  label: 'Snapchat',  type: 'url',   placeholder: 'https://snapchat.com/add/yourhandle' },
  { key: 'whatsapp',  visibleKey: 'visibleWhatsapp',  label: 'WhatsApp',  type: 'url',   placeholder: 'https://wa.me/201234567890' },
  { key: 'phone',     visibleKey: 'visiblePhone',     label: 'Phone',     type: 'tel',   placeholder: '+1234567890' },
  { key: 'email',     visibleKey: 'visibleEmail',     label: 'Email',     type: 'email', placeholder: 'your@email.com' },
];

const ThemeFooterSection = ({
  socialLinks,
  pageProperties,
  pageTexts,
  openSection,
  toggleSection,
  onFooterChange,
  onPagePropertiesChange,
  onPageTextsChange,
  getCurrentColorPayload,
  selectedLayout,
  userType,
  dispatch,
}) => {

console.log(socialLinks);

  const handleSocialLinksChange    = (field, value) => onFooterChange({ ...socialLinks, [field]: value });
  const handlePagePropertiesChange = (field, value) => onPagePropertiesChange({ ...pageProperties, [field]: value });
  const handlePageTextsChange      = (field, value) => onPageTextsChange({ ...pageTexts, [field]: value });

  const handleSaveFooter = () => {
     const currentRemoveBrand = socialLinks.removeBrand;

    const payload = {
      ...getCurrentColorPayload(),
      theme: LAYOUT_TO_THEME[selectedLayout],
      footer_facebook: socialLinks.facebook,   show_facebook:  socialLinks.visibleFacebook  ? 1 : 0,
      footer_instagram: socialLinks.instagram, show_instagram: socialLinks.visibleInstagram ? 1 : 0,
      footer_x: socialLinks.x,                show_x:         socialLinks.visibleX         ? 1 : 0,
      footer_linkedin: socialLinks.linkedin,   show_linkedin:  socialLinks.visibleLinkedin  ? 1 : 0,
      footer_tiktok: socialLinks.tiktok,       show_tiktok:    socialLinks.visibleTiktok    ? 1 : 0,
      footer_snapchat: socialLinks.snapchat,   show_snapchat:  socialLinks.visibleSnapchat  ? 1 : 0,
      footer_whatsapp: socialLinks.whatsapp,   show_whatsapp:  socialLinks.visibleWhatsapp  ? 1 : 0,
      footer_phone: socialLinks.phone,         show_phone:     socialLinks.visiblePhone     ? 1 : 0,
      footer_email: socialLinks.email,         show_email:     socialLinks.visibleEmail     ? 1 : 0,
      remove_brand: socialLinks.removeBrand ? 1 : 0,
    };
    console.log('full payload:', payload);
    if (userType === "staff") dispatch(updateThemeStaff(payload));
    else dispatch(updateTheme(payload));
  };

  const handleSavePageProperties = () => {
    const payload = {
      ...getCurrentColorPayload(),
      theme: LAYOUT_TO_THEME[selectedLayout],
      page_title: pageProperties.title,
      page_description: pageProperties.description,
      show_page_title: pageProperties.visibleTitle ? 1 : 0,
      show_page_description: pageProperties.visibleDescription ? 1 : 0,
    };
    if (userType === "staff") dispatch(updateThemeStaff(payload));
    else dispatch(updateTheme(payload));
  };

  const handleSavePageTexts = () => {
    const payload = {
      ...getCurrentColorPayload(),
      theme: LAYOUT_TO_THEME[selectedLayout],
      work_space_text: pageTexts.work_space_text,
      interview_text:  pageTexts.interview_text,
      staff_text:      pageTexts.staff_text,
      mode_text:       pageTexts.mode_text,
      details_text:    pageTexts.details_text,
    };
    if (userType === "staff") dispatch(updateThemeStaff(payload));
    else dispatch(updateTheme(payload));
  };

  return (
    <>
      {/* ===== Footer Section ===== */}
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
            {SOCIAL_FIELDS.map(({ key, visibleKey, label, type, placeholder }) => (
              <div key={key} className="flex flex-col gap-2">
                <div className='flex justify-between w-full items-center'>
                  <p className="text-sm text-gray-700">{label}</p>
                  <button
                    className='cursor-pointer text-gray-500 hover:text-gray-700'
                    onClick={() => handleSocialLinksChange(visibleKey, !socialLinks[visibleKey])}
                  >
                    {socialLinks[visibleKey] ? <Eye size={17} /> : <EyeOff size={17} />}
                  </button>
                </div>
                <input
                  type={type}
                  placeholder={placeholder}
                  value={socialLinks[key]}
                  onChange={(e) => handleSocialLinksChange(key, e.target.value)}
                  className="w-full p-2 border rounded-lg text-sm"
                />
              </div>
            ))}
            <div className="flex justify-between items-center py-2 border-t pt-3">
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-700">Powered by Appoint Roll</p>
              <p className="text-xs text-gray-400">{socialLinks.removeBrand ? 'Hidden' : 'Visible'}</p>
            </div>
            <button
              type="button"            
               onClick={(e) => {
                  e.stopPropagation();
                  handleSocialLinksChange('removeBrand', !socialLinks.removeBrand);
                }}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                socialLinks.removeBrand ? 'bg-gray-300' : 'bg-[#5646A5]'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
                socialLinks.removeBrand ? 'translate-x-1' : 'translate-x-6'
              }`} />
            </button>
          </div>
            <button onClick={handleSaveFooter} className="py-2 px-5 text-sm rounded-lg w-24 text-white bg-[#5646A5]">
              Save
            </button>
          </div>
        )}
      </div>

      {/* ===== Page Properties Section ===== */}
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

      {/* ===== Page Texts Section ===== */}
      <div>
        <div
          className="flex justify-between items-center p-4 cursor-pointer"
          onClick={() => toggleSection('pageTexts')}
        >
          <span className="text-sm font-medium">Page Texts</span>
          {openSection === 'pageTexts' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </div>

        {openSection === 'pageTexts' && (
          <div className="p-4 bg-gray-50 space-y-4">
            {PAGE_TEXT_FIELDS
              .filter(({ key }) => !(key === 'work_space_text' && userType === 'staff'))
              .map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-medium mb-1">{label}</label>
                  <input
                    type="text"
                    value={pageTexts[key]}
                    onChange={(e) => handlePageTextsChange(key, e.target.value)}
                    placeholder={placeholder}
                    className="w-full p-2 border rounded-lg text-sm"
                  />
                </div>
              ))}
            <button onClick={handleSavePageTexts} className="py-2 px-5 text-sm rounded-lg w-24 text-white bg-[#5646A5]">
              Save
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ThemeFooterSection;