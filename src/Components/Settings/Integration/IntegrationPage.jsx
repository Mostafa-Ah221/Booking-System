import { useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import UpgradeRequiredModal from '../../Pricing/Upgraderequiredmodal';
import { saveIwentaSelection, getIwentaFullConfig } from '../../../redux/apiCalls/whatsAiwntaCallapis';

const IntegrationsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState(null);
  const [currentIntegrationId, setCurrentIntegrationId] = useState(null);
  const [refreshSmsCategory, setRefreshSmsCategory] = useState(0);
  const [refreshWhatsAppCategory, setRefreshWhatsAppCategory] = useState(0);
  const [activeSection, setActiveSection] = useState('calendar');
  const dispatch = useDispatch();
  const location = useLocation();

  const plan = useSelector((state) => state.subscription?.plan);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
console.log('plan from redux:', plan);

  useLayoutEffect(() => {
    const sectionId = location.hash.replace("#", "") || location.state?.scrollTo;
    if (sectionId) {
      setActiveSection(sectionId);
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        setTimeout(() => {
          const elem = document.getElementById(sectionId);
          if (elem) elem.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 50);
      }
    }
  }, [location.hash, location.state?.scrollTo]);

  const SERVICE_MAPPING = {
    'WhatsApp Business API': { type: 'whatsapp', displayName: 'WhatsApp Business API' },
    'Twilio WhatsApp':       { type: 'whatsapp', displayName: 'Twilio WhatsApp' },
    'WhatsApp Business':     { type: 'whatsapp', displayName: 'WhatsApp_Business' },
    '360Dialog':             { type: 'whatsapp', displayName: '360Dialog' },
    'ChatAPI':               { type: 'whatsapp', displayName: 'ChatAPI' },
    'GreenApi':              { type: 'whatsapp', displayName: 'Green API' },
    'Green API':             { type: 'whatsapp', displayName: 'Green API' },
    'Iwenta':                { type: 'whatsapp', displayName: 'Iwenta' },
    'iwnta':                 { type: 'whatsapp', displayName: 'Iwenta' },
    'Twilio':                { type: 'sms',      displayName: 'Twilio SMS' },
    'Nexmo':                 { type: 'sms',      displayName: 'Nexmo/Vonage' },
    'MessageBird':           { type: 'sms',      displayName: 'MessageBird' },
    'MySmsLogin':            { type: 'sms',      displayName: 'MySmsLogin' },
  };

  const getServiceType = (serviceName) => {
    if (SERVICE_MAPPING[serviceName]) return SERVICE_MAPPING[serviceName].type;
    const sortedKeys = Object.keys(SERVICE_MAPPING).sort((a, b) => b.length - a.length);
    for (const key of sortedKeys) {
      if (serviceName.toLowerCase().includes(key.toLowerCase()) ||
          key.toLowerCase().includes(serviceName.toLowerCase())) {
        return SERVICE_MAPPING[key].type;
      }
    }
    const lower = serviceName.toLowerCase();
    if (lower.includes('whatsapp') || lower === 'iwnta' || lower === 'iwenta') return 'whatsapp';
    if (lower === '360dialog' || lower === 'chatapi' || (lower.includes('green') && lower.includes('api'))) return 'whatsapp';
    if (lower === 'twilio' || lower === 'nexmo' || lower === 'messagebird' || lower === 'mysmslogin') return 'sms';
    return null;
  };

  const handleSmsIntegrationStatusChange     = () => setRefreshSmsCategory(prev => prev + 1);
  const handleWhatsAppIntegrationStatusChange = () => setRefreshWhatsAppCategory(prev => prev + 1);

  const handleDeleteSmsSettings = async (integrationId, serviceName) => {
    if (!window.confirm(`Are you sure you want to delete ${serviceName} settings?`)) return;
    try {
      const result1 = await dispatch(getSmsSettingsByIntegrationId(integrationId));
      if (result1.status && result1.data) {
        const result2 = await dispatch(deleteSmsSettings(result1.data.id));
        if (result2.status) {
          toast.success(`${serviceName} integration deleted successfully!`);
          handleSmsIntegrationStatusChange();
        } else { toast.error(`Failed to delete: ${result2.message}`); }
      } else { toast.error(`Failed to get settings: ${result1.message}`); }
    } catch (e) { toast.error(`Error: ${e.message}`); }
  };

  const handleDeleteWhatsAppSettings = async (integrationId, serviceName) => {
    if (!window.confirm(`Are you sure you want to delete ${serviceName} settings?`)) return;
    try {
      const result1 = await dispatch(getWhatsAppSettingsByIntegrationId(integrationId));
      if (result1.status && result1.data) {
        const result2 = await dispatch(deleteWhatsAppSettings(result1.data.id));
        if (result2.status) {
          toast.success(`${serviceName} integration deleted successfully!`);
          handleWhatsAppIntegrationStatusChange();
        } else { toast.error(`Failed to delete: ${result2.message}`); }
      } else { toast.error(`Failed to get settings: ${result1.message}`); }
    } catch (e) { toast.error(`Error: ${e.message}`); }
  };

  const handleConnectClick = (serviceName, integrationId = null, type = '') => {
      console.log('handleConnectClick:', { serviceName, integrationId, type });
  const actualType = type || getServiceType(serviceName);
  console.log('actualType:', actualType);
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

  const handleGetSmsSettings = async (integrationId) => {
    try { return await dispatch(getSmsSettingsByIntegrationId(integrationId)); }
    catch (e) { return { status: false, data: null, message: e.message }; }
  };

  const handleGetWhatsAppSettings = async (integrationId) => {
    try { return await dispatch(getWhatsAppSettingsByIntegrationId(integrationId)); }
    catch (e) { return { status: false, data: null, message: e.message }; }
  };

  const handleSave = async (payload, providedType) => {
    try {
      const serviceType = providedType || (activeModal ? activeModal.split(':')[0] : null);
      if (serviceType === 'sms') {
        const result = await dispatch(createOrUpdateSmsSettings(payload));
        if (result.status) { toast.success('SMS integration saved successfully!'); handleSmsIntegrationStatusChange(); }
        else { toast.error(`Failed: ${result.message}`); }
      } else if (serviceType === 'whatsapp') {
        const result = await dispatch(createOrUpdateWhatsAppSettings(payload));
        if (result.status) { toast.success('WhatsApp integration saved successfully!'); handleWhatsAppIntegrationStatusChange(); }
        else { toast.error(`Failed: ${result.message}`); }
      }
      handleCloseModal();
    } catch (e) { toast.error(`Error: ${e.message}`); }
  };

  const handleSaveIwentaCredentials = async (payload) => {
    try {
      const result = await dispatch(createOrUpdateWhatsAppSettings(payload));
      if (result.status) return { status: true, data: result.data };
      toast.error(`Connection failed: ${result.message}`);
      return { status: false, message: result.message };
    } catch (e) {
      toast.error(`Error: ${e.message}`);
      return { status: false, message: e.message };
    }
  };

  const handleSaveIwentaSelection = async (payload) => {
    try {
      const result = await dispatch(saveIwentaSelection(payload));
      if (result?.status) {
      handleWhatsAppIntegrationStatusChange(); 
      handleCloseModal(); 
    }
      return result;
    } catch (e) {
      toast.error(`Error: ${e.message}`);
      return { status: false, message: e.message };
    }
  };

  const handleAutoLoad = async (integrationId) => {
    return await dispatch(getIwentaFullConfig(integrationId));
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'email':
        return <MailCategory id="email" searchQuery={searchQuery} onConnectClick={handleConnectClick} />;
      case 'sms':
        return (
          <SmsCategory
            id="sms"
            searchQuery={searchQuery}
            onConnectClick={(name, id) => handleConnectClick(name, id, 'sms')}
            onDeleteClick={handleDeleteSmsSettings}
            refreshTrigger={refreshSmsCategory}
            plan={plan}                           
      onLockedClick={() => setIsUpgradeModalOpen(true)}
          />
        );
      case 'whatsapp':
        return (
          <WhatsAppCategory
            id="whatsapp"
            searchQuery={searchQuery}
            onConnectClick={(name, id) => handleConnectClick(name, id, 'whatsapp')}
            onDeleteClick={handleDeleteWhatsAppSettings}
            refreshTrigger={refreshWhatsAppCategory}
            active={activeSection === "whatsapp"}
            plan={plan}                                       
      onLockedClick={() => setIsUpgradeModalOpen(true)}
          />
        );
      default:
        return (
          <SmsCategory
            id="sms"
            searchQuery={searchQuery}
            onConnectClick={(name, id) => handleConnectClick(name, id, 'sms')}
            onDeleteClick={handleDeleteSmsSettings}
            refreshTrigger={refreshSmsCategory}
            plan={plan}                             
           onLockedClick={() => setIsUpgradeModalOpen(true)}
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

      <div>{renderActiveSection()}</div>

      {activeModal && (
        <UnifiedIntegrationModal
          activeModal={activeModal}
          integrationId={currentIntegrationId}
          onClose={handleCloseModal}
          onSave={handleSave}
          getSmsSettings={handleGetSmsSettings}
          getWhatsAppSettings={handleGetWhatsAppSettings}
          onSaveIwentaCredentials={handleSaveIwentaCredentials}
          onSaveIwentaSelection={handleSaveIwentaSelection}
          onAutoLoad={handleAutoLoad} 
        />
      )}
      <UpgradeRequiredModal
  isOpen={isUpgradeModalOpen}
  onClose={() => setIsUpgradeModalOpen(false)}
/>
    </div>
  );
};

export default IntegrationsPage;