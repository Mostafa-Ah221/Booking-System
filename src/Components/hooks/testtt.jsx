import { useEffect, useState } from "react";

const useResponsiveSelectStyles = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return {
    container: (base) => ({
      ...base,
      width: '100%',
      position: 'relative',
    }),
    control: (base) => ({
      ...base,
      border: 'none',
      boxShadow: 'none',
      width: '100%',
      minHeight: windowSize.width < 480 ? '36px' : '40px',
      fontSize: windowSize.width < 640 ? '14px' : '16px',
      backgroundColor: 'white',
      '&:hover': {
        border: 'none',
      },
    }),
    menu: (base, state) => {
      const { width: screenWidth } = windowSize;
      let menuWidth;
      
      if (screenWidth < 480) { // xs screens
        menuWidth = screenWidth - 24; // padding 12px each side
      } else if (screenWidth < 640) { // sm screens
        menuWidth = Math.min(screenWidth - 32, 300);
      } else if (screenWidth < 1024) { // md screens
        menuWidth = Math.min(screenWidth * 0.7, 400);
      } else { // lg+ screens
        // الحصول على عرض الـ container الفعلي
        const selectElement = state.selectProps.selectRef?.controlRef;
        const containerWidth = selectElement?.offsetWidth || 320;
        menuWidth = Math.max(containerWidth, 320);
      }

      return {
        ...base,
        width: `${menuWidth}px`,
        minWidth: `${Math.min(menuWidth, 250)}px`,
        maxWidth: '95vw',
        // تصحيح positioning للشاشات الصغيرة
        left: screenWidth < 640 ? '50%' : 'auto',
        transform: screenWidth < 640 ? 'translateX(-50%)' : 'none',
        right: screenWidth >= 640 ? '0' : 'auto',
        zIndex: 9999,
        fontSize: screenWidth < 640 ? '14px' : '16px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        border: '1px solid #e5e7eb',
        borderRadius: '6px',
        marginTop: '4px',
      };
    },
    menuList: (base) => ({
      ...base,
      width: '100%',
      maxHeight: windowSize.height < 600 ? '120px' : windowSize.height < 800 ? '160px' : '200px',
      fontSize: 'inherit',
      padding: '4px',
      '::-webkit-scrollbar': {
        width: '6px',
      },
      '::-webkit-scrollbar-track': {
        background: '#f1f1f1',
        borderRadius: '3px',
      },
      '::-webkit-scrollbar-thumb': {
        background: '#c1c1c1',
        borderRadius: '3px',
      },
      '::-webkit-scrollbar-thumb:hover': {
        background: '#a8a8a8',
      },
    }),
    option: (base, state) => ({
      ...base,
      width: '100%',
      padding: windowSize.width < 640 ? '8px 12px' : '10px 12px',
      fontSize: 'inherit',
      wordBreak: 'break-word',
      whiteSpace: windowSize.width < 640 ? 'normal' : 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      borderRadius: '4px',
      margin: '2px 0',
      cursor: 'pointer',
      backgroundColor: state.isFocused ? '#f3f4f6' : 'transparent',
      color: state.isSelected ? '#1f2937' : '#374151',
      '&:hover': {
        backgroundColor: '#f3f4f6',
      },
    }),
    singleValue: (base) => ({
      ...base,
      fontSize: 'inherit',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      maxWidth: 'calc(100% - 20px)', // مساحة للسهم
      color: '#1f2937',
    }),
    placeholder: (base) => ({
      ...base,
      fontSize: 'inherit',
      color: '#9ca3af',
    }),
    input: (base) => ({
      ...base,
      fontSize: 'inherit',
      color: '#1f2937',
    }),
    indicatorSeparator: () => ({
      display: 'none', // إخفاء الخط الفاصل
    }),
    dropdownIndicator: (base, state) => ({
      ...base,
      color: '#6b7280',
      padding: '8px',
      transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: 'transform 0.2s ease',
      '&:hover': {
        color: '#374151',
      },
    }),
  };
};

export default useResponsiveSelectStyles;