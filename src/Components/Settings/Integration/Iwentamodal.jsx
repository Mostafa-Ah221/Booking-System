import { useState, useEffect } from 'react';
import { FaAngleLeft } from 'react-icons/fa6';
import axios from 'axios';
import axiosInstance from '../../pages/axiosInstance';

const IWNTA_BASE_URL = 'https://iwnta.com/api/v1';

const ModalWrapper = ({ title, children, onClose, wide = false }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
    <div className={`bg-white rounded-xl shadow-lg relative w-full flex flex-col ${wide ? 'max-w-2xl' : 'max-w-md'} max-h-[90vh]`}>
      {/* Header ثابت */}
      <div className="flex items-center justify-between p-6 border-b shrink-0">
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
      </div>
      {/* Content قابل للسكرول */}
      <div className="p-6 overflow-y-auto">{children}</div>
    </div>
  </div>
);

const LoadingSpinner = ({ text = 'Loading...' }) => (
  <div className="flex justify-center items-center py-10">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mr-3" />
    <span className="text-gray-500">{text}</span>
  </div>
);

const QualityBadge = ({ rating }) => {
  const colors = {
    GREEN:   'bg-green-100 text-green-700 border border-green-300',
    YELLOW:  'bg-yellow-100 text-yellow-700 border border-yellow-300',
    RED:     'bg-red-100 text-red-700 border border-red-300',
    UNKNOWN: 'bg-gray-100 text-gray-600 border border-gray-300',
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors[rating] || colors.UNKNOWN}`}>
      {rating}
    </span>
  );
};

const TypeBadge = ({ type }) => (
  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
    type === 'own'
      ? 'bg-blue-100 text-blue-700 border border-blue-300'
      : 'bg-purple-100 text-purple-700 border border-purple-300'
  }`}>
    {type === 'own' ? 'Own' : 'Shared'}
  </span>
);

