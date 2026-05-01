// NoAppointments.jsx
const NoAppointments = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-100">
      <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
        <rect x="10" y="20" width="50" height="60" rx="2" stroke="#ccc" strokeWidth="3" fill="none"/>
        <rect x="18" y="30" width="12" height="12" rx="1" stroke="#ccc" strokeWidth="2" fill="none"/>
        <rect x="36" y="30" width="12" height="12" rx="1" stroke="#ccc" strokeWidth="2" fill="none"/>
        <rect x="18" y="48" width="12" height="12" rx="1" stroke="#ccc" strokeWidth="2" fill="none"/>
        <rect x="36" y="48" width="12" height="12" rx="1" stroke="#ccc" strokeWidth="2" fill="none"/>
        <rect x="22" y="65" width="16" height="15" rx="1" stroke="#ccc" strokeWidth="2" fill="none"/>
        <rect x="55" y="40" width="30" height="40" rx="2" stroke="#ccc" strokeWidth="3" fill="none"/>
        <rect x="62" y="50" width="8" height="8" rx="1" stroke="#ccc" strokeWidth="2" fill="none"/>
        <circle cx="72" cy="72" r="14" stroke="#e57373" strokeWidth="3" fill="none"/>
        <line x1="62" y1="62" x2="82" y2="82" stroke="#e57373" strokeWidth="3"/>
      </svg>
      <p className="mt-6 text-gray-400 text-sm">
        Sorry, we are not accepting appointments online at the moment.
      </p>
    </div>
  );
};

export default NoAppointments;