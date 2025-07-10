import React, { useState } from 'react';
import { InfoIcon, ChevronDown, ChevronUp } from 'lucide-react';

const RolesPermissions = () => {
  const [selectedRole, setSelectedRole] = useState('Staff');
  const [expandedFeatures, setExpandedFeatures] = useState({});
  
  const permissions = [
    {
      feature: 'Availability',
      view: true,
      edit: false,
      add: null,
      delete: null,
      export: null,
      info: false
    },
    {
      feature: 'Booking Pages',
      view: 'All Booking Page',
      edit: null,
      add: null,
      delete: null,
      export: null,
      info: true
    },
    {
      feature: 'Customer',
      view: 'All Customer',
      edit: false,
      add: true,
      delete: false,
      export: true,
      info: false
    }
  ];

  const toggleFeature = (index) => {
    setExpandedFeatures(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Helper function to render permission cell content
  const renderPermissionCell = (value) => {
    if (value === null) return null;
    if (typeof value === 'boolean') {
      return (
        <input
          type="checkbox"
          checked={value}
          onChange={() => {}}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
      );
    }
    return value;
  };

  return (
    <div className="w-full max-w-4xl p-4 md:p-6">
      <h1 className="text-lg md:text-xl font-semibold mb-4 md:mb-6">Roles and Permissions</h1>

      <div className="space-y-4 md:space-y-6">
        {/* Role Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <input
            type="text"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Desktop Permissions Table - Hidden on mobile */}
        <div className="hidden md:block border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                  Features
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  View
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Edit
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Add
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Delete
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Export
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {permissions.map((permission, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 flex items-center gap-2">
                    {permission.feature}
                    {permission.info && (
                      <InfoIcon className="w-4 h-4 text-gray-400" />
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {renderPermissionCell(permission.view)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {renderPermissionCell(permission.edit)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {renderPermissionCell(permission.add)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {renderPermissionCell(permission.delete)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {renderPermissionCell(permission.export)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Accordion View - Hidden on desktop */}
        <div className="md:hidden space-y-3">
          {permissions.map((permission, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
              <div 
                className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer"
                onClick={() => toggleFeature(index)}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{permission.feature}</span>
                  {permission.info && <InfoIcon className="w-4 h-4 text-gray-400" />}
                </div>
                {expandedFeatures[index] ? 
                  <ChevronUp className="w-5 h-5 text-gray-500" /> : 
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                }
              </div>
              
              {expandedFeatures[index] && (
                <div className="p-3 bg-white">
                  <div className="space-y-3">
                    {/* View Permission */}
                    {(permission.view !== null) && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">View</span>
                        <div>{renderPermissionCell(permission.view)}</div>
                      </div>
                    )}
                    
                    {/* Edit Permission */}
                    {(permission.edit !== null) && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Edit</span>
                        <div>{renderPermissionCell(permission.edit)}</div>
                      </div>
                    )}
                    
                    {/* Add Permission */}
                    {(permission.add !== null) && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Add</span>
                        <div>{renderPermissionCell(permission.add)}</div>
                      </div>
                    )}
                    
                    {/* Delete Permission */}
                    {(permission.delete !== null) && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Delete</span>
                        <div>{renderPermissionCell(permission.delete)}</div>
                      </div>
                    )}
                    
                    {/* Export Permission */}
                    {(permission.export !== null) && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Export</span>
                        <div>{renderPermissionCell(permission.export)}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RolesPermissions;