const SelectableCard = ({ selected, onClick, children }) => (
  <div
    onClick={onClick}
    className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
      selected ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
    }`}
  >
    {children}
  </div>
);

const fetchPhoneAndTemplates = async (accessToken) => {
  const headers = {
    Authorization:  `Bearer ${accessToken}`,
    'Accept':        'application/json',
    'Content-Type':  'application/json',
  };

  const [phoneRes, templatesRes] = await Promise.all([
    axios.get(`${IWNTA_BASE_URL}/phone-numbers`, { headers }),
    axios.get(`${IWNTA_BASE_URL}/templates`,     { headers }),
  ]);

  const phoneOk     = phoneRes.data?.status     === 'success' || phoneRes.data?.status     === true;
  const templatesOk = templatesRes.data?.status === 'success' || templatesRes.data?.status === true;

  const phone_numbers = phoneOk ? (phoneRes.data?.data || []) : [];

  const rawTemplates = templatesOk ? (templatesRes.data?.data || []) : [];
  const templates = rawTemplates.map((t) => {
  const bodyComponent   = t.components?.find((c) => c.type === 'BODY');
  const headerComponent = t.components?.find((c) => c.type === 'HEADER'); // ← أضف دا
  const bodyText        = bodyComponent?.text || '';
  const headerText      = headerComponent?.text || '';                    // ← أضف دا
  const variablesCount  = (bodyText.match(/\{\{\d+\}\}/g) || []).length;
  return {
    id:              t.id,
    name:            t.name,
    language:        t.language,
    category:        t.category,
    type:            t.type,
    body:            bodyText,
    header:          headerText, // ← دلوقتي بيتعرّف صح
    variables_count: variablesCount,
    components:      t.components,
  };
});

  return { phone_numbers, templates };
};

// ─────────────────────────────────────────────
//  Step 1 — Credentials (unchanged)
// ─────────────────────────────────────────────
const Step1Credentials = ({ integrationId, onSuccess, onClose, getWhatsAppSettings, onSaveCredentials }) => {
  const [formData, setFormData]                   = useState({ client_id: '', client_secret: '' });
  const [isLoading, setIsLoading]                 = useState(false);
  const [isLoadingExisting, setIsLoadingExisting] = useState(false);
  const [error, setError]                         = useState('');

  useEffect(() => {
    const loadExisting = async () => {
      if (!integrationId) return;
      setIsLoadingExisting(true);
      try {
        const result = await getWhatsAppSettings(integrationId);
        if (result?.status && result?.data?.data) {
          setFormData({
            client_id:     result.data.data.client_id     || '',
            client_secret: result.data.data.client_secret || '',
          });
        }
      } catch (_) {}
      finally { setIsLoadingExisting(false); }
    };
    loadExisting();
  }, [integrationId, getWhatsAppSettings]);

 const handleConnect = async () => {
  if (!formData.client_id || !formData.client_secret) {
    setError('Please fill in both Client ID and Client Secret.');
    return;
  }
  setError('');
  setIsLoading(true);
  try {
    const authRes = await axios.post(`${IWNTA_BASE_URL}/auth/token`, {
      client_id:     formData.client_id,
      client_secret: formData.client_secret,
    });

    console.log('✅ Auth Response:', authRes.data);

    const freshToken = authRes.data?.access_token || authRes.data?.data?.access_token || null;

    console.log('✅ Fresh Token:', freshToken);

    if (!freshToken) { setError('Authentication failed. Please check your credentials.'); return; }

    console.log('✅ Saving credentials...');
    await onSaveCredentials({
      integration_id: integrationId,
      status: 1,
      data: {
        client_id:     formData.client_id,
        client_secret: formData.client_secret,
        access_token:  freshToken,
      },
    });
    console.log('✅ Credentials saved!');

    const { phone_numbers, templates } = await fetchPhoneAndTemplates(freshToken);
    console.log('✅ phone_numbers:', phone_numbers, 'templates:', templates);

    onSuccess({ phone_numbers, templates, access_token: freshToken });

  } catch (err) {
    console.error('❌ Error:', err);
    const msg = err?.response?.data?.message || err?.response?.data?.error || 'An unexpected error occurred.';
    setError(msg);
  } finally {
    setIsLoading(false);
  }
};

  if (isLoadingExisting) return <LoadingSpinner text="Loading existing settings..." />;

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Enter your <span className="font-semibold text-gray-700">IWNTA</span> API credentials
        to connect and load your phone numbers and templates.
      </p>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Client ID</label>
        <input
          type="text"
          placeholder="Your IWNTA Client ID"
          className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          value={formData.client_id}
          onChange={(e) => setFormData((p) => ({ ...p, client_id: e.target.value }))}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Client Secret</label>
        <input
          type="password"
          placeholder="Your IWNTA Client Secret"
          className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          value={formData.client_secret}
          onChange={(e) => setFormData((p) => ({ ...p, client_secret: e.target.value }))}
        />
      </div>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3">{error}</div>
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
          {isLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />}
          {isLoading ? 'Connecting...' : 'Connect'}
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
//  Step 2 — Selection
// ─────────────────────────────────────────────

// ✅ التعديل الوحيد — الـ trigger keys الجديدة
const STATUSES = [
  { key: 'appointment_created',     label: 'Appointment Created',     color: 'bg-green-100 text-green-700'   },
  { key: 'appointment_cancelled',   label: 'Appointment Cancelled',   color: 'bg-red-100 text-red-700'       },
  { key: 'appointment_rescheduled', label: 'Appointment Rescheduled', color: 'bg-yellow-100 text-yellow-700' },
  { key: 'appointment_reminder',    label: 'Appointment Reminder',    color: 'bg-blue-100 text-blue-700'     },
];

const Step2Selection = ({ integrationId, phoneNumbers, templates, onSave, onBack, onClose, savedSettings }) => {
  // ✅ لو فيه savedSettings، عبّي بيها الـ state من أول
  const [selectedPhoneId, setSelectedPhoneId] = useState(
    savedSettings?._phone_number_id || ''
  );

  const [statusTemplates, setStatusTemplates] = useState({
    appointment_created:     savedSettings?.appointment_created     || '',
    appointment_cancelled:   savedSettings?.appointment_cancelled   || '',
    appointment_rescheduled: savedSettings?.appointment_rescheduled || '',
    appointment_reminder:    savedSettings?.appointment_reminder    || '',
  });

  const [filters, setFilters]   = useState({ category: '', language: '', type: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError]       = useState('');

  const categories = [...new Set(templates.map((t) => t.category))];
  const languages  = [...new Set(templates.map((t) => t.language))];
  const types      = [...new Set(templates.map((t) => t.type))];

  const filteredTemplates = templates.filter((t) => {
    if (filters.category && t.category !== filters.category) return false;
    if (filters.language && t.language !== filters.language) return false;
    if (filters.type     && t.type     !== filters.type)     return false;
    return true;
  });

  const hasActiveFilters = filters.category || filters.language || filters.type;

  // ✅ نفس handleSave القديم — بس الـ keys اتغيرت
  const handleSave = async () => {
    if (!selectedPhoneId) { setError('Please select a phone number.'); return; }
    if (!STATUSES.every((s) => statusTemplates[s.key])) {
      setError('Please select a template for every status.');
      return;
    }
    setError('');
    setIsSaving(true);
    try {
      await onSave({
        integration_id: integrationId,
        status: 1,
        data: {
          phone_number_id:  String(selectedPhoneId),
          status_templates: {
            appointment_created:     String(statusTemplates.appointment_created),
            appointment_cancelled:   String(statusTemplates.appointment_cancelled),
            appointment_rescheduled: String(statusTemplates.appointment_rescheduled),
            appointment_reminder:    String(statusTemplates.appointment_reminder),
          },
          templates: templates,
        },
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-5">

      {/* ── Phone Numbers ── */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">
          📱 Select Phone Number <span className="text-red-500">*</span>
        </h3>
        {phoneNumbers.length === 0 ? (
          <div className="text-sm text-gray-400 border border-dashed border-gray-300 rounded-lg p-4 text-center">
            No phone numbers found
          </div>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {phoneNumbers.map((phone) => (
              <SelectableCard
                key={phone.id}
                selected={selectedPhoneId === phone.id}
                onClick={() => setSelectedPhoneId(phone.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{phone.phone_number}</p>
                    {phone.display_name && <p className="text-xs text-gray-500">{phone.display_name}</p>}
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
        )}
      </div>

      {/* ── Status-based Templates ── */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">
          Status-based Templates <span className="text-red-500">*</span>
        </h3>

        {/* Filter Bar */}
        <div className="flex gap-2 mb-3 flex-wrap items-center p-2.5 bg-gray-50 border border-gray-200 rounded-lg">
          {[
            { key: 'category', label: 'All Categories', options: categories },
            { key: 'language', label: 'All Languages',  options: languages  },
            { key: 'type',     label: 'All Types',      options: types      },
          ].map(({ key, label, options }) => (
            <select
              key={key}
              className="text-xs border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
              value={filters[key]}
              onChange={(e) => setFilters((p) => ({ ...p, [key]: e.target.value }))}
            >
              <option value="">{label}</option>
              {options.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          ))}
          {hasActiveFilters && (
            <button
              onClick={() => setFilters({ category: '', language: '', type: '' })}
              className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1.5 border border-gray-200 rounded-lg bg-white"
            >
              Reset
            </button>
          )}
          <span className="text-xs text-gray-400 ml-auto">
            {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Trigger → Template rows */}
        <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
          {STATUSES.map(({ key, label, color }) => (
            <div key={key} className="p-3">
              <div className="flex items-center gap-3">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 text-center ${color}`}
                  style={{ minWidth: '155px' }}>
                  {label}
                </span>
                <div className="flex-1 relative">
                  <select
                    className={`w-full text-sm rounded-lg p-2 pr-8 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white appearance-none transition-colors ${
                      statusTemplates[key]
                        ? 'border-2 border-green-500 text-gray-800'
                        : 'border border-gray-300 text-gray-500'
                    }`}
                    value={statusTemplates[key]}
                    onChange={(e) => setStatusTemplates((p) => ({ ...p, [key]: e.target.value }))}
                  >
                    <option value="">Choose Template</option>
                    {filteredTemplates.map((t) => (
                     <option key={t.id} value={t.id}>
                        {t.header || t.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </div>
                </div>
                {statusTemplates[key] && (
                  <button
                    onClick={() => setStatusTemplates((p) => ({ ...p, [key]: '' }))}
                    className="text-gray-300 hover:text-gray-500 shrink-0 transition-colors"
                    title="Clear"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3">{error}</div>
      )}

      <div className="flex justify-between pt-2">
        <button onClick={onBack} className="px-4 py-2 border flex items-center gap-1 border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 text-sm">
          <FaAngleLeft /> Back
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
            {isSaving && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />}
            {isSaving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
//  MAIN IwentaModal (unchanged)
// ─────────────────────────────────────────────
const IwentaModal = ({ integrationId, onClose, onSaveCredentials, onSaveSelection, getWhatsAppSettings, onAutoLoad }) => {
  const [step, setStep]                 = useState(1);
  const [iwentaData, setIwentaData]     = useState(null);
  const [isAutoLoading, setIsAutoLoading] = useState(true);

  useEffect(() => {
    const tryAutoLoad = async () => {
      if (!integrationId) { setIsAutoLoading(false); return; }
      try {
        const result       = await getWhatsAppSettings(integrationId);
        const whatsappRec  = result?.data;
        const accessToken  = whatsappRec?.data?.access_token;
        const clientId     = whatsappRec?.data?.client_id;
        const clientSecret = whatsappRec?.data?.client_secret;
        const whatsappId   = whatsappRec?.id;

        if (!accessToken) { setIsAutoLoading(false); return; }

        // ── helper: جيب phone_numbers + templates + savedSettings ──
        const loadData = async (token) => {
          const [{ phone_numbers, templates }, nsRes] = await Promise.all([
            fetchPhoneAndTemplates(token),
            whatsappId
              ? axiosInstance.get(`/whatsapp/notification-settings/${whatsappId}`)
              : Promise.resolve(null),
          ]);

          let savedSettings = null;
          if (nsRes?.data?.status) {
            const arr = nsRes.data?.data?.settings || [];
            savedSettings = arr.reduce((acc, s) => {
              acc[s.trigger] = String(s.template_id);
              return acc;
            }, {});
            savedSettings._phone_number_id = arr[0]?.phone_number_id
              ? String(arr[0].phone_number_id) : '';
          }

          return { phone_numbers, templates, savedSettings };
        };

        // ── جرب الـ token الحالي ──
        try {
          const { phone_numbers, templates, savedSettings } = await loadData(accessToken);
          setIwentaData({ phone_numbers, templates, access_token: accessToken, savedSettings });
          setStep(2);

        } catch (tokenErr) {
          // Token منتهي — جيب token جديد تلقائياً
          if (!clientId || !clientSecret) {
            console.warn('No credentials saved, redirecting to Step 1');
            return;
          }

          try {
            const authRes  = await axios.post(`${IWNTA_BASE_URL}/auth/token`, {
              client_id:     clientId,
              client_secret: clientSecret,
            });

            const freshToken = authRes.data?.access_token || authRes.data?.data?.access_token || null;

            if (!freshToken) {
              console.warn('Token refresh failed, redirecting to Step 1');
              return;
            }

            // احفظ الـ token الجديد في الـ DB
            await onSaveCredentials({
              integration_id: integrationId,
              status: 1,
              data: {
                client_id:     clientId,
                client_secret: clientSecret,
                access_token:  freshToken,
              },
            });

            const { phone_numbers, templates, savedSettings } = await loadData(freshToken);
            setIwentaData({ phone_numbers, templates, access_token: freshToken, savedSettings });
            setStep(2);

          } catch (refreshErr) {
            console.warn('Token refresh error, redirecting to Step 1', refreshErr);
          }
        }

      } catch (_) {}
      finally { setIsAutoLoading(false); }
    };

    tryAutoLoad();
  }, [integrationId]);

  const handleCredentialsSuccess = (data) => {
    setIwentaData(data);
    setStep(2);
  };

  const handleSaveSelection = async (payload) => {
    await onSaveSelection(payload);
    onClose();
  };

  if (isAutoLoading) {
    return (
      <ModalWrapper title="Connect IWNTA WhatsApp" onClose={onClose}>
        <LoadingSpinner text="Checking existing connection..." />
      </ModalWrapper>
    );
  }

  return (
    <ModalWrapper
      title={step === 1 ? 'Connect IWNTA WhatsApp' : 'Configure IWNTA WhatsApp'}
      onClose={onClose}
      wide={step === 2}
    >
      <div className="flex items-center gap-2 mb-5">
        <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
          step >= 1 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'
        }`}>1</div>
        <div className={`flex-1 h-0.5 ${step >= 2 ? 'bg-green-600' : 'bg-gray-200'}`} />
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
          savedSettings={iwentaData.savedSettings || null}
        />
      )}
    </ModalWrapper>
  );
};

export default IwentaModal;