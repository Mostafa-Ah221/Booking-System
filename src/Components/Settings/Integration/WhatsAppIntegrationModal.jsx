import { useState, useEffect } from 'react';

// Modal Wrapper Component
const ModalWrapper = ({ title, children, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg relative">
        <h2 className="text-lg font-bold mb-4">{title}</h2>
        <button onClick={onClose} className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl">×</button>
        {children}
      </div>
    </div>
  );
};

// Loading Component
const LoadingComponent = ({ onClose }) => {
  return (
    <ModalWrapper title="Loading..." onClose={onClose}>
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <div className="ml-3 text-gray-500">Loading WhatsApp integration data...</div>
      </div>
    </ModalWrapper>
  );
};

// Provider configurations
const PROVIDER_CONFIGS = {
  'WhatsApp Business': {
    title: 'WhatsApp Business API Configuration',
    fields: [
      { key: 'phone_number_id', placeholder: 'Phone Number ID', type: 'text' },
      { key: 'access_token', placeholder: 'Access Token', type: 'password' },
      { key: 'business_account_id', placeholder: 'Business Account ID', type: 'text' },
      { key: 'webhook_verify_token', placeholder: 'Webhook Verify Token', type: 'text' }
    ]
  },
  'WhatsApp Business API': {
    title: 'WhatsApp Business API Configuration',
    fields: [
      { key: 'phone_number_id', placeholder: 'Phone Number ID', type: 'text' },
      { key: 'access_token', placeholder: 'Access Token', type: 'password' },
      { key: 'business_account_id', placeholder: 'Business Account ID', type: 'text' },
      { key: 'webhook_verify_token', placeholder: 'Webhook Verify Token', type: 'text' }
    ]
  },
  'Twilio WhatsApp': {
    title: 'Twilio WhatsApp Configuration',
    fields: [
      { key: 'account_sid', placeholder: 'Account SID', type: 'text' },
      { key: 'auth_token', placeholder: 'Auth Token', type: 'password' },
      { key: 'from', placeholder: 'From', type: 'text' },
      { key: 'content_sid', placeholder: 'Content SID', type: 'text' }
    ]
  },
  '360Dialog': {
    title: '360Dialog Configuration',
    fields: [
      { key: 'api_key', placeholder: 'API Key', type: 'password' },
      { key: 'client_id', placeholder: 'Client ID', type: 'text' },
      { key: 'namespace', placeholder: 'Namespace', type: 'text' }
    ]
  },
  'ChatAPI': {
    title: 'ChatAPI Configuration',
    fields: [
      { key: 'instance_id', placeholder: 'Instance ID', type: 'text' },
      { key: 'token', placeholder: 'Token', type: 'password' }
    ]
  },
  'Green API': {
    title: 'Green API Configuration',
    fields: [
      { key: 'instance_id', placeholder: 'Instance ID', type: 'text' },
      { key: 'token', placeholder: 'Token', type: 'password' },
      { key: 'url', placeholder: 'URL', type: 'url' }
    ]
  }
};

// Generic WhatsApp Integration Modal Component
const GenericWhatsAppModal = ({ provider, onClose, onSave, integrationId, getWhatsAppSettings }) => {
  const config = PROVIDER_CONFIGS[provider];
  
  // Initialize form data based on provider fields
  const initializeFormData = () => {
    const initialData = { status: 1 };
    config.fields.forEach(field => {
      initialData[field.key] = '';
    });
    return initialData;
  };

  const [formData, setFormData] = useState(initializeFormData());
  const [isLoading, setIsLoading] = useState(false);
  const [hasExistingData, setHasExistingData] = useState(false);

  useEffect(() => {
    const loadExistingData = async () => {
      if (integrationId) {
        setIsLoading(true);
        try {
          const result = await getWhatsAppSettings(integrationId);
          
          if (result.status && result.data) {
            const newFormData = {
              status: result.data.status !== undefined ? parseInt(result.data.status) : 1
            };
            
            // Map existing data to form fields
            config.fields.forEach(field => {
              newFormData[field.key] = result.data.data[field.key] || '';
            });
            
            setFormData(newFormData);
            setHasExistingData(true);
          }
        } catch (error) {
          console.error(`Error loading ${provider} settings:`, error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadExistingData();
  }, [integrationId, getWhatsAppSettings, provider, config.fields]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    const data = {};
    config.fields.forEach(field => {
      data[field.key] = formData[field.key];
    });

    const payload = {
      integration_id: integrationId,
      status: formData.status,
      data
    };
    onSave(payload);
  };

  if (isLoading) {
    return <LoadingComponent onClose={onClose} />;
  }

  if (!config) {
    return (
      <ModalWrapper title="Error" onClose={onClose}>
        <div className="text-red-500 text-center py-4">
          Unknown provider: {provider}
        </div>
      </ModalWrapper>
    );
  }

  const checkboxId = `${provider.toLowerCase().replace(/\s+/g, '-')}-active`;

  return (
    <ModalWrapper title={config.title} onClose={onClose}>
      <div className="space-y-3">
        {config.fields.map((field) => (
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
          className="w-4 h-4 text-green-600 accent-green-600"
          checked={formData.status === 1}
          onChange={(e) => handleInputChange('status', e.target.checked ? 1 : 0)}
        />
        <label htmlFor={checkboxId} className="text-sm text-gray-700">
          Mark Active
        </label>
      </div>
      
      <div className="mt-6 flex justify-end gap-3">
        <button onClick={onClose} className="px-4 py-2 border rounded">
          Cancel
        </button>
        <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded">
          {hasExistingData ? 'Update' : 'Save'}
        </button>
      </div>
    </ModalWrapper>
  );
};

// Main WhatsApp Integration Modal Selector
const WhatsAppIntegrationModal = ({ activeModal, integrationId, onClose, onSave, getWhatsAppSettings }) => {
  if (!activeModal || !PROVIDER_CONFIGS[activeModal]) {
    return null;
  }

  return (
    <GenericWhatsAppModal
      provider={activeModal}
      onClose={onClose}
      onSave={onSave}
      integrationId={integrationId}
      getWhatsAppSettings={getWhatsAppSettings}
    />
  );
};

export default WhatsAppIntegrationModal;