import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { updateTheme } from '../../../../redux/apiCalls/ThemeCallApi';
import { usePlan } from '../../../../redux/apiCalls/Useplan.js';
import WorkspaceThemePanelContent from './WorkspaceThemePanelContent';
import UpgradeRequiredModal from '../../../Pricing/Upgraderequiredmodal.jsx';

const WorkspaceThemePanel = ({
  onLayoutChange,
  onThemeChange,
  currentId,
  isInterview,
  workspace,
  interview,
}) => {
  const dispatch = useDispatch();
  const { isFree, planLimit } = usePlan();
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const checkPlanBeforeSave = (callback) => {
    if (isFree) {
      setIsUpgradeModalOpen(true);
      return false;
    }
    callback();
    return true;
  };

  // ============ Save Handlers ============

  const handleSaveTheme = async (themeData) => {
    checkPlanBeforeSave(async () => {
      const {
        backgroundBase64,
        apiThemeValue,
        selectedColor,
        textColor,
        backgroundOpacity,
        buttonText,
        preSelect,
      } = themeData;

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
    });
  };

  const handleSaveHeader = async (headerData) => {
    checkPlanBeforeSave(async () => {
      const { header, logoDeleted, currentId, isInterview } = headerData;

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
    });
  };

  const handleSaveFooter = (footerData) => {
    checkPlanBeforeSave(() => {
      const { socialLinks, removeBrand, currentId, isInterview } = footerData;
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
        footer_tiktok: socialLinks.tiktok,
        show_tiktok: socialLinks.visibleTiktok ? 1 : 0,
        footer_snapchat: socialLinks.snapchat,
        show_snapchat: socialLinks.visibleSnapchat ? 1 : 0,
        footer_whatsapp: socialLinks.whatsapp,
        show_whatsapp: socialLinks.visibleWhatsapp ? 1 : 0,
        footer_phone: socialLinks.phone,
        show_phone: socialLinks.visiblePhone ? 1 : 0,
        footer_email: socialLinks.email,
        show_email: socialLinks.visibleEmail ? 1 : 0,
        remove_brand: removeBrand ? 1 : 0, 
      };

      dispatch(updateTheme(payload));
    });
  };

  const handleSavePageProperties = (pageData) => {
    checkPlanBeforeSave(() => {
      const { pageProperties, currentId, isInterview } = pageData;

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

      const payload = {
        ...(isInterview ? { interview_id: currentId } : { work_space_id: currentId }),
        page_title: pageProperties.title,
        page_description: cleanHTML(pageProperties.description),
        show_page_title: pageProperties.visibleTitle ? 1 : 0,
        show_page_description: pageProperties.visibleDescription ? 1 : 0,
      };

      dispatch(updateTheme(payload));
    });
  };

  const handleSavePageTexts = (textsData) => {
    checkPlanBeforeSave(() => {
      const { pageTexts, currentId, isInterview } = textsData;

      const payload = {
        ...(isInterview ? { interview_id: currentId } : { work_space_id: currentId }),
        work_space_text: pageTexts.work_space_text,
        interview_text: pageTexts.interview_text,
        staff_text: pageTexts.staff_text,
        mode_text: pageTexts.mode_text,
        details_text: pageTexts.details_text,
      };

      dispatch(updateTheme(payload));
    });
  };

  const handleDeleteLogo = (logoData) => {
    checkPlanBeforeSave(async () => {
      const { header, currentId, isInterview, setHeader, setLogoDeleted } = logoData;

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
    });
  };

  return (
    <>
      {/* Upgrade Modal */}
      <UpgradeRequiredModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />

      {/* Content Component */}
      <WorkspaceThemePanelContent
        onLayoutChange={onLayoutChange}
        onThemeChange={onThemeChange}
        currentId={currentId}
        isInterview={isInterview}
        workspace={workspace}
        interview={interview}
        onSaveTheme={handleSaveTheme}
        onSaveHeader={handleSaveHeader}
        onSaveFooter={handleSaveFooter}
        onSavePageProperties={handleSavePageProperties}
        onSavePageTexts={handleSavePageTexts}
        onDeleteLogo={handleDeleteLogo}
      />
    </>
  );
};

export default WorkspaceThemePanel;