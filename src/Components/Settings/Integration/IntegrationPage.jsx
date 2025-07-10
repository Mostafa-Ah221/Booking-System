import React, { useEffect, useState } from 'react';
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

const IntegrationsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState(null);
  const [currentIntegrationId, setCurrentIntegrationId] = useState(null);
  const [refreshSmsCategory, setRefreshSmsCategory] = useState(0); 
  const [refreshWhatsAppCategory, setRefreshWhatsAppCategory] = useState(0); 
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const sectionId = location.hash.replace("#", "");
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  // تعريف دقيق للخدمات مع التمييز الواضح
 // تعريف دقيق للخدمات مع التمييز الواضح - مُحدث
const SERVICE_MAPPING = {
  // WhatsApp Services - أسماء كاملة ومميزة أولاً
  'WhatsApp Business API': { type: 'whatsapp', displayName: 'WhatsApp Business API' },
  'Twilio WhatsApp': { type: 'whatsapp', displayName: 'Twilio WhatsApp' },
  'WhatsApp Business': { type: 'whatsapp', displayName: 'WhatsApp Business' },
  '360Dialog': { type: 'whatsapp', displayName: '360Dialog' },
  'ChatAPI': { type: 'whatsapp', displayName: 'ChatAPI' },
  'GreenApi': { type: 'whatsapp', displayName: 'Green API' },
  'Green API': { type: 'whatsapp', displayName: 'Green API' },
  
  // SMS Services - الأسماء الأقل تحديداً في النهاية
  'Twilio': { type: 'sms', displayName: 'Twilio SMS' },
  'Nexmo': { type: 'sms', displayName: 'Nexmo/Vonage' },
  'MessageBird': { type: 'sms', displayName: 'MessageBird' },
  'MySmsLogin': { type: 'sms', displayName: 'MySmsLogin' }
};

