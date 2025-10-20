import { useState } from "react";
import { Filter, X,  Users } from "lucide-react";
import { ResponsivePie } from "@nivo/pie";

// مكون لإعادة استخدام Pie Chart
function PieChartComponent({ data, title }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
      <h3 className="text-sm font-medium text-gray-700 mb-2">{title}</h3>
      <div className="h-64">
        <ResponsivePie
          data={data}
          margin={{ top: 20, right: 20, bottom: 40, left: 20 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          colors={{ scheme: "set2" }}
          borderWidth={1}
          borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#333333"
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: "color" }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
        />
      </div>
    </div>
  );
}

function RecruitersContent({ data, filters, onFiltersChange }) {
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters || {});

  const recruitersData = data?.data?.date_periods || {};

  const stats = [
    {
      id: "last_7_days",
      title: "Recruiter Last 7 Days",
      value: recruitersData.staff_last_7_days || 0,
      icon: Users,
      color: "blue",
      period: "7 days",
    },
    {
      id: "last_month",
      title: "Recruiter Last Month",
      value: recruitersData.staff_last_month || 0,
      icon: Users,
      color: "green",
      period: "30 days",
    },
    {
      id: "last_year",
      title: "Recruiter Last Year",
      value: recruitersData.staff_last_year || 0,
      icon: Users,
      color: "purple",
      period: "365 days",
    },
    {
      id: "custom",
      title: "Custom Date Range",
      value: recruitersData.staff_custom_date_range || 0,
      icon: Users,
      color: "orange",
      period: "custom",
    },
  ];

  const handleFilterChange = (key, value) => {
    setLocalFilters({ ...localFilters, [key]: value });
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
    setShowFilters(false);
  };

  const clearFilters = () => {
    const cleared = { start_date: "", end_date: "" };
    setLocalFilters(cleared);
    onFiltersChange(cleared);
  };

  const hasActiveFilters = localFilters.start_date || localFilters.end_date;

  // بيانات Pie لكل فترة
  const pieData = stats.map((stat) => ({
    id: stat.title,
    label: stat.period,
    value: stat.value,
  }));

  return (
    <div className="space-y-6">
      {/* Filter Section */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Recruiter Filters</h3>
          <div className="flex items-center space-x-2">
            {hasActiveFilters && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Filtered
              </span>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={localFilters.start_date || ""}
                  onChange={(e) => handleFilterChange("start_date", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={localFilters.end_date || ""}
                  onChange={(e) => handleFilterChange("end_date", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={clearFilters}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <X className="h-4 w-4 mr-2" />
                Clear
              </button>
              <button
                onClick={applyFilters}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
                  <p className="text-xs text-gray-400 mt-1">({stat.period})</p>
                </div>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center bg-${stat.color}-100 text-${stat.color}-600`}
                >
                  <IconComponent className="w-5 h-5" />
                </div>
              </div>
              <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
            </div>
          );
        })}
      </div>

      {/* Pie Chart Distribution */}
      <PieChartComponent data={pieData} title="Recruiter Distribution" />

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-blue-800">Active Filters</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {localFilters.start_date && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    From: {localFilters.start_date}
                  </span>
                )}
                {localFilters.end_date && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    To: {localFilters.end_date}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecruitersContent;
