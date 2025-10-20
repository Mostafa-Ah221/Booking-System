import React, { useState, useRef, useCallback } from 'react';
import { IoIosCamera, IoMdClose } from "react-icons/io";
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import toast from "react-hot-toast";

const ImageUploadCrop = ({ isOpen, onClose, onImageUpdate, currentImage }) => {
  const [src, setSrc] = useState(null);
  const [crop, setCrop] = useState({
    unit: 'px',
    width: 200,
    height: 200,
    x: 0,
    y: 0,
    aspect: 1
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);
  const fileInputRef = useRef(null);
  const cropContainerRef = useRef(null);
  const [showColorPicker, setShowColorPicker] = useState(true);

  const colors = [
    '#90EE90', '#FFB6C1', '#F0E68C', '#87CEEB', '#98FB98',
    '#DDA0DD', '#F4A460', '#98FB98', '#FFA07A', '#9370DB',
    '#FA8072', '#F0E68C', '#808080', '#DEB887'
  ];

  const blobToFile = (blob, fileName) => {
    return new File([blob], fileName, {
      type: blob.type,
      lastModified: new Date().getTime()
    });
  };

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setSrc(reader.result));
      reader.readAsDataURL(e.target.files[0]);
      setShowColorPicker(false);
    }
  };

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    imgRef.current = e.currentTarget;

    const displayedWidth = width;
    const displayedHeight = height;
    
    const cropSize = Math.min((displayedWidth * 2) / 3, displayedWidth, displayedHeight);

    const defaultCrop = {
      unit: 'px',
      width: cropSize,
      height: cropSize,
      x: (displayedWidth - cropSize) / 2,
      y: (displayedHeight - cropSize) / 2,
      aspect: 1
    };

    setCrop(defaultCrop);
    setCompletedCrop(defaultCrop);
  };

  const onCropChange = (newCrop) => {
    setCrop(newCrop);
  };

  const onCropComplete = (crop) => {
    setCompletedCrop(crop);
  };

  const getCroppedImg = useCallback(() => {
    if (!completedCrop || !imgRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          return;
        }
        const file = blobToFile(blob, `cropped-image-${Date.now()}.jpg`);
        resolve(file);
      }, 'image/jpeg', 0.9);
    });
  }, [completedCrop]);

  const handleCrop = async () => {
    try {
      const croppedImageFile = await getCroppedImg();
      if (croppedImageFile) {
        onImageUpdate(croppedImageFile);
        handleClose();
      }
    } catch (e) {
      toast.error('An error occurred while cropping the image.');
    }
  };

  const handleColorSelect = (color) => {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 300, 300);

    canvas.toBlob((blob) => {
      if (blob) {
        const colorFile = blobToFile(blob, `color-background-${Date.now()}.jpg`);
        onImageUpdate(colorFile);
        handleClose();
      }
    }, 'image/jpeg', 0.9);
  };

  const handleClose = () => {
    setSrc(null);
    setCrop({
      unit: 'px',
      width: 200,
      height: 200,
      x: 0,
      y: 0,
      aspect: 1
    });
    setCompletedCrop(null);
    setShowColorPicker(true);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-2xl lg:max-w-3xl max-h-[95vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base sm:text-lg font-semibold">
              {src ? 'Crop Image' : 'Choose Image or Color'}
            </h3>
            <button 
              onClick={handleClose} 
              className="text-gray-500 hover:text-gray-700 p-1"
              aria-label="Close"
            >
              <IoMdClose size={24} />
            </button>
          </div>

          {src ? (
            <>
              <div
                ref={cropContainerRef}
                className="mb-4 flex justify-center overflow-auto"
                style={{ maxHeight: '60vh' }}
              >
                <ReactCrop
                  crop={crop}
                  onChange={onCropChange}
                  onComplete={onCropComplete}
                  aspect={1}
                  ruleOfThirds
                >
                  <img
                    ref={imgRef}
                    src={src}
                    alt="Crop preview"
                    onLoad={onImageLoad}
                    className="max-w-full h-auto"
                    style={{
                      maxHeight: '55vh',
                      objectFit: 'contain',
                      margin: '0 auto'
                    }}
                  />
                </ReactCrop>
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-3">
                <button
                  onClick={() => {
                    setSrc(null);
                    setCrop({
                      unit: 'px',
                      width: 200,
                      height: 200,
                      x: 0,
                      y: 0,
                      aspect: 1
                    });
                    setShowColorPicker(true);
                  }}
                  className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleCrop}
                  className="w-full sm:w-auto px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!completedCrop}
                >
                  Save Changes
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="w-full">
                <div
                  onClick={() => fileInputRef.current.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                      <IoIosCamera className="text-purple-600 text-xl" />
                    </div>
                    <button className="px-4 py-2 border border-purple-600 text-purple-600 rounded-md hover:bg-purple-50 transition-colors text-sm sm:text-base">
                      Upload Image
                    </button>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={onSelectFile}
                  className="hidden"
                />
              </div>

              {showColorPicker && (
                <div className="w-full">
                  <div className="text-center mb-3 text-gray-500 text-sm sm:text-base">
                    Or pick a color
                  </div>
                  <div className="grid grid-cols-5 sm:grid-cols-7 gap-2 sm:gap-3">
                    {colors.map((color, index) => (
                      <div
                        key={index}
                        className="w-full aspect-square rounded cursor-pointer hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                        onClick={() => handleColorSelect(color)}
                        role="button"
                        tabIndex={0}
                        aria-label={`اختر اللون ${color}`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            handleColorSelect(color);
                          }
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUploadCrop;