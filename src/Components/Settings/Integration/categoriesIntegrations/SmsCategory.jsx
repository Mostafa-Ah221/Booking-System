import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSmsIntegrations, getSmsSettingsByIntegrationId } from '../../../../redux/apiCalls/smsIntegrationCallApi';
import IntegrationCategory from './integrationCategory';

// Custom debounce hook
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
  
  // Cache للنتائج مع timestamp
  const settingsCache = useRef(new Map());
  const CACHE_DURATION = 5 * 60 * 1000; // 5 دقائق

  useEffect(() => {
    dispatch(fetchSmsIntegrations());
  }, [dispatch]);

  // دالة للتحقق من صحة الـ cache
  const isCacheValid = (integrationId) => {
    const cached = settingsCache.current.get(integrationId);
    if (!cached) return false;
    
    return Date.now() - cached.timestamp < CACHE_DURATION;
  };

  const checkSingleIntegrationSettings = async (integration) => {
    try {
      // التحقق من الـ cache أولاً
      if (isCacheValid(integration.id)) {
        const cached = settingsCache.current.get(integration.id);
        return {
          ...integration,
          connected: cached.connected
        };
      }

      const result = await dispatch(getSmsSettingsByIntegrationId(integration.id));
      
      const isConnected = result.status && 
                         result.data && 
                         result.data.data && 
                         parseInt(result.data.status) === 1;
      
      // حفظ في الـ cache مع timestamp
      settingsCache.current.set(integration.id, {
        connected: isConnected,
        timestamp: Date.now()
      });
      
      return {
        ...integration,
        connected: isConnected
      };
    } catch (error) {
      console.error(`Error checking settings for ${integration.name}:`, error);
      
      // حفظ النتيجة السلبية في الـ cache
      settingsCache.current.set(integration.id, {
        connected: false,
        timestamp: Date.now()
      });
      
      return {
        ...integration,
        connected: false
      };
    }
  };

  const checkIntegrationsSettings = useCallback(async (forceRefresh = false) => {
    if (integrations.length === 0 || isCheckingSettings) return;
    
    setIsCheckingSettings(true);
    
    try {
      if (forceRefresh) {
        // مسح الـ cache عند الـ force refresh
        settingsCache.current.clear();
      }
      
      // معالجة الـ integrations في مجموعات صغيرة لتجنب overwhelm الـ API
      const BATCH_SIZE = 3;
      const batches = [];
      
      for (let i = 0; i < integrations.length; i += BATCH_SIZE) {
        batches.push(integrations.slice(i, i + BATCH_SIZE));
      }
      
      const allResults = [];
      
      for (const batch of batches) {
        const batchPromises = batch.map(integration => 
          checkSingleIntegrationSettings(integration)
        );
        
        const batchResults = await Promise.all(batchPromises);
        allResults.push(...batchResults);
        
        // انتظار قصير بين الـ batches
        if (batches.indexOf(batch) < batches.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      
      setIntegrationsWithSettings(allResults);
    } finally {
      setIsCheckingSettings(false);
    }
  }, [integrations, dispatch, isCheckingSettings]);

  // Debounced version للـ refresh trigger
  const debouncedCheckSettings = useDebounce(
    () => checkIntegrationsSettings(true),
    1000 // انتظار ثانية واحدة
  );

  // استدعاء أول مرة عند تحميل البيانات
  useEffect(() => {
    if (integrations.length > 0 && integrationsWithSettings.length === 0) {
      checkIntegrationsSettings();
    }
  }, [integrations.length, integrationsWithSettings.length, checkIntegrationsSettings]);

  // معالجة الـ refresh trigger مع debouncing
  const previousRefreshTrigger = useRef(0);
  useEffect(() => {
    if (refreshTrigger > 0 && refreshTrigger !== previousRefreshTrigger.current) {
      previousRefreshTrigger.current = refreshTrigger;
      debouncedCheckSettings();
    }
  }, [refreshTrigger, debouncedCheckSettings]);

  const generateIcon = (name) => {
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
  };

  // استخدام useMemo لتحسين الأداء
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

  const filteredCategory = useMemo(() => ({
    title: 'SMS',
    items: filteredItems
  }), [filteredItems]);

  if (filteredItems.length === 0) return null;

  return <IntegrationCategory
    category={filteredCategory}
    onConnectClick={(serviceName, integrationId) => onConnectClick(serviceName, integrationId, 'sms')}
    onDeleteClick={onDeleteClick}
  />
};

export default SmsCategory;