import { useState, useEffect } from 'react';
import IwentaModal from './IwentaModal'; // ✅ import الـ IwentaModal

// ✅ Wrapper modal
const ModalWrapper = ({ title, children, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg relative">
      <h2 className="text-lg font-bold mb-4">{title}</h2>
      <button onClick={onClose} className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl">×</button>
      {children}
    </div>
  </div>
);

// ✅ Loading modal
const LoadingComponent = ({ onClose, type = 'integration' }) => {
  const loadingText = type === 'whatsapp' ? 'Loading WhatsApp integration data...' : 'Loading integration data...';
  const borderColor = type === 'whatsapp' ? 'border-green-600' : 'border-blue-600';
  return (
    <ModalWrapper title="Loading..." onClose={onClose}>
      <div className="flex justify-center items-center py-8">
        <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${borderColor}`}></div>
        <div className="ml-3 text-gray-500">{loadingText}</div>
      </div>
    </ModalWrapper>
  );
};

const normalize = (str) => str?.toLowerCase().replace(/\s+/g, '');

const PROVIDER_CONFIGS = {
  'WhatsApp Business API': { type: 'whatsapp', title: 'WhatsApp Business API Configuration', fields: [
    { key: 'phone_number_id', placeholder: 'Phone Number ID', type: 'text' },
    { key: 'access_token', placeholder: 'Access Token', type: 'password' },
    { key: 'business_account_id', placeholder: 'Business Account ID', type: 'text' },
    { key: 'webhook_verify_token', placeholder: 'Webhook Verify Token', type: 'text' }
  ]},
  'WhatsApp_Business': { type: 'whatsapp', title: 'WhatsApp Business API Configuration', fields: [
    { key: 'phone_number_id', placeholder: 'Phone Number ID', type: 'text' },
    { key: 'access_token', placeholder: 'Access Token', type: 'password' },
    { key: 'business_account_id', placeholder: 'Business Account ID', type: 'text' },
    { key: 'webhook_verify_token', placeholder: 'Webhook Verify Token', type: 'text' }
  ]},
  'Twilio WhatsApp': { type: 'whatsapp', title: 'Twilio WhatsApp Configuration', fields: [
    { key: 'account_sid', placeholder: 'Account SID', type: 'text' },
    { key: 'auth_token', placeholder: 'Auth Token', type: 'password' },
    { key: 'from', placeholder: 'From', type: 'text' },
    { key: 'content_sid', placeholder: 'Content SID', type: 'text' }
  ]},
  '360Dialog': { type: 'whatsapp', title: '360Dialog Configuration', fields: [
    { key: 'api_key', placeholder: 'API Key', type: 'password' },
    { key: 'client_id', placeholder: 'Client ID', type: 'text' },
    { key: 'namespace', placeholder: 'Namespace', type: 'text' }
  ]},
  'ChatAPI': { type: 'whatsapp', title: 'ChatAPI Configuration', fields: [
    { key: 'instance_id', placeholder: 'Instance ID', type: 'text' },
    { key: 'token', placeholder: 'Token', type: 'password' }
  ]},
  'Green API': { type: 'whatsapp', title: 'Green API Configuration', fields: [
    { key: 'instance_id', placeholder: 'Instance ID', type: 'text' },
    { key: 'token', placeholder: 'Token', type: 'password' },
    { key: 'url', placeholder: 'URL', type: 'url' }
  ]},
  'Twilio': { type: 'sms', title: 'Twilio SMS Integration', fields: [
    { key: 'account_sid', placeholder: 'Account SID', type: 'text' },
    { key: 'auth_token', placeholder: 'Auth Token', type: 'text' },
    { key: 'from', placeholder: 'From', type: 'text' }
  ]},
  'Nexmo': { type: 'sms', title: 'Nexmo/Vonage Integration', fields: [
    { key: 'api_key', placeholder: 'API Key', type: 'text' },
    { key: 'api_secret', placeholder: 'API Secret', type: 'text' },
    { key: 'from', placeholder: 'From', type: 'text' }
  ]},
  'MessageBird': { type: 'sms', title: 'MessageBird Integration', fields: [
    { key: 'api_key', placeholder: 'API Key', type: 'text' },
    { key: 'originator', placeholder: 'Originator', type: 'text' }
  ]},
  'MySmsLogin': { type: 'sms', title: 'MySmsLogin Integration', fields: [
    { key: 'user', placeholder: 'User', type: 'text' },
    { key: 'password', placeholder: 'Password', type: 'password' },
    { key: 'sender_id', placeholder: 'Sender ID', type: 'text' }
  ]}
};

// ✅ Helper: هل الـ provider هو Iwenta؟
const isIwentaProvider = (providerName) => {
  if (!providerName) return false;
  const lower = providerName.toLowerCase();
  return lower === 'iwnta' || lower === 'iwenta';
};

const findProviderConfig = (providerName, expectedType) => {
  const exactMatch = PROVIDER_CONFIGS[providerName];
  if (exactMatch) {
    if (expectedType && exactMatch.type !== expectedType) {
      // type mismatch
    } else {
      return { key: providerName, config: exactMatch };
    }
  }

  if (expectedType) {
    const providersOfType = Object.keys(PROVIDER_CONFIGS)
      .filter(key => PROVIDER_CONFIGS[key].type === expectedType)
      .sort((a, b) => b.length - a.length);

    for (const providerKey of providersOfType) {
      if (providerKey.toLowerCase() === providerName.toLowerCase()) {
        return { key: providerKey, config: PROVIDER_CONFIGS[providerKey] };
      }
    }

    for (const providerKey of providersOfType) {
      const normalizedProvider = providerKey.toLowerCase().replace(/\s+/g, '');
      const normalizedSearch = providerName.toLowerCase().replace(/\s+/g, '');
      if (normalizedProvider.includes(normalizedSearch) || normalizedSearch.includes(normalizedProvider)) {
        return { key: providerKey, config: PROVIDER_CONFIGS[providerKey] };
      }
    }
  }

  const allProviders = Object.keys(PROVIDER_CONFIGS).sort((a, b) => b.length - a.length);
  for (const providerKey of allProviders) {
    if (providerKey.toLowerCase() === providerName.toLowerCase()) {
      return { key: providerKey, config: PROVIDER_CONFIGS[providerKey] };
    }
  }
  for (const providerKey of allProviders) {
    const normalizedProvider = providerKey.toLowerCase().replace(/\s+/g, '');
    const normalizedSearch = providerName.toLowerCase().replace(/\s+/g, '');
    if (normalizedProvider.includes(normalizedSearch) || normalizedSearch.includes(normalizedProvider)) {
      return { key: providerKey, config: PROVIDER_CONFIGS[providerKey] };
    }
  }

  return { key: null, config: null };
};

// ✅ Unified Integration Modal
const UnifiedIntegrationModal = ({
  activeModal,
  integrationId,
  onClose,
  onSave,
  getSmsSettings,
  getWhatsAppSettings,
  // ✅ Props جديدة للـ Iwenta
  onSaveIwentaCredentials,
  onSaveIwentaSelection,
}) => {
  const [type, providerName] = activeModal?.split(':') || [];

  // ✅ لو Iwenta → عرض IwentaModal مباشرة
  if (isIwentaProvider(providerName)) {
    return (
      <IwentaModal
        integrationId={integrationId}
        onClose={onClose}
        onSaveCredentials={onSaveIwentaCredentials}
        onSaveSelection={onSaveIwentaSelection}
        getWhatsAppSettings={getWhatsAppSettings}
      />
    );
  }

  // ✅ باقي الـ providers — الكود القديم
  const { key: providerKey, config } = findProviderConfig(providerName, type);

  const [formData, setFormData] = useState(() => {
    if (!config) return { status: 1 };
    const data = { status: 1 };
    config.fields.forEach(field => data[field.key] = '');
    return data;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [hasExistingData, setHasExistingData] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!integrationId || !config) return;
      setIsLoading(true);
      try {
        const result = config.type === 'whatsapp'
          ? await getWhatsAppSettings(integrationId)
          : await getSmsSettings(integrationId);

        if (result?.status && result.data) {
          const updatedForm = {
            status: result.data.status !== undefined ? parseInt(result.data.status) : 1
          };
          config.fields.forEach(field => {
            updatedForm[field.key] = result.data.data[field.key] || '';
          });
          setFormData(updatedForm);
          setHasExistingData(true);
        }
      } catch (err) {
        console.error(`Error fetching settings for ${activeModal}:`, err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [integrationId, config, activeModal, getSmsSettings, getWhatsAppSettings]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveClick = () => {
    if (!config) return;
    const payload = {
      integration_id: integrationId,
      status: formData.status,
      data: config.fields.reduce((acc, field) => {
        acc[field.key] = formData[field.key];
        return acc;
      }, {})
    };
    onSave(payload, config.type);
  };

  if (isLoading) return <LoadingComponent onClose={onClose} type={config?.type || 'integration'} />;

  if (!activeModal || !config) {
    return (
      <ModalWrapper title="Error" onClose={onClose}>
        <div className="text-red-500 text-center py-4">
          {!activeModal ? 'No provider selected' : `Unknown provider: ${activeModal}`}
          <br />
          <small>Type: {type}, Provider: {providerName}</small>
        </div>
      </ModalWrapper>
    );
  }

  const isWhatsApp = config.type === 'whatsapp';
  const checkboxId = `${normalize(providerName)}-active`;
  const buttonColor = isWhatsApp ? 'bg-green-600' : 'bg-blue-600';
  const checkboxColor = isWhatsApp ? 'accent-green-600' : 'accent-blue-600';

  return (
    <ModalWrapper title={config.title} onClose={onClose}>
      <div className="space-y-3">
        {config.fields.map(field => (
          <input
            key={field.key}
            type={field.type}
            placeholder={field.placeholder}
            className="w-full p-2 border rounded"
            value={formData[field.key]}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
          />
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2">
        <input
          type="checkbox"
          id={checkboxId}
          className={`w-4 h-4 ${checkboxColor}`}
          checked={formData.status === 1}
          onChange={(e) => handleInputChange('status', e.target.checked ? 1 : 0)}
        />
        <label htmlFor={checkboxId} className="text-sm text-gray-700">Mark Active</label>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
        <button onClick={handleSaveClick} className={`${buttonColor} text-white px-4 py-2 rounded`}>
          {hasExistingData ? 'Update' : 'Save'}
        </button>
      </div>
    </ModalWrapper>
  );
};

export default UnifiedIntegrationModal;