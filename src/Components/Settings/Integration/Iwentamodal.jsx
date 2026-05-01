import { useState, useEffect } from 'react';

// ✅ Wrapper modal - أكبر شوية عشان Step 2 فيه داتا
const ModalWrapper = ({ title, children, onClose, wide = false }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
    <div className={`bg-white rounded-xl shadow-lg relative w-full ${wide ? 'max-w-2xl' : 'max-w-md'}`}>
      <div className="flex items-center justify-between p-6 border-b">
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
        >×</button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  </div>
);

// ✅ Loading
const LoadingSpinner = ({ text = 'Loading...' }) => (
  <div className="flex justify-center items-center py-10">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mr-3"></div>
    <span className="text-gray-500">{text}</span>
  </div>
);

// ✅ Badge للـ quality_rating
const QualityBadge = ({ rating }) => {
  const colors = {
    GREEN: 'bg-green-100 text-green-700 border border-green-300',
    YELLOW: 'bg-yellow-100 text-yellow-700 border border-yellow-300',
    RED: 'bg-red-100 text-red-700 border border-red-300',
    UNKNOWN: 'bg-gray-100 text-gray-600 border border-gray-300',
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors[rating] || colors.UNKNOWN}`}>
      {rating}
    </span>
  );
};

// ✅ Badge للـ type (own / shared)
const TypeBadge = ({ type }) => (
  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
    type === 'own'
      ? 'bg-blue-100 text-blue-700 border border-blue-300'
      : 'bg-purple-100 text-purple-700 border border-purple-300'
  }`}>
    {type === 'own' ? 'Own' : 'Shared'}
  </span>
);

