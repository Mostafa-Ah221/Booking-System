import React, { useEffect, useState } from 'react';
import { X, GripVertical } from 'lucide-react';
import toast from "react-hot-toast";

const ColumnManagerSidebar = ({ isOpen, onClose, onApply, initialColumns }) => {
  // تحميل البيانات من localStorage عند بدء التشغيل
  const getInitialColumns = () => {
    if (initialColumns && Array.isArray(initialColumns)) {
      return initialColumns;
    }

    // محاولة تحميل من localStorage
    try {
      const saved = localStorage.getItem('appointmentColumns');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.columnOrder && Array.isArray(parsed.columnOrder)) {
          return parsed.columnOrder;
        }
      }
    } catch (error) {
      console.error('Error loading saved columns:', error);
    }

    // القيم الافتراضية
    return [
      { name: 'Time', selected: true, id: 'time' },
      { name: 'Interview', selected: true, id: 'interview' },
      { name: 'Workspace', selected: true, id: 'workspace' },
      { name: 'Client', selected: true, id: 'client' },
      { name: 'Phone', selected: true, id: 'phone' },
      { name: 'Status', selected: true, id: 'status' },
      { name: 'Action', selected: true, id: 'action' },
      { name: 'Created at', selected: false, id: 'created' },
      { name: 'Time Zone', selected: false, id: 'timezone' },
      { name: 'Email', selected: false, id: 'email' }
    ];
  };

  const [selectedColumns, setSelectedColumns] = useState(getInitialColumns);
  const [draggedItem, setDraggedItem] = useState(null);

  // تحديث البيانات عند تغيير initialColumns
  useEffect(() => {
    if (initialColumns && Array.isArray(initialColumns) && initialColumns.length > 0) {
      setSelectedColumns(initialColumns);
    }
  }, [initialColumns]);

  // حفظ التغييرات في localStorage فوراً عند التعديل
  const saveToLocalStorage = (columns) => {
    try {
      const saved = localStorage.getItem('appointmentColumns');
      let dataToSave = {
        columnOrder: columns,
        lastUpdated: new Date().toISOString()
      };

      // الاحتفاظ بـ visibleColumns إذا كانت موجودة
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.visibleColumns) {
          dataToSave.visibleColumns = parsed.visibleColumns;
        }
      }

      localStorage.setItem('appointmentColumns', JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  const handleToggleColumn = (columnId) => {
    setSelectedColumns((prev) => {
      const updated = prev.map((col) =>
        col.id === columnId ? { ...col, selected: !col.selected } : col
      );
      
      // حفظ فوري في localStorage
      saveToLocalStorage(updated);
      
      return updated;
    });
  };

  const handleApplyColumns = () => {
    const selectedColumnNames = selectedColumns
      .filter((col) => col.selected)
      .map((col) => col.name);
    
    if (selectedColumnNames.length < 2) {
      toast.error('Please select at least two fields.');
      return;
    }
    
    // حفظ نهائي في localStorage
    try {
      const dataToSave = {
        visibleColumns: selectedColumnNames,
        columnOrder: selectedColumns,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('appointmentColumns', JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Error saving columns to localStorage:', error);
    }
    
    // إرسال البيانات للمكون الأب
    if (onApply) {
      onApply(selectedColumnNames, selectedColumns);
    }
    if (onClose) onClose();
  };

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
    e.target.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedItem(null);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === index) return;

    const newColumns = [...selectedColumns];
    const draggedColumn = newColumns[draggedItem];
    
    // Remove dragged item
    newColumns.splice(draggedItem, 1);
    // Insert at new position
    newColumns.splice(index, 0, draggedColumn);
    
    setSelectedColumns(newColumns);
    setDraggedItem(index);
    
    // حفظ فوري بعد إعادة الترتيب
    saveToLocalStorage(newColumns);
  };

  const handleDrop = (e) => {
    e.preventDefault();
  };

  // إضافة زر Reset لإعادة تعيين الإعدادات
  const handleReset = () => {
    const defaultColumns = [
      { name: 'Time', selected: true, id: 'time' },
      { name: 'Interview', selected: true, id: 'interview' },
      { name: 'Workspace', selected: true, id: 'workspace' },
      { name: 'Client', selected: true, id: 'client' },
      { name: 'Phone', selected: true, id: 'phone' },
      { name: 'Status', selected: true, id: 'status' },
      { name: 'Action', selected: true, id: 'action' },
      { name: 'Created at', selected: false, id: 'created' },
      { name: 'Time Zone', selected: false, id: 'timezone' },
      { name: 'Email', selected: false, id: 'email' }
    ];
    
    setSelectedColumns(defaultColumns);
    
    // حذف من localStorage
    try {
      localStorage.removeItem('appointmentColumns');
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-25 z-40"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold text-gray-900">Manage Columns</h2>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            >
              <X size={24} />
            </button>
          </div>
          
          {/* Info Banner */}
          <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg mb-3">
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">i</span>
            </div>
            <span className="text-blue-700 text-sm">Select at least two fields and drag to reorder</span>
          </div>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="w-full px-3 py-2 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-gray-700 transition-colors"
          >
            Reset to Default
          </button>
        </div>

        {/* Column List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-2">
            {selectedColumns.map((column, index) => (
              <div
                key={column.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={handleDrop}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 cursor-grab select-none ${
                  column.selected 
                    ? 'border-purple-200 bg-purple-50 hover:bg-purple-100' 
                    : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                } ${draggedItem === index ? 'shadow-lg scale-105' : 'hover:shadow-md'}`}
              >
                {/* Drag Handle */}
                <GripVertical 
                  size={16} 
                  className="text-gray-400 hover:text-gray-600 flex-shrink-0" 
                />
                
                {/* Checkbox */}
                <div className="relative flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={column.selected}
                    onChange={() => handleToggleColumn(column.id)}
                    className="w-4 h-4 rounded border-2 border-gray-300 focus:ring-2 focus:ring-purple-500 focus:ring-offset-0 cursor-pointer transition-colors"
                  />
                </div>
                
                {/* Column Name */}
                <span className={`text-sm font-medium flex-1 ${
                  column.selected ? 'text-purple-800' : 'text-gray-700'
                }`}>
                  {column.name}
                </span>

                {/* Saved indicator */}
                {column.selected && (
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" title="Saved"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyColumns}
              className="px-6 py-2.5 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors shadow-sm"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ColumnManagerSidebar;