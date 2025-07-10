import { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWhatsAppIntegrations, getWhatsAppSettingsByIntegrationId } from '../../../../redux/apiCalls/whatsAppCallApi';
import IntegrationCategory from './integrationCategory';

const WhatsAppCategory = ({ searchQuery, onConnectClick, onDeleteClick, refreshTrigger }) => {
  const dispatch = useDispatch();
  const { integrationsWhatsApp, loading } = useSelector(state => state.whatsApp);
  const [integrationsWithSettings, setIntegrationsWithSettings] = useState([]);
  const [isCheckingSettings, setIsCheckingSettings] = useState(false);
  
  const lastRefreshTrigger = useRef(0);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!isInitialized.current) {
      dispatch(fetchWhatsAppIntegrations());
      isInitialized.current = true;
    }
  }, [dispatch]);

  console.log(integrationsWhatsApp);

  const checkIntegrationsSettings = useCallback(async () => {
    if (!isCheckingSettings && integrationsWhatsApp.length > 0) {
      setIsCheckingSettings(true);
      try {
        const results = await Promise.all(
          integrationsWhatsApp.map(integration =>
            dispatch(getWhatsAppSettingsByIntegrationId(integration.id))
              .then(result => {
                const isConnected = result?.status && result?.data?.data && parseInt(result.data.status) === 1;
                return { ...integration, connected: isConnected };
              })
              .catch(error => {
                console.error(`Error checking settings for ${integration.name}:`, error);
                return { ...integration, connected: false };
              })
          )
        );
        setIntegrationsWithSettings(results);
      } catch (error) {
        console.error("Error in checkIntegrationsSettings:", error);
      } finally {
        setIsCheckingSettings(false);
      }
    }
  }, [integrationsWhatsApp, dispatch, isCheckingSettings]);
  
  useEffect(() => {
    if (integrationsWhatsApp.length > 0 && integrationsWithSettings.length === 0) {
      checkIntegrationsSettings();
    }
  }, [integrationsWhatsApp, integrationsWithSettings.length, checkIntegrationsSettings]);

  useEffect(() => {
    if (refreshTrigger > 0 && refreshTrigger !== lastRefreshTrigger.current) {
      lastRefreshTrigger.current = refreshTrigger;
      checkIntegrationsSettings();
    }
  }, [refreshTrigger, checkIntegrationsSettings]);

  const generateIcon = useCallback((name) => {
    const short = name.length > 2 ? name.slice(0, 2).toUpperCase() : name.toUpperCase();
    const colors = {
      twilio: 'bg-red-600',
      nexmo: 'bg-orange-500',
      messagebird: 'bg-blue-500',
      mysmslogin: 'bg-green-500',
    };

    const key = name.toLowerCase();
    const bg = colors[key] || 'bg-gray-500';

    return (
      <div className={`w-6 h-6 ${bg} rounded text-white text-xs flex items-center justify-center font-bold`}>
        {short}
      </div>
    );
  }, []);

  const integrationItems = integrationsWithSettings.map((item) => ({
    id: item.id,
    name: item.name,
    icon: generateIcon(item.name),
    description: 'Send WhatsApp alerts to customers and users.',
    connected: item.connected, 
    disabled: loading || isCheckingSettings
  }));

  const filteredItems = integrationItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCategory = {
    title: 'WhatsApp',
    items: filteredItems
  };

  if (filteredItems.length === 0) return null;

  return (
    <div>
      {isCheckingSettings && (
        <div className="text-sm text-gray-500 mb-2">
          جاري فحص إعدادات WhatsApp...
        </div>
      )}
      <IntegrationCategory
    category={filteredCategory}
    onConnectClick={(serviceName, integrationId) => onConnectClick(serviceName, integrationId, 'whatsapp')}
    onDeleteClick={onDeleteClick}
  />
    </div>
  );
};

export default WhatsAppCategory;