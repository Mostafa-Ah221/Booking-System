import { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWhatsAppIntegrations, getWhatsAppSettingsByIntegrationId } from '../../../../redux/apiCalls/whatsAppCallApi';
import IntegrationCategory from './integrationCategory';

const WhatsAppCategory = ({ searchQuery, onConnectClick, onDeleteClick, refreshTrigger,active }) => {
  const dispatch = useDispatch();
  const { integrationsWhatsApp, loading } = useSelector(state => state.whatsApp);
  const [integrationsWithSettings, setIntegrationsWithSettings] = useState([]);
  const [isCheckingSettings, setIsCheckingSettings] = useState(false);
  
  const lastRefreshTrigger = useRef(0);
  const isInitialized = useRef(false);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    if (!active || isInitialized.current) return;
      dispatch(fetchWhatsAppIntegrations());
      isInitialized.current = true;
    
  }, [dispatch, active]);

  const checkIntegrationsSettings = useCallback(async () => {
    if (isCheckingSettings || integrationsWhatsApp.length === 0) return;
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = { abort: () => {} };
    
    setIsCheckingSettings(true);
    
    try {
      // ✅ Batch size: 3 requests في نفس الوقت
      const BATCH_SIZE = 3;
      const results = [];
      
      for (let i = 0; i < integrationsWhatsApp.length; i += BATCH_SIZE) {
        const batch = integrationsWhatsApp.slice(i, i + BATCH_SIZE);
        
        // ✅ اعمل fetch للـ batch دي في نفس الوقت
        const batchResults = await Promise.all(
          batch.map(async (integration) => {
            try {
              const result = await dispatch(
                getWhatsAppSettingsByIntegrationId(integration.id)
              );
              
              const isConnected = result?.status && 
                                 result?.data?.data && 
                                 parseInt(result.data.status) === 1;
              
              return { ...integration, connected: isConnected };
              
            } catch (error) {
              console.error(`Error checking settings for ${integration.name}:`, error);
              return { ...integration, connected: false };
            }
          })
        );
        
        results.push(...batchResults);
        
        // ✅ انتظر 200ms بين الـ batches (أسرع من 500ms)
        if (i + BATCH_SIZE < integrationsWhatsApp.length) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }
      
      setIntegrationsWithSettings(results);
      
    } catch (error) {
      console.error("Error in checkIntegrationsSettings:", error);
    } finally {
      setIsCheckingSettings(false);
    }
  }, [integrationsWhatsApp, dispatch, isCheckingSettings]);
  
  useEffect(() => {
    if (integrationsWhatsApp.length > 0 && integrationsWithSettings.length === 0) {
      // ✅ تأخير أقل: 200ms بدل 500ms
      const timer = setTimeout(() => {
        checkIntegrationsSettings();
      }, 200);
      
      return () => clearTimeout(timer);
    }
  }, [integrationsWhatsApp, integrationsWithSettings.length, checkIntegrationsSettings]);

  useEffect(() => {
    if (refreshTrigger > 0 && refreshTrigger !== lastRefreshTrigger.current) {
      lastRefreshTrigger.current = refreshTrigger;
      
      const timer = setTimeout(() => {
        checkIntegrationsSettings();
      }, 200);
      
      return () => clearTimeout(timer);
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
        <div className="text-sm text-gray-500 mb-2 flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
          <span>Checking WhatsApp settings...</span>
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