import React, { useState } from 'react';
import CropperComponent from './CropperComponent';
import FilterControls from './FilterControls';
import { defaultFilters } from '../config/editorConfig';
import { createCroppedImage, downloadImage } from '../utils/cropUtils';

const SimpleExample = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [cropSettings, setCropSettings] = useState(null);
  const [filters, setFilters] = useState({ ...defaultFilters });
  const [showFilters, setShowFilters] = useState(false);
  
  // Handle file input change
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
        setCroppedImage(null);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  
  // Handle crop operation
  const handleCrop = (cropData) => {
    setCropSettings(cropData);
  };
  
  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    // Reapply crop if already cropped
    if (imageSrc && cropSettings) {
      handleProcessCrop();
    }
  };
  
  // Process the cropped image
  const handleProcessCrop = async () => {
    if (imageSrc && cropSettings) {
      try {
        const croppedDataUrl = await createCroppedImage(imageSrc, cropSettings, filters);
        setCroppedImage(croppedDataUrl);
      } catch (error) {
        console.error('Error processing crop:', error);
      }
    }
  };
  
  // Download the cropped image
  const handleDownload = () => {
    if (croppedImage) {
      downloadImage(croppedImage, 'cropped-image.jpg');
    }
  };
  
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <h1>Image Cropper Example</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          style={{ marginBottom: '10px' }}
        />
      </div>
      
      {imageSrc ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ flex: 2, height: '400px', position: 'relative' }}>
              <CropperComponent
                src={imageSrc}
                onCrop={handleCrop}
                aspectRatio={16 / 9}
              />
            </div>
            
            {showFilters && (
              <div style={{ flex: 1, border: '1px solid #ddd', borderRadius: '4px', overflow: 'auto' }}>
                <FilterControls
                  initialFilters={filters}
                  onChange={handleFilterChange}
                />
              </div>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={handleProcessCrop}
              style={{
                padding: '8px 16px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Crop Image
            </button>
            
            <button 
              onClick={() => setShowFilters(!showFilters)}
              style={{
                padding: '8px 16px',
                backgroundColor: showFilters ? '#ff9800' : '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            
            {croppedImage && (
              <button 
                onClick={handleDownload}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#673AB7',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Download
              </button>
            )}
          </div>
          
          {croppedImage && (
            <div>
              <h3>Preview:</h3>
              <div style={{ maxWidth: '100%', marginTop: '10px' }}>
                <img 
                  src={croppedImage} 
                  alt="Cropped" 
                  style={{ maxWidth: '100%', border: '1px solid #ddd' }} 
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div 
          style={{
            padding: '40px',
            border: '2px dashed #ccc',
            borderRadius: '4px',
            textAlign: 'center',
            backgroundColor: '#f9f9f9'
          }}
        >
          Please select an image to start cropping
        </div>
      )}
    </div>
  );
};

export default SimpleExample; 