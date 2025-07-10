import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, Check, Info, Plus } from 'lucide-react';

const WorkspaceThemePanel = ({ onLayoutChange, onColorChange }) => {
  const [openSection, setOpenSection] = useState('theme'); // Start with theme section open
  const [selectedLayout, setSelectedLayout] = useState('classic');
  const [selectedColor, setSelectedColor] = useState('#4f46e5'); // Default indigo color

  // Effect to initialize color
  useEffect(() => {
    // Pass initial color to parent
    onColorChange(selectedColor);
  }, []);

  const toggleSection = (section) => {
    if (openSection === section) {
      setOpenSection('');
    } else {
      setOpenSection(section);
    }
  };

  // Color options array
  const colorOptions = [
    { color: '#4f46e5', type: 'solid' }, // indigo
    { color: '#ef4444', type: 'solid' }, // red
    { color: '#a855f7', type: 'solid' }, // purple
    { color: '#06b6d4', type: 'solid' }, // cyan
    { color: '#0ea5e9', type: 'solid' }, // light blue
    { color: '#6b21a8', type: 'solid' }, // dark purple
    { color: '#be185d', type: 'solid' }, // pink
    { color: '#312e81', type: 'solid' }, // dark indigo
    { color: '#16a34a', type: 'solid' }, // green
    { color: '#d97706', type: 'solid' }, // amber
    { color: '#ef4444-#f59e0b', type: 'gradient' }, // red-yellow gradient
    { color: '#06b6d4-#10b981', type: 'gradient' }, // cyan-green gradient
    { color: '#0ea5e9-#eab308', type: 'gradient' }, // blue-yellow gradient
    { color: '#8b5cf6-#06b6d4', type: 'gradient' }, // purple-cyan gradient
    { color: '#d946ef-#ec4899', type: 'gradient' }, // pink gradient
    { color: '#ef4444-#8b5cf6', type: 'gradient' }, // red-purple gradient
  ];

  const handleLayoutChange = (layout) => {
    setSelectedLayout(layout);
    onLayoutChange(layout); // Pass the selected layout to the parent component
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
    onColorChange(color); // Pass the selected color to the parent component
  };

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow">
      <div className="divide-y">
        {/* Theme Section */}
        <div>
          <div 
            className="flex justify-between items-center p-4 cursor-pointer"
            onClick={() => toggleSection('theme')}
          >
            <span className="font-medium">Theme</span>
            {openSection === 'theme' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </div>
          
          {openSection === 'theme' && (
            <div className="p-4 bg-gray-50">
              <div className="mb-4">
                <p className="mb-2">Layouts</p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {/* New Layout */}
                  <div 
                    className={`p-2 bg-white rounded cursor-pointer relative ${selectedLayout === 'newLayout' ? 'border-2 border-blue-600' : 'border'}`}
                    onClick={() => handleLayoutChange('newLayout')}
                  >
                    <div className="mb-1 text-blue-600 text-sm font-medium">New Layout</div>
                    <div className="w-full h-4 bg-gray-100 rounded mb-1"></div>
                    <div className="w-full h-4 bg-gray-100 rounded mb-1"></div>
                    <div className="w-full h-4 bg-gray-100 rounded"></div>
                    {selectedLayout === 'newLayout' && (
                      <div className="absolute bottom-2 right-2 bg-blue-600 rounded-full p-1">
                        <Check size={14} className="text-white" />
                      </div>
                    )}
                  </div>
                  
                  {/* Modern Web */}
                  <div 
                    className={`p-2 bg-white rounded cursor-pointer relative ${selectedLayout === 'modernWeb' ? 'border-2 border-indigo-600' : 'border'}`}
                    onClick={() => handleLayoutChange('modernWeb')}
                  >
                    <div className="mb-1 text-sm">Modern Web</div>
                    <div className="grid grid-cols-2 gap-1">
                      <div className="h-10 bg-gray-100 rounded"></div>
                      <div className="h-10 bg-gray-100 rounded"></div>
                    </div>
                    {selectedLayout === 'modernWeb' && (
                      <div className="absolute bottom-2 right-2 bg-indigo-600 rounded-full p-1">
                        <Check size={14} className="text-white" />
                      </div>
                    )}
                  </div>
                  
                  {/* Classic */}
                  <div 
                    className={`p-2 bg-white rounded cursor-pointer relative ${selectedLayout === 'classic' ? 'border-2 border-indigo-600' : 'border'}`}
                    onClick={() => handleLayoutChange('classic')}
                  >
                    <div className="mb-1 text-sm">Classic</div>
                    <div className="w-full h-4 bg-gray-100 rounded mb-1"></div>
                    <div className="w-full h-4 bg-gray-100 rounded mb-1"></div>
                    <div className="w-full h-4 bg-gray-100 rounded"></div>
                    {selectedLayout === 'classic' && (
                      <div className="absolute bottom-2 right-2 bg-indigo-600 rounded-full p-1">
                        <Check size={14} className="text-white" />
                      </div>
                    )}
                  </div>
                  
                  {/* Fresh */}
                  <div 
                    className={`p-2 bg-white rounded cursor-pointer relative ${selectedLayout === 'fresh' ? 'border-2 border-gray-300' : 'border'}`}
                    onClick={() => handleLayoutChange('fresh')}
                  >
                    <div className="mb-1 text-sm">Fresh</div>
                    <div className="w-full h-4 bg-gray-100 rounded mb-1"></div>
                    <div className="w-full h-4 bg-gray-100 rounded mb-1"></div>
                    <div className="w-full h-4 bg-gray-100 rounded"></div>
                  </div>
                </div>

                {/* Color Options - Hide for Fresh Layout */}
                {selectedLayout !== 'fresh' && (
                  <>
                    <p className="mb-2">Color Options</p>
                    <div className="grid grid-cols-8 gap-2 mb-4">
                      {colorOptions.map((option, index) => (
                        <div 
                          key={index}
                          className={`w-8 h-8 rounded cursor-pointer ${selectedColor === option.color ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
                          onClick={() => handleColorChange(option.color)}
                          style={
                            option.type === 'solid' 
                              ? { backgroundColor: option.color } 
                              : { 
                                  background: `linear-gradient(45deg, ${option.color.split('-')[0]}, ${option.color.split('-')[1]})` 
                                }
                          }
                        />
                      ))}
                      
                      {/* Add color button */}
                      <div className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center bg-white cursor-pointer">
                        <Plus size={16} className="text-gray-500" />
                      </div>
                    </div>
                  </>
                )}

                {/* Button Text - Only in Image 2 */}
                {selectedLayout === 'modernWeb' && (
                  <div className="mb-4">
                    <p className="mb-2">Button Text</p>
                    <input 
                      type="text" 
                      placeholder="Book appointment" 
                      className="w-full p-2 border rounded"
                      defaultValue="Book appointment"
                    />
                  </div>
                )}

                {/* Pre-select options - Only in Image 2 */}
                {selectedLayout === 'modernWeb' && (
                  <div className="mb-4 flex items-center">
                    <input 
                      type="checkbox" 
                      id="pre-select" 
                      className="mr-2 h-4 w-4 accent-indigo-600"
                      defaultChecked={true}
                    />
                    <label htmlFor="pre-select" className="text-sm">Pre-select options in booking page</label>
                    <Info size={16} className="ml-2 text-gray-400" />
                  </div>
                )}
                
                {/* Save Button */}
                <button 
                  className="py-2 px-6 rounded w-24 text-white"
                  style={{
                    background: selectedColor.includes('-')
                      ? `linear-gradient(45deg, ${selectedColor.split('-')[0]}, ${selectedColor.split('-')[1]})`
                      : selectedColor
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Header Section */}
        <div>
          <div 
            className="flex justify-between items-center p-4 cursor-pointer"
            onClick={() => toggleSection('header')}
          >
            <span className="font-medium">Header</span>
            {openSection === 'header' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </div>
          
          {openSection === 'header' && (
            <div className="p-4 bg-gray-50">
              <div className="mb-4">
                <p className="mb-2">Header Options</p>
                <div className="space-y-2">
                  <input 
                    type="text" 
                    placeholder="Header Title" 
                    className="w-full p-2 border rounded"
                  />
                  <input 
                    type="text" 
                    placeholder="Header Subtitle" 
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Section */}
        <div>
          <div 
            className="flex justify-between items-center p-4 cursor-pointer"
            onClick={() => toggleSection('footer')}
          >
            <span className="font-medium">Footer</span>
            {openSection === 'footer' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </div>
          
          {openSection === 'footer' && (
            <div className="p-4 bg-gray-50">
              <div className="mb-4">
                <p className="mb-2">Footer Options</p>
                <div className="space-y-2">
                  <input 
                    type="text" 
                    placeholder="Footer Text" 
                    className="w-full p-2 border rounded"
                  />
                  <input 
                    type="text" 
                    placeholder="Footer Link" 
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Page Properties Section */}
        <div>
          <div 
            className="flex justify-between items-center p-4 cursor-pointer"
            onClick={() => toggleSection('pageProperties')}
          >
            <span className="font-medium">Page Properties</span>
            {openSection === 'pageProperties' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </div>
          
          {openSection === 'pageProperties' && (
            <div className="p-4 bg-gray-50">
              <div className="mb-4">
                <p className="mb-2">Page Properties Options</p>
                <div className="space-y-2">
                  <input 
                    type="text" 
                    placeholder="Page Title" 
                    className="w-full p-2 border rounded"
                  />
                  <input 
                    type="text" 
                    placeholder="Page Description" 
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Workspace Properties Section */}
        <div>
          <div 
            className="flex justify-between items-center p-4 cursor-pointer"
            onClick={() => toggleSection('workspaceProperties')}
          >
            <span className="font-medium">Workspace Properties</span>
            {openSection === 'workspaceProperties' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </div>
          
          {openSection === 'workspaceProperties' && (
            <div className="p-4 bg-gray-50">
              <div className="mb-4">
                <p className="mb-2">Workspace Properties Options</p>
                <div className="space-y-2">
                  <input 
                    type="text" 
                    placeholder="Workspace Name" 
                    className="w-full p-2 border rounded"
                  />
                  <input 
                    type="text" 
                    placeholder="Workspace Description" 
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkspaceThemePanel;