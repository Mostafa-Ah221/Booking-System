// hooks/useConfirmationToast.js
import toast from "react-hot-toast";

export const useConfirmationToast = () => {
  const showConfirmationToast = (message, onConfirm, onCancel, options = {}) => {
    const {
      title = "Confirm Action",
      confirmText = "Confirm",
      cancelText = "Cancel",
      confirmVariant = "danger",
      icon = null,
      position = 'top-center'
    } = options;

    const variants = {
      danger: {
        confirmButton: "text-red-600 hover:text-red-500 focus:ring-red-500",
        confirmBg: "hover:bg-red-50"
      },
      primary: {
        confirmButton: "text-blue-600 hover:text-blue-500 focus:ring-blue-500",
        confirmBg: "hover:bg-blue-50"
      },
      success: {
        confirmButton: "text-green-600 hover:text-green-500 focus:ring-green-500",
        confirmBg: "hover:bg-green-50"
      }
    };

    const variant = variants[confirmVariant] || variants.danger;

    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 flex-col transform transition-all duration-300`}>
        <div className="w-full p-4">
          <div className="flex items-start">
            {icon && (
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
                  {icon}
                </div>
              </div>
            )}
            <div className={`${icon ? 'ml-3' : ''} flex-1`}>
              <p className="text-sm font-medium text-gray-900">{title}</p>
              <p className="mt-1 text-sm text-gray-500">{message}</p>
            </div>
          </div>
        </div>
        <div className="flex border-t border-gray-200 divide-x divide-gray-200">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              onCancel && onCancel();
            }}
            className="w-full p-3 flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500 transition-colors duration-200 rounded-bl-lg"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              onConfirm();
            }}
            className={`w-full p-3 flex items-center justify-center text-sm font-medium ${variant.confirmButton} ${variant.confirmBg} focus:outline-none focus:ring-2 focus:ring-inset transition-colors duration-200 rounded-br-lg`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    ), {
      duration: Infinity,
      position: position
    });
  };

  return { showConfirmationToast };
};