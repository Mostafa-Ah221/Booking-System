import { useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import UnifiedIntegrationModal from './IntegrationModal';
import CalendarCategory from './categoriesIntegrations/CalendarCategory';
import VideoConferencingCategory from './categoriesIntegrations/VideoConferencingCategory';
import CrmSalesCategory from './categoriesIntegrations/CrmSalesCategory';
import PaymentsCategory from './categoriesIntegrations/PaymentsCategory';
import SmsCategory from './categoriesIntegrations/SmsCategory';
import WhatsAppCategory from './categoriesIntegrations/WhatsAppCategory';
import { createOrUpdateSmsSettings, getSmsSettingsByIntegrationId, deleteSmsSettings } from '../../../redux/apiCalls/smsIntegrationCallApi';
import { createOrUpdateWhatsAppSettings, getWhatsAppSettingsByIntegrationId, deleteWhatsAppSettings } from '../../../redux/apiCalls/whatsAppCallApi';
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import MailCategory from './categoriesIntegrations/MailCategory';

const IntegrationsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState(null);
  const [currentIntegrationId, setCurrentIntegrationId] = useState(null);
  const [refreshSmsCategory, setRefreshSmsCategory] = useState(0); 
  const [refreshWhatsAppCategory, setRefreshWhatsAppCategory] = useState(0);
  // إضافة state لتتبع القسم النشط
  const [activeSection, setActiveSection] = useState('calendar'); // القيمة الافتراضية
  const dispatch = useDispatch();
  const location = useLocation();

  useLayoutEffect(() => {
  const sectionId = location.hash.replace("#", "") || location.state?.scrollTo;
  
  if (sectionId) {
    setActiveSection(sectionId);
    
    // جرب scroll مباشرة
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      setTimeout(() => {
        const elem = document.getElementById(sectionId);
        if (elem) {
          elem.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 50);
    }
  }
}, [location.hash, location.state?.scrollTo]);

  // تعريف دقيق للخدمات مع التمييز الواضح
  const SERVICE_MAPPING = {
    // WhatsApp Services - أسماء كاملة ومميزة أولاً
    'WhatsApp Business API': { type: 'whatsapp', displayName: 'WhatsApp Business API' },
    'Twilio WhatsApp': { type: 'whatsapp', displayName: 'Twilio WhatsApp' },
    'WhatsApp Business': { type: 'whatsapp', displayName: 'WhatsApp_Business' },
    '360Dialog': { type: 'whatsapp', displayName: '360Dialog' },
    'ChatAPI': { type: 'whatsapp', displayName: 'ChatAPI' },
    'GreenApi': { type: 'whatsapp', displayName: 'Green API' },
    'Green API': { type: 'whatsapp', displayName: 'Green API' },
    
    'Twilio': { type: 'sms', displayName: 'Twilio SMS' },
    'Nexmo': { type: 'sms', displayName: 'Nexmo/Vonage' },
    'MessageBird': { type: 'sms', displayName: 'MessageBird' },
    'MySmsLogin': { type: 'sms', displayName: 'MySmsLogin' }
  };

  const getServiceType = (serviceName) => {
    if (SERVICE_MAPPING[serviceName]) {
      return SERVICE_MAPPING[serviceName].type;
    }
    
    const sortedKeys = Object.keys(SERVICE_MAPPING).sort((a, b) => b.length - a.length);
    
    for (const key of sortedKeys) {
      if (serviceName.toLowerCase().includes(key.toLowerCase()) || 
          key.toLowerCase().includes(serviceName.toLowerCase())) {
        return SERVICE_MAPPING[key].type;
      }
    }
    
    // فحص نهائي بالكلمات المفتاحية
    const lowerServiceName = serviceName.toLowerCase();
    
    // WhatsApp services - فحص مفصل
    if (lowerServiceName.includes('whatsapp')) {
      return 'whatsapp';
    }
    
    // فحص محدد للخدمات
    if (lowerServiceName === '360dialog' ||
        lowerServiceName === 'chatapi' ||
        (lowerServiceName.includes('green') && lowerServiceName.includes('api'))) {
      return 'whatsapp';
    }
    
    // SMS services - فحص عام
    if (lowerServiceName === 'twilio' || 
        lowerServiceName === 'nexmo' ||
        lowerServiceName === 'messagebird' ||
        lowerServiceName === 'mysmslogin') {
      return 'sms';
    }
    
    return null;
  };

 
  const handleSmsIntegrationStatusChange = (integrationId, isConnected) => {
    setRefreshSmsCategory(prev => prev + 1);
  };

  const handleWhatsAppIntegrationStatusChange = (integrationId, isConnected) => {
    setRefreshWhatsAppCategory(prev => prev + 1);
  };

  const handleDeleteSmsSettings = async (integrationId, serviceName) => {
    const confirmDelete = window.confirm(`هل أنت متأكد من حذف إعدادات ${serviceName}؟`);
    
    if (confirmDelete) {
      try {
        const smsSettingsResult = await dispatch(getSmsSettingsByIntegrationId(integrationId));
        
        if (smsSettingsResult.status && smsSettingsResult.data) {
          const smsId = smsSettingsResult.data.id;
          const result = await dispatch(deleteSmsSettings(smsId));
          
          if (result.status) {
            toast.success(`${serviceName} integration deleted successfully!`);
            handleSmsIntegrationStatusChange(integrationId, false);
          } else {
            toast.error(`Failed to delete ${serviceName} integration: ${result.message}`);
          }
        } else {
          toast.error(`Failed to get ${serviceName} settings: ${smsSettingsResult.message}`);
        }
      } catch (error) {
        toast.error(`Error deleting ${serviceName} integration: ${error.message}`);
      }
    }
  };

  // دالة لحذف إعدادات WhatsApp
  const handleDeleteWhatsAppSettings = async (integrationId, serviceName) => {
    const confirmDelete = window.confirm(`هل أنت متأكد من حذف إعدادات ${serviceName}؟`);
    
    if (confirmDelete) {
      try {
        const whatsAppSettingsResult = await dispatch(getWhatsAppSettingsByIntegrationId(integrationId));
        
        if (whatsAppSettingsResult.status && whatsAppSettingsResult.data) {
          const whatsAppId = whatsAppSettingsResult.data.id;
          const result = await dispatch(deleteWhatsAppSettings(whatsAppId));
          
          if (result.status) {
            toast.success(`${serviceName} integration deleted successfully!`);
            handleWhatsAppIntegrationStatusChange(integrationId, false);
          } else {
            toast.error(`Failed to delete ${serviceName} integration: ${result.message}`);
          }
        } else {
          toast.error(`Failed to get ${serviceName} settings: ${whatsAppSettingsResult.message}`);
        }
      } catch (error) {
        toast.error(`Error deleting ${serviceName} integration: ${error.message}`);
      }
    }
  };

  // الدالة المحدثة للاتصال
  const handleConnectClick = (serviceName, integrationId = null, type = '') => {
    // تحديد النوع بدقة
    let actualType = type;
    
    if (!actualType) {
      actualType = getServiceType(serviceName);
    }
    
    if (actualType === 'sms' || actualType === 'whatsapp') {
      setActiveModal(`${actualType}:${serviceName}`);
      setCurrentIntegrationId(integrationId);
    } else {
      toast.error(`${serviceName} integration is not available yet.`);
    }
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    setCurrentIntegrationId(null);
  };

  // دالة لجلب بيانات SMS الموجودة
  const handleGetSmsSettings = async (integrationId) => {
    try {
      const result = await dispatch(getSmsSettingsByIntegrationId(integrationId));
      return result;
    } catch (error) {
      return { status: false, data: null, message: error.message };
    }
  };

  // دالة لجلب بيانات WhatsApp الموجودة
  const handleGetWhatsAppSettings = async (integrationId) => {
    try {
      const result = await dispatch(getWhatsAppSettingsByIntegrationId(integrationId));
      return result;
    } catch (error) {
      return { status: false, data: null, message: error.message };
    }
  };

  const handleSave = async (payload, providedType) => {
    try {
      // استخدام النوع المرسل من الـ modal أو تحديده من activeModal
      const serviceType = providedType || (activeModal ? activeModal.split(':')[0] : null);
      
      if (serviceType === 'sms') {
        const result = await dispatch(createOrUpdateSmsSettings(payload));
        
        if (result.status) {
          toast.success(`SMS integration saved successfully!`);
          handleSmsIntegrationStatusChange(currentIntegrationId, true);
        } else {
          toast.error(`Failed to save SMS integration: ${result.message}`);
        }
      } else if (serviceType === 'whatsapp') {
        const result = await dispatch(createOrUpdateWhatsAppSettings(payload));
        
        if (result.status) {
          toast.success(`WhatsApp integration saved successfully!`);
          handleWhatsAppIntegrationStatusChange(currentIntegrationId, true);
        } else {
          toast.error(`Failed to save WhatsApp integration: ${result.message}`);
        }
      } else {
        toast.success(`Integration saved successfully!`);
      }
      
      handleCloseModal();
    } catch (error) {
      toast.error(`Error saving integration: ${error.message}`);
    }
  };

  // دالة لعرض المحتوى بناءً على القسم النشط
  const renderActiveSection = () => {
    switch (activeSection) {
      // case 'calendar':
      //   return (
      //     <CalendarCategory 
      //       id="calendar"
      //       searchQuery={searchQuery} 
      //       onConnectClick={handleConnectClick} 
      //     />
      //   );
      // case 'video':
      //   return (
      //     <VideoConferencingCategory 
      //       id="video"
      //       searchQuery={searchQuery} 
      //       onConnectClick={handleConnectClick} 
      //     />
      //   );
      // case 'crm':
      //   return (
      //     <CrmSalesCategory 
      //       id="crm"
      //       searchQuery={searchQuery} 
      //       onConnectClick={handleConnectClick} 
      //     />
      //   );
      case 'email':
        return (
          <MailCategory 
            id="email"
            searchQuery={searchQuery} 
            onConnectClick={handleConnectClick} 
          />
        );
      case 'sms':
        return (
          <SmsCategory 
            id="sms"
            searchQuery={searchQuery} 
            onConnectClick={(serviceName, integrationId) => handleConnectClick(serviceName, integrationId, 'sms')}
            onDeleteClick={handleDeleteSmsSettings}
            refreshTrigger={refreshSmsCategory}
          />
        );
      case 'whatsapp':
        return (
          <WhatsAppCategory 
            id="whatsapp"
            searchQuery={searchQuery} 
            onConnectClick={(serviceName, integrationId) => handleConnectClick(serviceName, integrationId, 'whatsapp')}
            onDeleteClick={handleDeleteWhatsAppSettings}
            refreshTrigger={refreshWhatsAppCategory}
            active={activeSection === "whatsapp"}
          />
        );
      default:
        return (
           <SmsCategory 
            id="sms"
            searchQuery={searchQuery} 
            onConnectClick={(serviceName, integrationId) => handleConnectClick(serviceName, integrationId, 'sms')}
            onDeleteClick={handleDeleteSmsSettings}
            refreshTrigger={refreshSmsCategory}
          />
        );
    }
  };

  return (
    <div className="bg-white min-h-screen p-6 relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg font-medium text-gray-800">Integrations</h1>
        <input
          type="text"
          placeholder="Search"
          className="pl-4 pr-4 py-2 border border-gray-300 rounded-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* عرض القسم النشط فقط */}
      <div>
        {renderActiveSection()}
      </div>

      {/* عرض المكون الموحد الجديد */}
      {activeModal && (
        <UnifiedIntegrationModal 
          activeModal={activeModal} 
          integrationId={currentIntegrationId}
          onClose={handleCloseModal} 
          onSave={handleSave}
          getSmsSettings={handleGetSmsSettings}
          getWhatsAppSettings={handleGetWhatsAppSettings}
        />
      )}
    </div>
  );
};

export default IntegrationsPage;