// دالة للحصول على نوع الخدمة بدقة - محسنة
const getServiceType = (serviceName) => {
  console.log('Getting service type for:', serviceName);
  
  // البحث المباشر أولاً (أدق طريقة)
  if (SERVICE_MAPPING[serviceName]) {
    console.log('Found direct match:', SERVICE_MAPPING[serviceName].type);
    return SERVICE_MAPPING[serviceName].type;
  }
  
  // البحث بالأسماء الطويلة أولاً (لتجنب مشكلة Twilio)
  const sortedKeys = Object.keys(SERVICE_MAPPING).sort((a, b) => b.length - a.length);
  
  for (const key of sortedKeys) {
    if (serviceName.toLowerCase().includes(key.toLowerCase()) || 
        key.toLowerCase().includes(serviceName.toLowerCase())) {
      console.log('Found partial match:', key, '->', SERVICE_MAPPING[key].type);
      return SERVICE_MAPPING[key].type;
    }
  }
  
  // فحص نهائي بالكلمات المفتاحية
  const lowerServiceName = serviceName.toLowerCase();
  
  // WhatsApp services - فحص مفصل
  if (lowerServiceName.includes('whatsapp')) {
    console.log('Found WhatsApp keyword');
    return 'whatsapp';
  }
  
  // فحص محدد للخدمات
  if (lowerServiceName === '360dialog' ||
      lowerServiceName === 'chatapi' ||
      (lowerServiceName.includes('green') && lowerServiceName.includes('api'))) {
    console.log('Found specific WhatsApp service');
    return 'whatsapp';
  }
  
  // SMS services - فحص عام
  if (lowerServiceName === 'twilio' || 
      lowerServiceName === 'nexmo' ||
      lowerServiceName === 'messagebird' ||
      lowerServiceName === 'mysmslogin') {
    console.log('Found SMS service');
    return 'sms';
  }
  
  console.log('No service type found for:', serviceName);
  return null;
};

  // قوائم المزودين للتوافق مع الكود القديم
  const SMS_PROVIDERS = Object.keys(SERVICE_MAPPING).filter(key => SERVICE_MAPPING[key].type === 'sms');
  const WHATSAPP_PROVIDERS = Object.keys(SERVICE_MAPPING).filter(key => SERVICE_MAPPING[key].type === 'whatsapp');

  // دالة لتحديث حالة الاتصال فوراً للـ SMS
  const handleSmsIntegrationStatusChange = (integrationId, isConnected) => {
    setRefreshSmsCategory(prev => prev + 1);
  };

  // دالة لتحديث حالة الاتصال فوراً للـ WhatsApp
  const handleWhatsAppIntegrationStatusChange = (integrationId, isConnected) => {
    setRefreshWhatsAppCategory(prev => prev + 1);
  };

  // دالة لحذف إعدادات SMS
  const handleDeleteSmsSettings = async (integrationId, serviceName) => {
    const confirmDelete = window.confirm(`هل أنت متأكد من حذف إعدادات ${serviceName}؟`);
    
    if (confirmDelete) {
      try {
        const smsSettingsResult = await dispatch(getSmsSettingsByIntegrationId(integrationId));
        
        if (smsSettingsResult.status && smsSettingsResult.data) {
          const smsId = smsSettingsResult.data.id;
          const result = await dispatch(deleteSmsSettings(smsId));
          
          if (result.status) {
            console.log('SMS Settings deleted successfully!');
            alert(`${serviceName} integration deleted successfully!`);
            handleSmsIntegrationStatusChange(integrationId, false);
          } else {
            console.error('Failed to delete SMS settings:', result.message);
            alert(`Failed to delete ${serviceName} integration: ${result.message}`);
          }
        } else {
          console.error('Failed to get SMS settings:', smsSettingsResult.message);
          alert(`Failed to get ${serviceName} settings: ${smsSettingsResult.message}`);
        }
      } catch (error) {
        console.error('Error deleting SMS integration:', error);
        alert(`Error deleting ${serviceName} integration: ${error.message}`);
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
            console.log('WhatsApp Settings deleted successfully!');
            alert(`${serviceName} integration deleted successfully!`);
            handleWhatsAppIntegrationStatusChange(integrationId, false);
          } else {
            console.error('Failed to delete WhatsApp settings:', result.message);
            alert(`Failed to delete ${serviceName} integration: ${result.message}`);
          }
        } else {
          console.error('Failed to get WhatsApp settings:', whatsAppSettingsResult.message);
          alert(`Failed to get ${serviceName} settings: ${whatsAppSettingsResult.message}`);
        }
      } catch (error) {
        console.error('Error deleting WhatsApp integration:', error);
        alert(`Error deleting ${serviceName} integration: ${error.message}`);
      }
    }
  };

  // الدالة المحدثة للاتصال - مع debugging مفصل
  const handleConnectClick = (serviceName, integrationId = null, type = '') => {
    console.log('=== DEBUG INFO ===');
    console.log('Service Name received:', serviceName);
    console.log('Integration ID:', integrationId);
    console.log('Type passed:', type);
    
    // تحديد النوع بدقة
    let actualType = type;
    
    if (!actualType) {
      actualType = getServiceType(serviceName);
    }
    
    console.log('Determined type:', actualType);
    console.log('Will open modal:', `${actualType}:${serviceName}`);
    console.log('==================');
    
    if (actualType === 'sms' || actualType === 'whatsapp') {
      setActiveModal(`${actualType}:${serviceName}`);
      setCurrentIntegrationId(integrationId);
    } else {
      console.error('Unknown service type for:', serviceName);
      alert(`${serviceName} integration is not available yet.`);
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
      console.error('Error fetching SMS settings:', error);
      return { status: false, data: null, message: error.message };
    }
  };

  // دالة لجلب بيانات WhatsApp الموجودة
  const handleGetWhatsAppSettings = async (integrationId) => {
    try {
      const result = await dispatch(getWhatsAppSettingsByIntegrationId(integrationId));
      return result;
    } catch (error) {
      console.error('Error fetching WhatsApp settings:', error);
      return { status: false, data: null, message: error.message };
    }
  };

  const handleSave = async (payload, providedType) => {
    console.log('Saving settings for:', activeModal, 'with payload:', payload);
    console.log('Provided type:', providedType);
    
    try {
      // استخدام النوع المرسل من الـ modal أو تحديده من activeModal
      const serviceType = providedType || (activeModal ? activeModal.split(':')[0] : null);
      
      if (serviceType === 'sms') {
        const result = await dispatch(createOrUpdateSmsSettings(payload));
        
        if (result.status) {
          console.log('SMS Settings saved successfully!');
          alert(`SMS integration saved successfully!`);
          handleSmsIntegrationStatusChange(currentIntegrationId, true);
        } else {
          console.error('Failed to save SMS settings:', result.message);
          alert(`Failed to save SMS integration: ${result.message}`);
        }
      } else if (serviceType === 'whatsapp') {
        const result = await dispatch(createOrUpdateWhatsAppSettings(payload));
        
        if (result.status) {
          console.log('WhatsApp Settings saved successfully!');
          alert(`WhatsApp integration saved successfully!`);
          handleWhatsAppIntegrationStatusChange(currentIntegrationId, true);
        } else {
          console.error('Failed to save WhatsApp settings:', result.message);
          alert(`Failed to save WhatsApp integration: ${result.message}`);
        }
      } else {
        console.log('Other integration type - implement respective API call');
        alert(`Integration saved successfully!`);
      }
      
      handleCloseModal();
    } catch (error) {
      console.error('Error saving integration:', error);
      alert(`Error saving integration: ${error.message}`);
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

      <div>
        <CalendarCategory 
          id="calendar"
          searchQuery={searchQuery} 
          onConnectClick={handleConnectClick} 
        />
        <VideoConferencingCategory 
          id="video"
          searchQuery={searchQuery} 
          onConnectClick={handleConnectClick} 
        />
        <CrmSalesCategory 
          id="crm"
          searchQuery={searchQuery} 
          onConnectClick={handleConnectClick} 
        />
        <PaymentsCategory 
          id="payments"
          searchQuery={searchQuery} 
          onConnectClick={handleConnectClick} 
        />
        <SmsCategory 
          id="sms"
          searchQuery={searchQuery} 
          onConnectClick={(serviceName, integrationId) => handleConnectClick(serviceName, integrationId, 'sms')}
          onDeleteClick={handleDeleteSmsSettings}
          refreshTrigger={refreshSmsCategory}
        />
        <WhatsAppCategory 
          id="whatsapp"
          searchQuery={searchQuery} 
          onConnectClick={(serviceName, integrationId) => handleConnectClick(serviceName, integrationId, 'whatsapp')}
          onDeleteClick={handleDeleteWhatsAppSettings}
          refreshTrigger={refreshWhatsAppCategory}
        />
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