import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSmsIntegrations, getSmsSettingsByIntegrationId } from '../../../../redux/apiCalls/smsIntegrationCallApi';
import IntegrationCategory from './integrationCategory';

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

const SkeletonGrid = ({ count = 4 }) => (
  <div>
    <h2 className="text-sm font-medium text-gray-800 pb-2 my-7 relative 
                after:content-[''] after:block after:w-8 after:h-[2px]
                after:bg-blue-800 after:mt-1">
      SMS
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  </div>
);

const useDebounce = (callback, delay) => {
  const timeoutRef = useRef();
  return useCallback((...args) => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => callback(...args), delay);
  }, [callback, delay]);
};

const SmsCategory = ({ searchQuery, onConnectClick, onDeleteClick, refreshTrigger }) => {
  const dispatch = useDispatch();
  const { integrations, loading } = useSelector(state => state.sms);
  const [integrationsWithSettings, setIntegrationsWithSettings] = useState([]);
  const [isCheckingSettings, setIsCheckingSettings] = useState(false);

  const settingsCache = useRef(new Map());
  const CACHE_DURATION = 5 * 60 * 1000;

  useEffect(() => {
    dispatch(fetchSmsIntegrations());
  }, [dispatch]);

  const isCacheValid = (integrationId) => {
    const cached = settingsCache.current.get(integrationId);
    if (!cached) return false;
    return Date.now() - cached.timestamp < CACHE_DURATION;
  };

  const checkSingleIntegrationSettings = async (integration) => {
    try {
      if (isCacheValid(integration.id)) {
        const cached = settingsCache.current.get(integration.id);
        return { ...integration, connected: cached.connected };
      }
      const result = await dispatch(getSmsSettingsByIntegrationId(integration.id));
      const isConnected = result.status && result.data && result.data.data && parseInt(result.data.status) === 1;
      settingsCache.current.set(integration.id, { connected: isConnected, timestamp: Date.now() });
      return { ...integration, connected: isConnected };
    } catch (error) {
      settingsCache.current.set(integration.id, { connected: false, timestamp: Date.now() });
      return { ...integration, connected: false };
    }
  };

  const checkIntegrationsSettings = useCallback(async (forceRefresh = false) => {
    if (integrations.length === 0 || isCheckingSettings) return;
    setIsCheckingSettings(true);
    try {
      if (forceRefresh) settingsCache.current.clear();
      const BATCH_SIZE = 3;
      const batches = [];
      for (let i = 0; i < integrations.length; i += BATCH_SIZE) {
        batches.push(integrations.slice(i, i + BATCH_SIZE));
      }
      const allResults = [];
      for (const batch of batches) {
        const batchResults = await Promise.all(batch.map(i => checkSingleIntegrationSettings(i)));
        allResults.push(...batchResults);
        if (batches.indexOf(batch) < batches.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      setIntegrationsWithSettings(allResults);
    } finally {
      setIsCheckingSettings(false);
    }
  }, [integrations, dispatch, isCheckingSettings]);

  const debouncedCheckSettings = useDebounce(() => checkIntegrationsSettings(true), 1000);

  useEffect(() => {
    if (integrations.length > 0 && integrationsWithSettings.length === 0) {
      checkIntegrationsSettings();
    }
  }, [integrations.length, integrationsWithSettings.length, checkIntegrationsSettings]);

  const previousRefreshTrigger = useRef(0);
  useEffect(() => {
    if (refreshTrigger > 0 && refreshTrigger !== previousRefreshTrigger.current) {
      previousRefreshTrigger.current = refreshTrigger;
      debouncedCheckSettings();
    }
  }, [refreshTrigger, debouncedCheckSettings]);

  const generateIcon = (name) => {
    const short = name.length > 2 ? name.slice(0, 2).toUpperCase() : name.toUpperCase();
    const colors = { twilio: 'bg-red-600', nexmo: 'bg-orange-500', messagebird: 'bg-blue-500', mysmslogin: 'bg-green-500' };
    const bg = colors[name.toLowerCase()] || 'bg-gray-500';
    return (
      <div className={`w-6 h-6 ${bg} rounded text-white text-xs flex items-center justify-center font-bold`}>
        {short}
      </div>
    );
  };

  // ✅ كل الـ useMemo لازم يكون فوق أي early return
  const integrationItems = useMemo(() =>
    integrationsWithSettings.map((item) => ({
      id: item.id,
      name: item.name,
      icon: generateIcon(item.name),
      description: 'Send SMS alerts to customers and users.',
      connected: item.connected,
      disabled: loading || isCheckingSettings
    })), [integrationsWithSettings, loading, isCheckingSettings]
  );

  const filteredItems = useMemo(() =>
    integrationItems.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    ), [integrationItems, searchQuery]
  );

  // ✅ early returns بعد كل الـ hooks
  const isLoading = loading || isCheckingSettings || integrationsWithSettings.length === 0;
  if (isLoading) return <SkeletonGrid count={integrations.length || 4} />;
  if (filteredItems.length === 0) return null;

  return (
    <IntegrationCategory
      category={{ title: 'SMS', items: filteredItems }}
      onConnectClick={(serviceName, integrationId) => onConnectClick(serviceName, integrationId, 'sms')}
      onDeleteClick={onDeleteClick}
    />
  );
};

export default SmsCategory;