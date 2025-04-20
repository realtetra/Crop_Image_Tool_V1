import React, { useState, useRef, useEffect } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import Dropzone from 'react-dropzone';
import { FaUpload, FaCamera, FaCropAlt, FaCloudDownloadAlt, FaUndo, FaRedo, FaInfoCircle } from 'react-icons/fa';
import { MdRotate90DegreesCcw, MdFlip } from 'react-icons/md';
import { SketchPicker } from 'react-color';
import './ImageEditor.css';
import { saveAs } from 'file-saver';
import FilterControls from './FilterControls';
import { defaultFilters } from '../config/editorConfig';

const ImageEditor = () => {
  const [image, setImage] = useState('');
  const [cropData, setCropData] = useState('#');
  const [cropper, setCropper] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(null);
  const [gridOverlay, setGridOverlay] = useState('rule-of-thirds');
  const [shapeCrop, setShapeCrop] = useState('rectangle');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [cropHistory, setCropHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [zoomValue, setZoomValue] = useState(1);
  const [rotationValue, setRotationValue] = useState(0);
  const [imageQuality, setImageQuality] = useState(0.9);
  const [exportFormat, setExportFormat] = useState('png');
  const [showSettings, setShowSettings] = useState(false);
  const [cropWidth, setCropWidth] = useState(0);
  const [cropHeight, setCropHeight] = useState(0);
  const [measurementUnit, setMeasurementUnit] = useState('px');
  const [lockDimensions, setLockDimensions] = useState(false);
  const [filters, setFilters] = useState({ ...defaultFilters });
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  
  const cropperRef = useRef(null);
  
  useEffect(() => {
    if (cropper) {
      const data = cropper.getData();
      setCropWidth(Math.round(data.width));
      setCropHeight(Math.round(data.height));
    }
  }, [cropper, aspectRatio]);
  
  const handleWidthChange = (e) => {
    const newWidth = parseInt(e.target.value, 10);
    if (isNaN(newWidth) || !cropper) return;
    
    setCropWidth(newWidth);
    
    if (lockDimensions && aspectRatio) {
      const newHeight = Math.round(newWidth / aspectRatio);
      setCropHeight(newHeight);
      
      const data = cropper.getData();
      cropper.setData({
        ...data,
        width: newWidth,
        height: newHeight
      });
    } else {
      const data = cropper.getData();
      cropper.setData({
        ...data,
        width: newWidth
      });
    }
  };
  
  const handleHeightChange = (e) => {
    const newHeight = parseInt(e.target.value, 10);
    if (isNaN(newHeight) || !cropper) return;
    
    setCropHeight(newHeight);
    
    if (lockDimensions && aspectRatio) {
      const newWidth = Math.round(newHeight * aspectRatio);
      setCropWidth(newWidth);
      
      const data = cropper.getData();
      cropper.setData({
        ...data,
        width: newWidth,
        height: newHeight
      });
    } else {
      const data = cropper.getData();
      cropper.setData({
        ...data,
        height: newHeight
      });
    }
  };
  
  const handleUnitChange = (e) => {
    setMeasurementUnit(e.target.value);
  };
  
  const addToHistory = (cropperData) => {
    const newHistory = cropHistory.slice(0, historyIndex + 1);
    newHistory.push({
      ...cropperData,
      dimensions: {
        width: cropWidth,
        height: cropHeight,
        unit: measurementUnit
      }
    });
    setCropHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };
  
  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    
    reader.onload = () => {
      setImage(reader.result);
    };
    
    if (file) {
      reader.readAsDataURL(file);
    }
  };
  
  const handleUrlImport = () => {
    const url = prompt('Enter the URL of the image:');
    if (url) {
      setImage(url);
    }
  };
  
  const handleWebcamCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      
      video.addEventListener('loadeddata', () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        
        ctx.drawImage(video, 0, 0);
        
        const dataUrl = canvas.toDataURL('image/png');
        setImage(dataUrl);
        
        stream.getTracks().forEach(track => track.stop());
      });
    } catch (error) {
      console.error('Error accessing webcam:', error);
      alert('Could not access webcam. Please check permissions.');
    }
  };
  
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    applyFiltersToImage();
  };
  
  const applyFiltersToImage = () => {
    if (cropData !== '#') {
      handleCrop();
    }
  };
  
  const handleResetFilters = () => {
    setFilters({ ...defaultFilters });
    applyFiltersToImage();
  };
  
  const getFilterString = () => {
    return `brightness(${filters.brightness}%) 
            contrast(${filters.contrast}%) 
            saturate(${filters.saturation}%) 
            blur(${filters.blur}px)`;
  };
  
  const handleCrop = () => {
    if (cropper) {
      const cropBoxData = cropper.getCropBoxData();
      const canvasData = cropper.getCanvasData();
      const cropData = cropper.getData();
      
      addToHistory({
        cropBoxData,
        canvasData,
        cropData,
        filters: { ...filters }
      });
      
      const canvas = cropper.getCroppedCanvas({
        maxWidth: 4096,
        maxHeight: 4096,
        fillColor: backgroundColor,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high',
      });
      
      if (canvas) {
        const filteredCanvas = document.createElement('canvas');
        filteredCanvas.width = canvas.width;
        filteredCanvas.height = canvas.height;
        const ctx = filteredCanvas.getContext('2d');
        
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, filteredCanvas.width, filteredCanvas.height);
        
        ctx.drawImage(canvas, 0, 0);
        
        ctx.filter = getFilterString();
        ctx.drawImage(filteredCanvas, 0, 0);
        ctx.filter = 'none';
        
        if (shapeCrop === 'circle') {
          const circleCanvas = document.createElement('canvas');
          const circleCtx = circleCanvas.getContext('2d');
          
          const size = Math.min(filteredCanvas.width, filteredCanvas.height);
          circleCanvas.width = size;
          circleCanvas.height = size;
          
          circleCtx.beginPath();
          circleCtx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
          circleCtx.closePath();
          circleCtx.clip();
          
          circleCtx.fillStyle = backgroundColor;
          circleCtx.fillRect(0, 0, size, size);
          
          circleCtx.drawImage(
            filteredCanvas,
            (size - filteredCanvas.width) / 2,
            (size - filteredCanvas.height) / 2,
            filteredCanvas.width,
            filteredCanvas.height
          );
          
          setCropData(circleCanvas.toDataURL(`image/${exportFormat}`, imageQuality));
        } else {
          setCropData(filteredCanvas.toDataURL(`image/${exportFormat}`, imageQuality));
        }
      }
    }
  };
  
  const handleAspectRatioChange = (value) => {
    let ratio = null;
    
    switch (value) {
      case '1:1':
        ratio = 1;
        break;
      case '4:3':
        ratio = 4 / 3;
        break;
      case '16:9':
        ratio = 16 / 9;
        break;
      case '3:4':
        ratio = 3 / 4;
        break;
      case '9:16':
        ratio = 9 / 16;
        break;
      default:
        ratio = null;
    }
    
    setAspectRatio(ratio);
    if (cropper) {
      cropper.setAspectRatio(ratio);
      
      setTimeout(() => {
        const data = cropper.getData();
        setCropWidth(Math.round(data.width));
        setCropHeight(Math.round(data.height));
      }, 100);
    }
  };
  
  const handleRotateLeft = () => {
    if (cropper) {
      cropper.rotate(-90);
      setRotationValue(rotationValue - 90);
    }
  };
  
  const handleRotateRight = () => {
    if (cropper) {
      cropper.rotate(90);
      setRotationValue(rotationValue + 90);
    }
  };
  
  const handleFlipHorizontal = () => {
    if (cropper) {
      cropper.scaleX(cropper.getImageData().scaleX * -1);
    }
  };
  
  const handleFlipVertical = () => {
    if (cropper) {
      cropper.scaleY(cropper.getImageData().scaleY * -1);
    }
  };
  
  const handleDownload = () => {
    if (cropData !== '#') {
      const link = document.createElement('a');
      link.download = `cropped-image.${exportFormat}`;
      link.href = cropData;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      const prevState = cropHistory[prevIndex];
      
      if (cropper && prevState) {
        cropper.setCanvasData(prevState.canvasData);
        cropper.setCropBoxData(prevState.cropBoxData);
        
        setCropWidth(prevState.dimensions.width);
        setCropHeight(prevState.dimensions.height);
        
        if (prevState.filters) {
          setFilters(prevState.filters);
        }
      }
      
      setHistoryIndex(prevIndex);
    }
  };
  
  const handleRedo = () => {
    if (historyIndex < cropHistory.length - 1) {
      const nextIndex = historyIndex + 1;
      const nextState = cropHistory[nextIndex];
      
      if (cropper && nextState) {
        cropper.setCanvasData(nextState.canvasData);
        cropper.setCropBoxData(nextState.cropBoxData);
        
        setCropWidth(nextState.dimensions.width);
        setCropHeight(nextState.dimensions.height);
        
        if (nextState.filters) {
          setFilters(nextState.filters);
        }
      }
      
      setHistoryIndex(nextIndex);
    }
  };
  
  const handleZoomChange = (e) => {
    const value = parseFloat(e.target.value);
    setZoomValue(value);
    
    if (cropper) {
      cropper.zoomTo(value);
    }
  };
  
  const handleReset = () => {
    if (cropper) {
      cropper.reset();
      cropper.setAspectRatio(aspectRatio);
      
      const data = cropper.getData();
      setCropWidth(Math.round(data.width));
      setCropHeight(Math.round(data.height));
      
      setFilters({ ...defaultFilters });
      
      setCropHistory([]);
      setHistoryIndex(-1);
    }
  };
  
  return (
    <div className="image-editor">
      <div className="editor-container">
        <div className="editor-toolbar">
          <div className="toolbar-section">
            <Dropzone onDrop={handleDrop} accept={{
              'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
            }}>
              {({getRootProps, getInputProps}) => (
                <button {...getRootProps()} className="toolbar-button">
                  <input {...getInputProps()} />
                  <FaUpload /> <span>Upload</span>
                </button>
              )}
            </Dropzone>
            <button className="toolbar-button" onClick={handleWebcamCapture}>
              <FaCamera /> <span>Camera</span>
            </button>
            <button className="toolbar-button" onClick={handleUrlImport}>
              <FaUpload /> <span>URL</span>
            </button>
          </div>
          
          {image && (
            <>
              <div className="toolbar-section">
                <button className="toolbar-button" onClick={handleCrop}>
                  <FaCropAlt /> <span>Crop</span>
                </button>
                <select
                  className="toolbar-select"
                  onChange={(e) => handleAspectRatioChange(e.target.value)}
                  value={aspectRatio === null ? 'free' : aspectRatio === 1 ? '1:1' : aspectRatio === 4/3 ? '4:3' : aspectRatio === 16/9 ? '16:9' : aspectRatio === 3/4 ? '3:4' : '9:16'}
                >
                  <option value="free">Free</option>
                  <option value="1:1">1:1</option>
                  <option value="4:3">4:3</option>
                  <option value="16:9">16:9</option>
                  <option value="3:4">3:4</option>
                  <option value="9:16">9:16</option>
                </select>
                <select
                  className="toolbar-select"
                  onChange={(e) => setShapeCrop(e.target.value)}
                  value={shapeCrop}
                >
                  <option value="rectangle">Rectangle</option>
                  <option value="circle">Circle</option>
                </select>
              </div>
              
              <div className="toolbar-section">
                <button className="toolbar-button" onClick={handleRotateLeft}>
                  <MdRotate90DegreesCcw /> <span>Rotate Left</span>
                </button>
                <button className="toolbar-button" onClick={handleRotateRight}>
                  <MdRotate90DegreesCcw style={{ transform: 'scaleX(-1)' }} /> <span>Rotate Right</span>
                </button>
                <button className="toolbar-button" onClick={handleFlipHorizontal}>
                  <MdFlip /> <span>Flip H</span>
                </button>
                <button className="toolbar-button" onClick={handleFlipVertical}>
                  <MdFlip style={{ transform: 'rotate(90deg)' }} /> <span>Flip V</span>
                </button>
              </div>
              
              <div className="toolbar-section">
                <button className="toolbar-button" onClick={handleUndo} disabled={historyIndex <= 0}>
                  <FaUndo /> <span>Undo</span>
                </button>
                <button className="toolbar-button" onClick={handleRedo} disabled={historyIndex >= cropHistory.length - 1}>
                  <FaRedo /> <span>Redo</span>
                </button>
                <button className="toolbar-button" onClick={handleReset}>
                  <FaUndo /> <span>Reset</span>
                </button>
              </div>
              
              <div className="toolbar-section">
                <button
                  className={`toolbar-button ${showFilterPanel ? 'active' : ''}`}
                  onClick={() => setShowFilterPanel(!showFilterPanel)}
                >
                  <span>Filters</span>
                </button>
              </div>
              
              <div className="toolbar-section">
                <div className="color-picker-container">
                  <button
                    className="color-button"
                    onClick={() => setColorPickerVisible(!colorPickerVisible)}
                    style={{ backgroundColor }}
                  >
                    <span>Background</span>
                  </button>
                  {colorPickerVisible && (
                    <div className="color-picker-popover">
                      <div className="color-picker-cover" onClick={() => setColorPickerVisible(false)} />
                      <SketchPicker
                        color={backgroundColor}
                        onChange={(color) => setBackgroundColor(color.hex)}
                      />
                    </div>
                  )}
                </div>
                <select
                  className="toolbar-select"
                  onChange={(e) => setExportFormat(e.target.value)}
                  value={exportFormat}
                >
                  <option value="png">PNG</option>
                  <option value="jpeg">JPEG</option>
                  <option value="webp">WebP</option>
                </select>
                <button className="toolbar-button" onClick={handleDownload} disabled={cropData === '#'}>
                  <FaCloudDownloadAlt /> <span>Download</span>
                </button>
              </div>
              
              <div className="toolbar-section">
                <button
                  className="toolbar-button"
                  onClick={() => setShowSettings(!showSettings)}
                >
                  <FaInfoCircle /> <span>Settings</span>
                </button>
              </div>
            </>
          )}
        </div>
        
        <div className="editor-main">
          <div className="editor-workspace">
            {!image ? (
              <div className="upload-prompt">
                <h2>Upload an Image to Start</h2>
                <p>Drag & drop an image file here, use the upload button, or take a photo with your webcam.</p>
                <p>Supported formats: JPEG, PNG, GIF, BMP, TIFF, WebP</p>
              </div>
            ) : (
              <div className={`cropper-container ${gridOverlay}`}>
                <Cropper
                  ref={cropperRef}
                  src={image}
                  style={{ height: '100%', width: '100%' }}
                  aspectRatio={aspectRatio}
                  guides={true}
                  autoCropArea={1}
                  background={false}
                  responsive={true}
                  checkOrientation={true}
                  onInitialized={(instance) => {
                    setCropper(instance);
                  }}
                  viewMode={1}
                  minCropBoxHeight={10}
                  minCropBoxWidth={10}
                  zoomOnWheel={false}
                />
              </div>
            )}
          </div>
          
          {cropData !== '#' && (
            <div className="preview-container">
              <h3>Preview</h3>
              <div className="crop-preview">
                <img 
                  src={cropData} 
                  alt="Cropped" 
                  className={shapeCrop === 'circle' ? 'circle' : ''} 
                />
              </div>
            </div>
          )}
          
          {showFilterPanel && image && (
            <div className="filter-panel">
              <FilterControls 
                initialFilters={filters}
                onChange={handleFilterChange}
                onReset={handleResetFilters}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageEditor; 