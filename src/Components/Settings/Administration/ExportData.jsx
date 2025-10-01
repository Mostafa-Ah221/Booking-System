import React, { useEffect, useRef, useState } from 'react';
import { Calendar, ChevronDown, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppointments } from '../../../redux/apiCalls/AppointmentCallApi';
import { getCustomers } from "../../../redux/apiCalls/CustomerCallApi";

export default function ExportData() {
  const [module, setModule] = useState('Appointments');
  const [fileName, setFileName] = useState('Appoint-Roll - ' + new Date().toLocaleDateString());
  const [dateRange, setDateRange] = useState('');
  const [fileFormat, setFileFormat] = useState('CSV');
  const [showCalendar, setShowCalendar] = useState(false);
  const [includeCustomColumns, setIncludeCustomColumns] = useState(false);
  const [selectedFields, setSelectedFields] = useState([]);
  const [showFieldsDropdown, setShowFieldsDropdown] = useState(false);
  const [searchField, setSearchField] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); // Current month
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear()); // Current year
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [hoveredDate, setHoveredDate] = useState(null);
  
  const { appointments = [], loading = false, error } = useSelector(state => state.appointments || {});
  const { customers} = useSelector(state => state.customers);

  const dispatch = useDispatch();
  const dateInputRef = useRef();
  const calendarRef = useRef();
  const fieldsDropdownRef = useRef();
  
  // Define available fields for each module
  const appointmentFields = [
    { key: 'id', label: 'ID' },
    { key: 'interview_name', label: 'Interview Name' },
    { key: 'name', label: 'Client Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'date', label: 'Date' },
    { key: 'time', label: 'Time' },
    { key: 'status', label: 'Status' },
    { key: 'work_space_name', label: 'Workspace' },
    { key: 'time_zone', label: 'Time Zone' },
    { key: 'share_link', label: 'Share Link' },
    { key: 'created_at', label: 'Created At' },
    { key: 'updated_at', label: 'Updated At' }
  ];

  const customerFields = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'created_at', label: 'Created At' },
    { key: 'updated_at', label: 'Updated At' }
  ];

  const getCurrentFields = () => {
    return module === 'Appointments' ? appointmentFields : customerFields;
  };

  // Helper function to get today's date formatted
  const getTodayFormatted = () => {
    const today = new Date();
    return formatDate(today);
  };

  useEffect(() => {
    dispatch(fetchAppointments());
    dispatch(getCustomers());
  }, [dispatch]);

  useEffect(() => {
    const today = new Date(); // Use actual current date
    setSelectedStartDate(today);
    setSelectedEndDate(today);
    
    // Update date range with today's date
    const todayFormatted = formatDate(today);
    setDateRange(`${todayFormatted} to ${todayFormatted}`);
    
    // Set default selected fields
    if (module === 'Appointments') {
      setSelectedFields(['id', 'interview_name', 'name', 'email', 'phone', 'date', 'time']);
    } else {
      setSelectedFields(['id', 'name', 'email', 'phone', 'created_at', 'updated_at']);
    }
  }, [module]);

