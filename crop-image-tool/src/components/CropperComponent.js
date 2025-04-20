import React, { useState, useRef } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

/**
 * CropperComponent - A reusable image cropper component
 * 
 * @param {Object} props - Component props
 * @param {string} props.src - Source URL of the image to crop
 * @param {function} props.onCrop - Callback function when crop settings change
 * @param {number} [props.aspectRatio=4/3] - Aspect ratio for the crop area
 * @returns {JSX.Element} CropperComponent
 */
const CropperComponent = ({ src, onCrop, aspectRatio = 4 / 3 }) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const cropperRef = useRef(null);

  const handleCrop = () => {
    if (cropperRef.current && cropperRef.current.cropper) {
      const cropper = cropperRef.current.cropper;
      const cropData = cropper.getData();
      
      // Pass crop data to parent component
      if (onCrop) {
        onCrop({
          x: cropData.x,
          y: cropData.y,
          width: cropData.width,
          height: cropData.height,
          rotation: cropData.rotate
        });
      }
    }
  };

  const handleZoomChange = (e) => {
    const newZoom = parseFloat(e.target.value);
    setZoom(newZoom);
    
    if (cropperRef.current && cropperRef.current.cropper) {
      cropperRef.current.cropper.zoomTo(newZoom);
    }
  };

  const handleRotationChange = (e) => {
    const newRotation = parseInt(e.target.value, 10);
    setRotation(newRotation);
    
    if (cropperRef.current && cropperRef.current.cropper) {
      cropperRef.current.cropper.rotateTo(newRotation);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: '80px' }}>
        <Cropper
          ref={cropperRef}
          src={src}
          style={{ height: '100%', width: '100%' }}
          aspectRatio={aspectRatio}
          guides={true}
          crop={handleCrop}
          zoomTo={zoom}
          rotateTo={rotation}
          viewMode={1}
          minCropBoxHeight={10}
          minCropBoxWidth={10}
          background={false}
          responsive={true}
          autoCropArea={1}
          checkOrientation={false}
        />
      </div>
      
      <div style={{ 
        position: 'absolute', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        height: '80px', 
        background: '#f0f0f0',
        padding: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: '20px'
      }}>
        <div style={{ flex: 1 }}>
          <label htmlFor="zoom" style={{ display: 'block', marginBottom: '5px' }}>Zoom: {zoom.toFixed(1)}x</label>
          <input
            id="zoom"
            type="range"
            min={0.1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={handleZoomChange}
            style={{ width: '100%' }}
          />
        </div>
        
        <div style={{ flex: 1 }}>
          <label htmlFor="rotation" style={{ display: 'block', marginBottom: '5px' }}>Rotation: {rotation}°</label>
          <input
            id="rotation"
            type="range"
            min={0}
            max={360}
            step={1}
            value={rotation}
            onChange={handleRotationChange}
            style={{ width: '100%' }}
          />
        </div>
      </div>
    </div>
  );
};

export default CropperComponent; 