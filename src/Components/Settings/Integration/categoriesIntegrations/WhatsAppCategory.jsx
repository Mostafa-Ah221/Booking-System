import { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWhatsAppIntegrations, getWhatsAppSettingsByIntegrationId } from '../../../../redux/apiCalls/whatsAppCallApi';
import IntegrationCategory from './integrationCategory';

// ✅ Skeleton Card
const SkeletonCard = () => (
  <div className="border border-gray-200 rounded-lg p-4 flex flex-col shadow-sm">
    <div className="flex justify-between items-center w-full">
      <div className="w-6 h-6 rounded bg-gray-200 animate-pulse" />
      <div className="w-16 h-6 rounded-md bg-gray-200 animate-pulse" />
    </div>
    <div className="mt-2 w-full">
      <div className="w-24 h-3.5 rounded bg-gray-200 animate-pulse mb-2" />
      <div className="w-full h-3 rounded bg-gray-100 animate-pulse mb-1" />
      <div className="w-3/4 h-3 rounded bg-gray-100 animate-pulse" />
    </div>
  </div>
);

// ✅ Skeleton Grid
const SkeletonGrid = ({ count = 6 }) => (
  <div>
    <h2 className="text-sm font-medium text-gray-800 pb-2 my-7 relative 
                after:content-[''] after:block after:w-8 after:h-[2px]
                after:bg-blue-800 after:mt-1">
      WhatsApp
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  </div>
);

const WhatsAppCategory = ({ searchQuery, onConnectClick, onDeleteClick, refreshTrigger, active }) => {
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

    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = { abort: () => {} };

    setIsCheckingSettings(true);

    try {
      const BATCH_SIZE = 3;
      const results = [];

      for (let i = 0; i < integrationsWhatsApp.length; i += BATCH_SIZE) {
        const batch = integrationsWhatsApp.slice(i, i + BATCH_SIZE);
        const batchResults = await Promise.all(
          batch.map(async (integration) => {
            try {
              const result = await dispatch(getWhatsAppSettingsByIntegrationId(integration.id));
              const isConnected = result?.status &&
                result?.data?.data &&
                parseInt(result.data.status) === 1;
              return { ...integration, connected: isConnected };
            } catch (error) {
              return { ...integration, connected: false };
            }
          })
        );
        results.push(...batchResults);
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
      const timer = setTimeout(() => checkIntegrationsSettings(), 200);
      return () => clearTimeout(timer);
    }
  }, [integrationsWhatsApp, integrationsWithSettings.length, checkIntegrationsSettings]);

  useEffect(() => {
    if (refreshTrigger > 0 && refreshTrigger !== lastRefreshTrigger.current) {
      lastRefreshTrigger.current = refreshTrigger;
      const timer = setTimeout(() => checkIntegrationsSettings(), 200);
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
    const bg = colors[name.toLowerCase()] || 'bg-gray-500';
    return (
      <div className={`w-6 h-6 ${bg} rounded text-white text-xs flex items-center justify-center font-bold`}>
        {short}
      </div>
    );
  }, []);

  // ✅ عرض Skeleton لو لسه بيحمل
  const isLoading = loading || isCheckingSettings || (active && integrationsWithSettings.length === 0);
  if (isLoading) {
    return <SkeletonGrid count={integrationsWhatsApp.length || 6} />;
  }

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

  if (filteredItems.length === 0) return null;

  return (
    <IntegrationCategory
      category={{ title: 'WhatsApp', items: filteredItems }}
      onConnectClick={(serviceName, integrationId) => onConnectClick(serviceName, integrationId, 'whatsapp')}
      onDeleteClick={onDeleteClick}
    />
  );
};

export default WhatsAppCategory;