useEffect(() => {
  function handleClickOutside(event) {
    // Handle calendar dropdown
    if (calendarRef.current && 
        !calendarRef.current.contains(event.target) && 
        dateInputRef.current &&
        !dateInputRef.current.contains(event.target)) {
      setShowCalendar(false);
    }
    
    // Handle fields dropdown  
    if (fieldsDropdownRef.current && 
        !fieldsDropdownRef.current.contains(event.target)) {
      setShowFieldsDropdown(false);
    }
  }

  document.addEventListener('click', handleClickOutside);
  return () => document.removeEventListener('click', handleClickOutside);
}, []);

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const formatDate = (date) => {
    if (!date) return '';
    const day = date.getDate().toString().padStart(2, '0');
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const isDateInRange = (date) => {
    if (!selectedStartDate || !selectedEndDate) return false;
    return date >= selectedStartDate && date <= selectedEndDate;
  };

  const isDateInHoverRange = (date) => {
    if (!selectedStartDate || !hoveredDate || selectedEndDate) return false;
    const start = selectedStartDate;
    const end = hoveredDate;
    return date >= Math.min(start, end) && date <= Math.max(start, end);
  };

  const handleDateClick = (date) => {
    if (!selectedStartDate || selectedEndDate) {
      setSelectedStartDate(date);
      setSelectedEndDate(null);
    } else {
      const start = selectedStartDate;
      const end = date;
      if (end >= start) {
        setSelectedEndDate(end);
        setDateRange(`${formatDate(start)} to ${formatDate(end)}`);
        setShowCalendar(false);
      } else {
        setSelectedStartDate(date);
        setSelectedEndDate(null);
      }
    }
  };

  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  // Filter data based on date range and selected fields
  const getFilteredData = () => {
    let data = module === 'Appointments' ? appointments : (customers?.clients || []);
    
    if (module === 'Appointments' && selectedStartDate && selectedEndDate) {
      data = data.filter(item => {
        const itemDate = new Date(item.created_at);
        return itemDate >= selectedStartDate && itemDate <= selectedEndDate;
      });
    }

    // Filter by selected fields
    return data.map(item => {
      const filteredItem = {};
      selectedFields.forEach(field => {
        if (item[field] !== undefined) {
          filteredItem[field] = item[field];
        }
      });
      return filteredItem;
    });
  };

  // Export functions
  const exportToCSV = (data) => {
    if (!data.length) return;
    
    const headers = selectedFields.map(field => {
      const fieldObj = getCurrentFields().find(f => f.key === field);
      return fieldObj ? fieldObj.label : field;
    });
    
    // Create CSV content with proper formatting
    const csvRows = [];
    csvRows.push(headers.join(','));
    
    data.forEach(row => {
      const values = selectedFields.map(field => {
        const value = row[field] || '';
        const stringValue = String(value);
        
        // If value contains comma, newline, or quote, wrap in quotes
        if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      });
      csvRows.push(values.join(','));
    });
    
    const csvContent = csvRows.join('\r\n');
    
    // Add UTF-8 BOM for better Excel compatibility
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { 
      type: 'text/csv;charset=utf-8;' 
    });
    
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportToXLSX = (data) => {
    if (!data.length) return;
    
    const headers = selectedFields.map(field => {
      const fieldObj = getCurrentFields().find(f => f.key === field);
      return fieldObj ? fieldObj.label : field;
    });

    // Create a proper Excel XML structure
    let xlsxContent = `<?xml version="1.0"?>
    <Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
              xmlns:o="urn:schemas-microsoft-com:office:office"
              xmlns:x="urn:schemas-microsoft-com:office:excel"
              xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
              xmlns:html="http://www.w3.org/TR/REC-html40">
    <Worksheet ss:Name="Sheet1">
    <Table>`;
    
    // Add header row
    xlsxContent += '<Row>';
    headers.forEach(header => {
      xlsxContent += `<Cell><Data ss:Type="String">${header}</Data></Cell>`;
    });
    xlsxContent += '</Row>';
    
    // Add data rows
    data.forEach(row => {
      xlsxContent += '<Row>';
      selectedFields.forEach(field => {
        const value = row[field] || '';
        const cellValue = String(value).replace(/[<>&'"]/g, (char) => {
          switch (char) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '"': return '&quot;';
            case "'": return '&#39;';
            default: return char;
          }
        });
        
        // Determine data type
        const isNumber = !isNaN(value) && !isNaN(parseFloat(value)) && value !== '';
        const dataType = isNumber ? 'Number' : 'String';
        
        xlsxContent += `<Cell><Data ss:Type="${dataType}">${cellValue}</Data></Cell>`;
      });
      xlsxContent += '</Row>';
    });
    
    xlsxContent += `
    </Table>
    </Worksheet>
    </Workbook>`;

    const blob = new Blob([xlsxContent], { 
      type: 'application/vnd.ms-excel' 
    });
    
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName}.xls`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExport = () => {
    const filteredData = getFilteredData();
    
    if (fileFormat === 'CSV') {
      exportToCSV(filteredData);
    } else {
      exportToXLSX(filteredData);
    }
  };

  const handleFieldToggle = (fieldKey) => {
    setSelectedFields(prev => {
      if (prev.includes(fieldKey)) {
        return prev.filter(f => f !== fieldKey);
      } else {
        return [...prev, fieldKey];
      }
    });
  };

  const handleSelectAll = () => {
    const allFields = getCurrentFields().map(f => f.key);
    setSelectedFields(selectedFields.length === allFields.length ? [] : allFields);
  };

  const filteredFields = getCurrentFields().filter(field =>
    field.label.toLowerCase().includes(searchField.toLowerCase())
  );

  const renderCalendar = (monthOffset = 0) => {
    const month = (currentMonth + monthOffset + 12) % 12;
    const year = currentYear + Math.floor((currentMonth + monthOffset) / 12);
    const daysInMonth = getDaysInMonth(month, year);
    const firstDay = getFirstDayOfMonth(month, year);
    
    const days = [];
    
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8"></div>);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const today = new Date(); // Get actual current date
      const isToday = date.toDateString() === today.toDateString(); // Compare with actual today
      const isStart = selectedStartDate && date.toDateString() === selectedStartDate.toDateString();
      const isEnd = selectedEndDate && date.toDateString() === selectedEndDate.toDateString();
      const inRange = isDateInRange(date);
      const inHoverRange = isDateInHoverRange(date);
      
      days.push(
        <div
          key={day}
          className={`h-8 w-8 flex items-center justify-center text-sm cursor-pointer rounded transition-colors ${
            isStart || isEnd
              ? 'bg-indigo-600 text-white'
              : inRange || inHoverRange
              ? 'bg-indigo-100 text-indigo-700'
              : isToday
              ? 'bg-indigo-600 text-white'
              : 'hover:bg-gray-100'
          }`}
          onClick={() => handleDateClick(date)}
          onMouseEnter={() => setHoveredDate(date)}
          onMouseLeave={() => setHoveredDate(null)}
        >
          {day}
        </div>
      );
    }
    
    return (
      <div className="p-4">
        <div className="text-center font-medium text-gray-800 mb-4">
          {monthNames[month]} {year}
        </div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((dayName) => (
            <div key={dayName} className="h-8 flex items-center justify-center text-xs font-medium text-gray-500">
              {dayName}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days}
        </div>
      </div>
    );
  };

  const handleModuleChange = (selectedModule) => {
    setModule(selectedModule);
    
    const today = new Date();
    const todayFormatted = formatDate(today);
    
    if (selectedModule === 'Appointments') {
      setFileName(`AppointRoll - ${todayFormatted}`);
      setSelectedFields(['id', 'interview_name', 'name', 'email', 'phone', 'date', 'time']);
      setFileFormat('CSV');
    } else if (selectedModule === 'Customers') {
      setFileName('AppointRoll - Customers');
      setSelectedFields(['id', 'name', 'email', 'phone', 'created_at', 'updated_at']);
      setFileFormat('XLSX');
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-4xl">
      <div className="border-l-4 border-indigo-600 pl-4 mb-8">
        <h2 className=" font-medium text-gray-800">Export Data</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="module" className="block text-sm font-medium text-gray-700 mb-1">
            Module <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              id="module"
              className="w-full border border-gray-300 rounded-md py-2 px-3 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              value={module}
              onChange={(e) => handleModuleChange(e.target.value)}
            >
              <option value="Appointments">Appointments</option>
              <option value="Customers">Customers</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </div>
          </div>
        </div>
        
        <div>
          <label htmlFor="fileName" className="block text-sm font-medium text-gray-700 mb-1">
            File Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="fileName"
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {module === 'Appointments' && (
          <div className="relative">
            <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700 mb-1">
              Date Range <span className="text-red-500">*</span>
            </label>
            <div className="relative" ref={dateInputRef}>
              <input
                type="text"
                id="dateRange"
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer text-sm"
                value={dateRange}
                readOnly
                onClick={() => setShowCalendar(!showCalendar)}
              />
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <Calendar className="h-4 w-4 text-gray-500" />
              </div>
            </div>
            
            {showCalendar && (
              <div 
                ref={calendarRef}
                className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                style={{ width: '600px' }}
              >
                <div className="flex">
                  <div className="flex-1 border-r border-gray-200">
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                      <button
                        onClick={() => navigateMonth('prev')}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <div className="font-medium">
                        {monthNames[currentMonth]} {currentYear}
                      </div>
                      <button
                        onClick={() => navigateMonth('next')}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                    {renderCalendar(0)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-center p-4 border-b border-gray-200">
                      <div className="font-medium">
                        {monthNames[(currentMonth + 1) % 12]} {currentYear + Math.floor((currentMonth + 1) / 12)}
                      </div>
                    </div>
                    {renderCalendar(1)}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        <div className={module === 'Customers' ? 'md:col-span-2' : ''}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Export Format
          </label>
          <div className="flex space-x-6 items-center">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="csv"
                name="fileFormat"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                checked={fileFormat === 'CSV'}
                onChange={() => setFileFormat('CSV')}
              />
              <label htmlFor="csv" className="text-gray-700 text-sm">CSV</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="xlsx"
                name="fileFormat"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                checked={fileFormat === 'XLSX'}
                onChange={() => setFileFormat('XLSX')}
              />
              <label htmlFor="xlsx" className="text-gray-700 text-sm">XLSX</label>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label htmlFor="fields" className="block text-sm font-medium text-gray-700 mb-1">
            Fields <span className="text-red-500">*</span>
          </label>
          <div className="relative" ref={fieldsDropdownRef}>
            <div
              className="w-full border border-gray-300 rounded-md py-2 px-3 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white min-h-[40px] flex items-center justify-between"
              onClick={() => setShowFieldsDropdown(!showFieldsDropdown)}
            >
              <span className="text-gray-700 text-sm">
                {selectedFields.length} Fields Selected
              </span>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </div>
            
            {showFieldsDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                <div className="p-3 border-b border-gray-200">
                  <input
                    type="text"
                    placeholder="Search fields"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    value={searchField}
                    onChange={(e) => setSearchField(e.target.value)}
                  />
                </div>
                
                <div className="p-2">
                  <div className="flex items-center px-3 py-2 hover:bg-gray-50">
                    <input
                      type="checkbox"
                      id="selectAll"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      checked={selectedFields.length === getCurrentFields().length}
                      onChange={handleSelectAll}
                    />
                    <label htmlFor="selectAll" className="ml-2 text-sm text-gray-700 font-medium">
                      Select All
                    </label>
                  </div>
                  
                  {filteredFields.map((field) => (
                    <div key={field.key} className="flex items-center px-3 py-2 hover:bg-gray-50">
                      <input
                        type="checkbox"
                        id={field.key}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        checked={selectedFields.includes(field.key)}
                        onChange={() => handleFieldToggle(field.key)}
                      />
                      <label htmlFor={field.key} className="ml-2 text-sm text-gray-700">
                        {field.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
      </div>
      
      <div>
        <button
          type="button"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
          onClick={handleExport}
          disabled={selectedFields.length === 0}
        >
          Export ({getFilteredData().length} records)
        </button>
      </div>
    </div>
  );
}