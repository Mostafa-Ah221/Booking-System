const ClassicLayout = ({ themeData }) => {
  const { color, pageProperties } = themeData;

  const isGradient = color?.includes('-') || false;
  const [accentColor, bgColor] = isGradient
    ? color.split('-')
    : [color || '#F6CB45', color || '#F6CB45'];

  const textColor = themeData.textColor || '#FFFFFF';

  const hexRgba = (hex, opacity) => {
    const clean = (hex || '#F6CB45').replace('#', '');
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const accent = (op) => hexRgba(bgColor, op);
  const bg = accentColor;

  const iconWrapStyle = {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: bgColor,       // ✅ bgColor مش accentColor
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  };

  const iconWrapMuted = {
    ...iconWrapStyle,
    backgroundColor: accent(0.18),
  };

  const CheckBadge = () => (
    <div
      style={{
        width: 20,
        height: 20,
        borderRadius: '50%',
        backgroundColor: bgColor,   // ✅ bgColor مش accentColor
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        marginLeft: 8,
      }}
    >
      <svg width="11" height="11" fill="none" stroke={accentColor} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
      </svg>
    </div>
  );

  const cardStyle = {
    border: `1px solid ${accent(0.25)}`,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    backgroundColor: accent(0.06),
  };

  const cardStyleActive = {
    ...cardStyle,
    border: `1px solid ${accent(0.55)}`,
    backgroundColor: accent(0.09),
  };

  const cardHead = {
    display: 'flex',
    alignItems: 'center',
    padding: '14px 16px',
    gap: 12,
  };

  const labelStyle = {
    fontSize: 11,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: hexRgba(textColor, 0.5),
    margin: '0 0 2px',
  };

  const valueStyle = {
    fontSize: 14,
    fontWeight: 600,
    color: textColor,
    margin: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: 500,
  };

  const chevronDown = (
    <svg width="16" height="16" fill="none" stroke={hexRgba(textColor, 0.45)} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
    </svg>
  );

  const chevronUp = (
    <svg width="16" height="16" fill="none" stroke={hexRgba(textColor, 0.45)} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
    </svg>
  );

  return (
    <div style={{ background: bg, minHeight: '100vh', fontFamily: 'sans-serif', paddingBottom: 40 }}>

      {/* Header */}
      <div
        style={{
          background: bg,
          padding: '20px 24px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${accent(0.08)}`,
        }}
      >
        {pageProperties?.show_nickname && pageProperties?.nickname && (
          <span style={{ color: textColor, fontSize: 15, fontWeight: 600, opacity: 0.85 }}>
            {pageProperties.nickname}
          </span>
        )}
        {pageProperties?.show_photo && pageProperties?.photo && (
          <img src={pageProperties.photo} alt="logo" style={{ height: 36, width: 36, borderRadius: 8, objectFit: 'cover' }} />
        )}
      </div>

      {/* Title Area */}
      {(pageProperties?.show_page_title || pageProperties?.show_page_description) && (
        <div style={{ textAlign: 'center', padding: '24px 16px 8px' }}>
          {pageProperties?.show_page_title && pageProperties?.page_title && (
            <h1 style={{ color: bgColor, fontSize: 26, fontWeight: 700, margin: '0 0 6px' }}>
              {pageProperties.page_title}
            </h1>
          )}
          {pageProperties?.show_page_description && pageProperties?.page_description && (
            <p style={{ color: hexRgba(textColor, 0.7), fontSize: 13, maxWidth: 480, margin: '0 auto', lineHeight: 1.5 }}>
              {pageProperties.page_description}
            </p>
          )}
        </div>
      )}

      {/* Body */}
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '16px' }}>

        {/* Interview Card */}
        <div style={cardStyle}>
          <div style={cardHead}>
            <div style={iconWrapStyle}>
              <svg width="18" height="18" fill="none" stroke={accentColor} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={labelStyle}>Interview</p>
              <p style={valueStyle}>Recruitment Strategy Meeting | 30 mins</p>
            </div>
            <CheckBadge />
            <div style={{ marginLeft: 8 }}>{chevronDown}</div>
          </div>
        </div>

        {/* Date, Time & Recruiter Card */}
        <div style={cardStyleActive}>
          <div style={cardHead}>
            <div style={iconWrapStyle}>
              <svg width="18" height="18" fill="none" stroke={accentColor} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={labelStyle}>Date, Time &amp; Recruiter</p>
              <p style={valueStyle}>30 Apr 2026 | 09:00 am</p>
            </div>
            <CheckBadge />
            <div style={{ marginLeft: 8 }}>{chevronUp}</div>
          </div>

          <div style={{ borderTop: `1px solid ${accent(0.15)}`, padding: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

              {/* Calendar */}
              <div>
                <select
                  style={{
                    width: '100%',
                    background: accent(0.12),
                    border: `1px solid ${accent(0.35)}`,
                    borderRadius: 8,
                    color: textColor,
                    padding: '8px 12px',
                    fontSize: 13,
                    appearance: 'none',
                    outline: 'none',
                    marginBottom: 16,
                    cursor: 'pointer',
                  }}
                >
                  <option>(GMT+3:00) Cairo</option>
                </select>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <button style={{ background: accent(0.12), border: 'none', borderRadius: 8, width: 30, height: 30, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="16" height="16" fill="none" stroke={textColor} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <span style={{ fontSize: 14, fontWeight: 600, color: textColor }}>April 2026</span>
                  <button style={{ background: accent(0.12), border: 'none', borderRadius: 8, width: 30, height: 30, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="16" height="16" fill="none" stroke={textColor} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', marginBottom: 4 }}>
                  {['SUN','MON','TUE','WED','THU','FRI','SAT'].map(d => (
                    <div key={d} style={{ fontSize: 10, fontWeight: 600, color: hexRgba(textColor, 0.38), padding: '4px 0' }}>{d}</div>
                  ))}
                </div>

                {(() => {
                  const days = [
                    null, null,
                    { d: 1, avail: false }, { d: 2, avail: false }, { d: 3, avail: false }, { d: 4, avail: false }, { d: 5, avail: false },
                    { d: 6, avail: true },  { d: 7, avail: true },  { d: 8, avail: false }, { d: 9, avail: false }, { d: 10, avail: false }, { d: 11, avail: false }, { d: 12, avail: false },
                    { d: 13, avail: true }, { d: 14, avail: true }, { d: 15, avail: false }, { d: 16, avail: false }, { d: 17, avail: false }, { d: 18, avail: false }, { d: 19, avail: false },
                    { d: 20, avail: true }, { d: 21, avail: true }, { d: 22, avail: false }, { d: 23, avail: false }, { d: 24, avail: false }, { d: 25, avail: false }, { d: 26, avail: false },
                    { d: 27, avail: true }, { d: 28, avail: true }, { d: 29, avail: true, today: true, selected: true }, { d: 30, avail: true }, null, null, null,
                  ];
                  return (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
                      {days.map((item, i) => {
                        if (!item) return <div key={i} style={{ height: 34 }} />;
                        const isSelected = item.selected;
                        const isToday = item.today;
                        return (
                          <div key={i} style={{
                            height: 34,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 13,
                            fontWeight: isSelected ? 700 : 500,
                            borderRadius: 8,
                            cursor: item.avail ? 'pointer' : 'not-allowed',
                            opacity: !item.avail ? 0.22 : 1,
                            backgroundColor: isSelected ? bgColor : 'transparent',  // ✅ bgColor
                            color: isSelected ? accentColor : textColor,             // ✅ accentColor للنص
                            border: isToday && !isSelected
                              ? `1.5px solid ${bgColor}`                             // ✅ bgColor
                              : '1.5px solid transparent',
                          }}>
                            {item.d}
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>

              {/* Time Slots */}
              <div>
                <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: hexRgba(textColor, 0.45), marginBottom: 10 }}>
                  Slot Availability
                </p>
                <p style={{ fontSize: 12, fontWeight: 600, color: hexRgba(textColor, 0.6), margin: '12px 0 8px' }}>Morning</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
                  {['09:00 am', '09:30 am', '10:00 am', '10:30 am', '11:00 am', '11:30 am', '12:00 pm'].map((time, idx) => (
                    <button key={time} style={{
                      padding: '8px 4px',
                      fontSize: 12,
                      fontWeight: idx === 0 ? 700 : 500,
                      borderRadius: 8,
                      border: `1.5px solid ${idx === 0 ? bgColor : accent(0.4)}`,   // ✅ bgColor
                      background: idx === 0 ? bgColor : 'transparent',               // ✅ bgColor
                      color: idx === 0 ? accentColor : textColor,                    // ✅ accentColor للنص
                      cursor: 'pointer',
                    }}>
                      {time}
                    </button>
                  ))}
                </div>
                <p style={{ fontSize: 12, fontWeight: 600, color: hexRgba(textColor, 0.6), margin: '14px 0 8px' }}>Afternoon</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
                  {['12:30 pm', '01:00 pm', '01:30 pm'].map((time) => (
                    <button key={time} style={{
                      padding: '8px 4px',
                      fontSize: 12,
                      fontWeight: 500,
                      borderRadius: 8,
                      border: `1.5px solid ${accent(0.4)}`,
                      background: 'transparent',
                      color: textColor,
                      cursor: 'pointer',
                    }}>
                      {time}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Your Info Card */}
        <div style={cardStyle}>
          <div style={cardHead}>
            <div style={iconWrapMuted}>
              <svg width="18" height="18" fill="none" stroke={bgColor} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={labelStyle}>Step 3</p>
              <p style={{ ...valueStyle, opacity: 0.4 }}>Your Info</p>
            </div>
            <div style={{ marginLeft: 'auto' }}>{chevronDown}</div>
          </div>
        </div>

      </div>

      {/* Footer */}
      {/* <div style={{ textAlign: 'center', paddingTop: 8 }}>
        <span style={{ fontSize: 11, color: hexRgba(textColor, 0.28) }}>Powered by Appoint Roll</span>
      </div> */}
    </div>
  );
};

export default ClassicLayout;