// ✅ Card اختيار قابل للضغط
const SelectableCard = ({ selected, onClick, children }) => (
  <div
    onClick={onClick}
    className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
      selected
        ? 'border-green-500 bg-green-50'
        : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
    }`}
  >
    {children}
  </div>
);

// ============================================================
// ✅ STEP 1 — إدخال credentials
// ============================================================
const Step1Credentials = ({ integrationId, onSuccess, onClose, getWhatsAppSettings, onSaveCredentials }) => {
  const [formData, setFormData] = useState({ client_id: '', client_secret: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingExisting, setIsLoadingExisting] = useState(false);
  const [error, setError] = useState('');

  // لو فيه داتا موجودة، حملها
  useEffect(() => {
    const loadExisting = async () => {
      if (!integrationId) return;
      setIsLoadingExisting(true);
      try {
        const result = await getWhatsAppSettings(integrationId);
        if (result?.status && result?.data?.data) {
          setFormData({
            client_id: result.data.data.client_id || '',
            client_secret: result.data.data.client_secret || '',
          });
        }
      } catch (e) {}
      finally { setIsLoadingExisting(false); }
    };
    loadExisting();
  }, [integrationId]);

  const handleConnect = async () => {
    if (!formData.client_id || !formData.client_secret) {
      setError('Please fill in both Client ID and Client Secret.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const result = await onSaveCredentials({
        integration_id: integrationId,
        status: 1,
        data: {
          client_id: formData.client_id,
          client_secret: formData.client_secret,
        },
      });

      if (result?.status && result?.data) {
        // نجاح — روح لـ Step 2
        onSuccess(result.data);
      } else {
        setError(result?.message || 'Connection failed. Please check your credentials.');
      }
    } catch (e) {
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingExisting) return <LoadingSpinner text="Loading existing settings..." />;

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Enter your <span className="font-semibold text-gray-700">IWNTA</span> API credentials to connect and load your phone numbers and templates.
      </p>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Client ID</label>
        <input
          type="text"
          placeholder="Your IWNTA Client ID"
          className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          value={formData.client_id}
          onChange={e => setFormData(prev => ({ ...prev, client_id: e.target.value }))}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Client Secret</label>
        <input
          type="password"
          placeholder="Your IWNTA Client Secret"
          className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          value={formData.client_secret}
          onChange={e => setFormData(prev => ({ ...prev, client_secret: e.target.value }))}
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3">
          {error}
        </div>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
          Cancel
        </button>
        <button
          onClick={handleConnect}
          disabled={isLoading}
          className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-60 flex items-center gap-2"
        >
          {isLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
          {isLoading ? 'Connecting...' : 'Connect'}
        </button>
      </div>
    </div>
  );
};

// ============================================================
// ✅ STEP 2 — اختيار Phone Number + Template
// ============================================================
const Step2Selection = ({ integrationId, phoneNumbers, templates, onSave, onBack, onClose }) => {
  const [selectedPhoneId, setSelectedPhoneId] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!selectedPhoneId) { setError('Please select a phone number.'); return; }
    if (!selectedTemplateId) { setError('Please select a template.'); return; }
    setError('');
    setIsSaving(true);
    try {
      await onSave({
        integration_id: integrationId,
        status: 1,
        data: {
          phone_number_id: String(selectedPhoneId),
          template_id: String(selectedTemplateId),
        },
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-5">

      {/* Phone Numbers */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">
          📱 Select Phone Number <span className="text-red-500">*</span>
        </h3>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {phoneNumbers.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">No phone numbers available.</p>
          ) : phoneNumbers.map(phone => (
            <SelectableCard
              key={phone.id}
              selected={selectedPhoneId === phone.id}
              onClick={() => setSelectedPhoneId(phone.id)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800 text-sm">{phone.phone_number}</p>
                  {phone.display_name && (
                    <p className="text-xs text-gray-500">{phone.display_name}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <QualityBadge rating={phone.quality_rating} />
                  <TypeBadge type={phone.type} />
                  {phone.is_default && (
                    <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">Default</span>
                  )}
                </div>
              </div>
            </SelectableCard>
          ))}
        </div>
      </div>

      {/* Templates */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">
          📄 Select Template <span className="text-red-500">*</span>
        </h3>
        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {templates.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">No templates available.</p>
          ) : templates.map(template => (
            <SelectableCard
              key={template.id}
              selected={selectedTemplateId === template.id}
              onClick={() => setSelectedTemplateId(template.id)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 text-sm truncate">{template.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {template.language} · {template.variables_count} variable{template.variables_count !== 1 ? 's' : ''}
                  </p>
                  {/* عرض الـ body text */}
                  {template.components?.find(c => c.type === 'BODY') && (
                    <p className="text-xs text-gray-400 mt-1 truncate">
                      {template.components.find(c => c.type === 'BODY').text}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    template.category === 'MARKETING'
                      ? 'bg-orange-100 text-orange-700'
                      : template.category === 'UTILITY'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {template.category}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    template.type === 'shared'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-teal-100 text-teal-700'
                  }`}>
                    {template.type}
                  </span>
                </div>
              </div>
            </SelectableCard>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3">
          {error}
        </div>
      )}

      <div className="flex justify-between pt-2">
        <button onClick={onBack} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 text-sm">
          ← Back
        </button>
        <div className="flex gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 text-sm">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-60 flex items-center gap-2 text-sm"
          >
            {isSaving && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
            {isSaving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// ✅ MAIN IwentaModal
// ============================================================
const IwentaModal = ({ integrationId, onClose, onSaveCredentials, onSaveSelection, getWhatsAppSettings }) => {
  const [step, setStep] = useState(1);
  const [iwentaData, setIwentaData] = useState(null); // { phone_numbers, templates }

  const handleCredentialsSuccess = (data) => {
    // data = { whatsapp: {...}, phone_numbers: [...], templates: [...] }
    setIwentaData(data);
    setStep(2);
  };

  const handleSaveSelection = async (payload) => {
    await onSaveSelection(payload);
    onClose();
  };

  return (
    <ModalWrapper
      title={step === 1 ? 'Connect IWNTA WhatsApp' : 'Configure IWNTA WhatsApp'}
      onClose={onClose}
      wide={step === 2}
    >
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-5">
        <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
          step >= 1 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'
        }`}>1</div>
        <div className={`flex-1 h-0.5 ${step >= 2 ? 'bg-green-600' : 'bg-gray-200'}`}></div>
        <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
          step >= 2 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'
        }`}>2</div>
        <div className="text-xs text-gray-400 ml-1">
          {step === 1 ? 'Credentials' : 'Select Number & Template'}
        </div>
      </div>

      {step === 1 && (
        <Step1Credentials
          integrationId={integrationId}
          onSuccess={handleCredentialsSuccess}
          onClose={onClose}
          getWhatsAppSettings={getWhatsAppSettings}
          onSaveCredentials={onSaveCredentials}
        />
      )}

      {step === 2 && iwentaData && (
        <Step2Selection
          integrationId={integrationId}
          phoneNumbers={iwentaData.phone_numbers || []}
          templates={iwentaData.templates || []}
          onSave={handleSaveSelection}
          onBack={() => setStep(1)}
          onClose={onClose}
        />
      )}
    </ModalWrapper>
  );
};

export default IwentaModal;