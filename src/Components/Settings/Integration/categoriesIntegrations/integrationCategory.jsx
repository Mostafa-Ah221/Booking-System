
const IntegrationCategory = ({ category, onConnectClick, onDeleteClick }) => {
  return (
    <div>
      <h2 className="text-sm font-medium text-gray-800 pb-2 my-7 relative 
                after:content-[''] after:block after:w-8 after:h-[2px]
                after:bg-blue-800 after:mt-1">
        {category.title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {category.items.map((item, itemIndex) => (
          <div key={itemIndex} className="border border-gray-200 rounded-lg p-4 flex flex-col items-center shadow-sm">
            <div className='flex justify-between items-center w-full'>
              {item.icon}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onConnectClick(item.name, item.id);
                  }}
                  className={`text-xs px-3 py-1 rounded-md transition-colors ${
                    item.connected 
                      ? 'bg-green-500 text-white hover:bg-green-600' 
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                  disabled={item.disabled}
                >
                  {item.connected ? 'Connected' : 'Connect'}
                </button>
                
                {item.connected && onDeleteClick && (
                  <button
                    onClick={() => {
                      onDeleteClick(item.id, item.name);
                    }}
                    className="text-xs px-3 py-1 bg-red-500 text-white hover:bg-red-600 rounded-md transition-colors"
                    disabled={item.disabled}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
            <div className="flex-1 mt-2">
              <h3 className="text-sm font-medium">{item.name}</h3>
              <p className="text-xs text-gray-600 mt-1">{item.description}</p>
              {item.connected && (
                <span className="text-xs text-green-600 mt-1 block">✓ Integration active</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IntegrationCategory;