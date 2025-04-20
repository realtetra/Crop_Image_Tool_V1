import React, { useState, useRef, useEffect } from 'react';
import Dropzone from 'react-dropzone';
import { FaUpload, FaCropAlt, FaCloudDownloadAlt, FaTrash, FaUndo, FaRedo, FaInfoCircle, FaSave, FaAdjust } from 'react-icons/fa';
import { MdRotate90DegreesCcw, MdFlip } from 'react-icons/md';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { SketchPicker } from 'react-color';
import './BatchProcessing.css';
import FilterControls from './FilterControls';
import { defaultFilters } from '../config/editorConfig';
import { getFilterString } from '../utils/imageProcessor';

const BatchProcessing = () => {
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [cropData, setCropData] = useState({});
  const [aspectRatio, setAspectRatio] = useState(null);
  // Store crop positions and settings for each image
  const [imageCropSettings, setImageCropSettings] = useState({});
  const [cropSettings, setCropSettings] = useState({
    aspectRatio: 'free',
    quality: 0.9,
    format: 'png',
    width: null,
    height: null,
    backgroundColor: '#ffffff',
    applyToAll: false
  });
  const [processing, setProcessing] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);
  
  // New state variables for image adjustment features
  const [gridOverlay, setGridOverlay] = useState('rule-of-thirds');
  const [shapeCrop, setShapeCrop] = useState('rectangle');
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [cropHistory, setCropHistory] = useState({});
  const [historyIndex, setHistoryIndex] = useState({});
  const [zoomValue, setZoomValue] = useState(1);
  const [rotationValue, setRotationValue] = useState(0);
  const [cropWidth, setCropWidth] = useState(0);
  const [cropHeight, setCropHeight] = useState(0);
  const [measurementUnit, setMeasurementUnit] = useState('px');
  const [lockDimensions, setLockDimensions] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [filters, setFilters] = useState({ ...defaultFilters });
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [imageFilters, setImageFilters] = useState({});
  
  const cropperRef = useRef(null);
  
  // Use refs to break circular dependencies for handlers
  const imagesRef = useRef(images);
  const currentImageIndexRef = useRef(currentImageIndex);
  
  // Update refs when values change
  useEffect(() => {
    imagesRef.current = images;
    currentImageIndexRef.current = currentImageIndex;
  }, [images, currentImageIndex]);
  
  // Save crop settings when changing images or cropping
  useEffect(() => {
    if (cropperRef.current?.cropper && images.length > 0) {
      const currentId = images[currentImageIndex]?.id;
      if (currentId && imageCropSettings[currentId]) {
        // Apply saved settings when switching images
        const savedSettings = imageCropSettings[currentId];
        const cropper = cropperRef.current.cropper;
        
        setTimeout(() => {
          if (savedSettings.cropBoxData) {
            cropper.setCropBoxData(savedSettings.cropBoxData);
          }
          if (savedSettings.canvasData) {
            cropper.setCanvasData(savedSettings.canvasData);
          }
        }, 100);
      }
    }
  }, [currentImageIndex, images, imageCropSettings]);
  
  // Load filters for the current image
  useEffect(() => {
    if (images.length > 0) {
      const currentId = images[currentImageIndex]?.id;
      if (currentId && imageFilters[currentId]) {
        setFilters(imageFilters[currentId]);
      } else {
        setFilters({ ...defaultFilters });
      }
    }
  }, [currentImageIndex, images, imageFilters]);
  
  // Update crop width/height when cropper or aspect ratio changes
  useEffect(() => {
    if (cropperRef.current?.cropper && images.length > 0) {
      const data = cropperRef.current.cropper.getData();
      setCropWidth(Math.round(data.width));
      setCropHeight(Math.round(data.height));
    }
  }, [currentImageIndex, aspectRatio, images.length]);
  
  // Save current crop settings when cropper is ready
  const handleCropperReady = () => {
    console.log('Cropper ready', cropperRef.current?.cropper);
    if (!cropperRef.current?.cropper || images.length === 0) return;
    
    const cropper = cropperRef.current.cropper;
    const currentId = images[currentImageIndex]?.id;
    
    // Only save if we don't already have settings for this image
    if (currentId && !imageCropSettings[currentId]) {
      setImageCropSettings(prev => ({
        ...prev,
        [currentId]: {
          cropBoxData: cropper.getCropBoxData(),
          canvasData: cropper.getCanvasData(),
          cropData: cropper.getData()
        }
      }));
      
      // Also initialize filters if not already set
      if (!imageFilters[currentId]) {
        setImageFilters(prev => ({
          ...prev,
          [currentId]: { ...defaultFilters }
        }));
      }
    }
  };
  
  // Handle file drop
  const handleDrop = (acceptedFiles) => {
    const newImages = acceptedFiles.map(file => ({
      file,
      id: `${file.name}-${Date.now()}`,
      src: URL.createObjectURL(file),
      cropped: false
    }));
    
    setImages([...images, ...newImages]);
    
    // If no images were loaded before, set current index to 0
    if (images.length === 0 && newImages.length > 0) {
      setCurrentImageIndex(0);
    }
  };
  
  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    
    // Save filters for current image
    if (images.length > 0) {
      const currentId = images[currentImageIndex]?.id;
      if (currentId) {
        setImageFilters(prev => ({
          ...prev,
          [currentId]: newFilters
        }));
      }
    }
  };
  
  // Reset filters for current image
  const handleResetFilters = () => {
    setFilters({ ...defaultFilters });
    
    // Reset filters for current image
    if (images.length > 0) {
      const currentId = images[currentImageIndex]?.id;
      if (currentId) {
        setImageFilters(prev => {
          const newImageFilters = { ...prev };
          newImageFilters[currentId] = { ...defaultFilters };
          return newImageFilters;
        });
      }
    }
  };
  
  // Handle crop for current image
  const handleCrop = () => {
    if (!cropperRef.current?.cropper) return;
    
    const cropper = cropperRef.current.cropper;
    const cropBoxData = cropper.getCropBoxData();
    const canvasData = cropper.getCanvasData();
    const cropData = cropper.getData();
    
    // Save crop settings for current image
    const currentId = images[currentImageIndex].id;
    setImageCropSettings(prev => ({
      ...prev,
      [currentId]: {
        cropBoxData,
        canvasData,
        cropData
      }
    }));
    
    // Save current filters
    setImageFilters(prev => ({
      ...prev,
      [currentId]: { ...filters }
    }));
    
    // Add to history for undo/redo
    addToHistory(currentId, {
      cropBoxData,
      canvasData,
      cropData,
      filters: { ...filters }
    });
    
    const canvas = cropper.getCroppedCanvas({
      maxWidth: 4096,
      maxHeight: 4096,
      fillColor: cropSettings.backgroundColor,
      imageSmoothingEnabled: true,
      imageSmoothingQuality: 'high',
    });
    
    if (canvas) {
      // Create a new canvas for filtered image
      const filteredCanvas = document.createElement('canvas');
      filteredCanvas.width = canvas.width;
      filteredCanvas.height = canvas.height;
      const ctx = filteredCanvas.getContext('2d');
      
      // Draw background
      ctx.fillStyle = cropSettings.backgroundColor;
      ctx.fillRect(0, 0, filteredCanvas.width, filteredCanvas.height);
      
      // Draw the cropped canvas
      ctx.drawImage(canvas, 0, 0);
      
      // Apply filters
      ctx.filter = getFilterString(filters);
      ctx.drawImage(filteredCanvas, 0, 0);
      ctx.filter = 'none';
      
      let finalCanvas = filteredCanvas;
      
      // Handle circle crop if selected
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
        
        circleCtx.fillStyle = cropSettings.backgroundColor;
        circleCtx.fillRect(0, 0, size, size);
        
        circleCtx.drawImage(
          filteredCanvas,
          (size - filteredCanvas.width) / 2,
          (size - filteredCanvas.height) / 2,
          filteredCanvas.width,
          filteredCanvas.height
        );
        
        finalCanvas = circleCanvas;
      }
      
      const dataUrl = finalCanvas.toDataURL(`image/${cropSettings.format}`, cropSettings.quality);
      
      // Update crop data for current image
      setCropData(prev => ({
        ...prev,
        [images[currentImageIndex].id]: dataUrl
      }));
      
      // Mark this image as cropped
      const updatedImages = [...images];
      updatedImages[currentImageIndex].cropped = true;
      setImages(updatedImages);
      
      // Apply same crop to all remaining images if option is enabled
      if (cropSettings.applyToAll) {
        applyCurrentCropToAll();
      } else {
        // Move to the next image if available
        if (currentImageIndex < images.length - 1) {
          setCurrentImageIndex(currentImageIndex + 1);
        }
      }
    }
  };
  
  // Apply current crop settings to all images
  const applyCurrentCropToAll = async () => {
    if (!cropperRef.current?.cropper) return;
    
    const cropper = cropperRef.current.cropper;
    const cropData = cropper.getData();
    const canvasData = cropper.getCanvasData();
    const cropBoxData = cropper.getCropBoxData();
    
    setProcessing(true);
    setProcessedCount(0);
    
    const updatedImages = [...images];
    const newCropData = { ...cropData };
    const newImageCropSettings = { ...imageCropSettings };
    const newImageFilters = { ...imageFilters };
    
    for (let i = 0; i < images.length; i++) {
      // Skip current image since it's already processed
      if (i === currentImageIndex) continue;
      
      // Create temporary cropper for each image
      const img = new Image();
      img.src = images[i].src;
      
      await new Promise((resolve) => {
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Set canvas dimensions
          canvas.width = img.width;
          canvas.height = img.height;
          
          // Draw image to canvas
          ctx.drawImage(img, 0, 0);
          
          // Apply crop based on relative dimensions and position
          const tempCanvas = document.createElement('canvas');
          const tempCtx = tempCanvas.getContext('2d');
          
          // Calculate crop dimensions relative to the current image
          const widthRatio = img.width / canvasData.naturalWidth;
          const heightRatio = img.height / canvasData.naturalHeight;
          
          const cropX = cropData.x * widthRatio;
          const cropY = cropData.y * heightRatio;
          const cropWidth = cropData.width * widthRatio;
          const cropHeight = cropData.height * heightRatio;
          
          tempCanvas.width = cropWidth;
          tempCanvas.height = cropHeight;
          
          // Fill with background color
          tempCtx.fillStyle = cropSettings.backgroundColor;
          tempCtx.fillRect(0, 0, cropWidth, cropHeight);
          
          // Draw the cropped portion
          tempCtx.drawImage(canvas, 
            cropX, cropY, cropWidth, cropHeight,
            0, 0, cropWidth, cropHeight);
          
          // Get data URL
          const dataUrl = tempCanvas.toDataURL(`image/${cropSettings.format}`, cropSettings.quality);
          newCropData[images[i].id] = dataUrl;
          
          // Save crop settings for this image too
          newImageCropSettings[images[i].id] = {
            cropBoxData: { ...cropBoxData },
            canvasData: { ...canvasData },
            cropData: { ...cropData }
          };
          
          // Mark as cropped
          updatedImages[i].cropped = true;
          
          setProcessedCount(prev => prev + 1);
          resolve();
        };
      });
    }
    
    setCropData(newCropData);
    setImages(updatedImages);
    setImageCropSettings(newImageCropSettings);
    setImageFilters(newImageFilters);
    setProcessing(false);
  };
  
  // Handle removing an image
  const handleRemoveImage = (index) => {
    const imageId = images[index].id;
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
    
    // Remove crop data for this image
    const newCropData = { ...cropData };
    delete newCropData[imageId];
    setCropData(newCropData);
    
    // Remove crop settings for this image
    const newImageCropSettings = { ...imageCropSettings };
    delete newImageCropSettings[imageId];
    setImageCropSettings(newImageCropSettings);
    
    // Update current image index if necessary
    if (currentImageIndex >= updatedImages.length) {
      setCurrentImageIndex(Math.max(0, updatedImages.length - 1));
    }
  };
  
  // Handle aspect ratio change
  const handleAspectRatioChange = (value) => {
    setCropSettings({
      ...cropSettings,
      aspectRatio: value
    });
    
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
    
    if (cropperRef.current?.cropper) {
      cropperRef.current.cropper.setAspectRatio(ratio);
    }
  };
  
  // Download all cropped images
  const handleDownloadAll = async () => {
    // First, ensure the current image is cropped and included
    const currentId = images[currentImageIndex]?.id;
    
    // Create a local copy of cropData to use
    let localCropData = { ...cropData };
    
    // Always crop the current image before downloading
    if (currentId && cropperRef.current?.cropper) {
      // Force crop the current image to ensure it's included
      const cropper = cropperRef.current.cropper;
      const canvas = cropper.getCroppedCanvas({
        maxWidth: 4096,
        maxHeight: 4096,
        fillColor: cropSettings.backgroundColor,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high',
      });
      
      if (canvas) {
        // Apply circle crop if needed
        let finalCanvas = canvas;
        if (shapeCrop === 'circle') {
          const circleCanvas = document.createElement('canvas');
          const ctx = circleCanvas.getContext('2d');
          
          const size = Math.min(canvas.width, canvas.height);
          circleCanvas.width = size;
          circleCanvas.height = size;
          
          ctx.beginPath();
          ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();
          
          ctx.fillStyle = cropSettings.backgroundColor;
          ctx.fillRect(0, 0, size, size);
          
          ctx.drawImage(
            canvas,
            (size - canvas.width) / 2,
            (size - canvas.height) / 2,
            canvas.width,
            canvas.height
          );
          
          finalCanvas = circleCanvas;
        }
        
        const dataUrl = finalCanvas.toDataURL(`image/${cropSettings.format}`, cropSettings.quality);
        localCropData[currentId] = dataUrl;
        
        // Also update the actual cropData state and mark image as cropped
        setCropData(prev => ({ ...prev, [currentId]: dataUrl }));
        
        const updatedImages = [...images];
        updatedImages[currentImageIndex].cropped = true;
        setImages(updatedImages);
        
        console.log(`Current image with ID ${currentId} has been cropped and will be included in the download`);
      }
    }
    
    if (Object.keys(localCropData).length === 0) return;
    
    const zip = new JSZip();
    const imgFolder = zip.folder("cropped-images");
    
    // Add all cropped images to the zip
    let addedCount = 0;
    console.log("Processing images for download:", images.length);
    
    // Debug what images we're processing
    images.forEach((img, index) => {
      console.log(`Image ${index+1}: ID=${img.id}, filename=${img.file.name}, cropped=${img.cropped}, in cropData=${!!localCropData[img.id]}`);
    });
    
    // Process all images for download
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const imageId = image.id;
      
      // Check if this is the current image or if we have crop data for it
      if (i === currentImageIndex || localCropData[imageId]) {
        // Make sure we use the current image data for the current index
        let dataUrl = i === currentImageIndex ? localCropData[currentId] : localCropData[imageId];
        
        if (dataUrl) {
          console.log(`Adding image ${image.file.name} to zip`);
          const base64Data = dataUrl.split(',')[1];
          imgFolder.file(
            `${image.file.name.split('.')[0]}-cropped.${cropSettings.format}`, 
            base64Data, 
            { base64: true }
          );
          addedCount++;
        } else {
          console.warn(`No crop data found for image ${image.file.name}`);
        }
      }
    }
    
    console.log(`Added ${addedCount} images to zip file`);
    
    // Generate and download the zip file
    zip.generateAsync({ type: "blob" }).then(function(content) {
      saveAs(content, "cropped-images.zip");
    });
  };
  
  // Reset all
  const handleReset = () => {
    // Reset state variables
    setImages([]);
    setCurrentImageIndex(0);
    setCropData({});
    setImageCropSettings({});
    setCropHistory({});
    setHistoryIndex({});
    setZoomValue(1);
    setRotationValue(0);
    setCropWidth(0);
    setCropHeight(0);
    setGridOverlay('rule-of-thirds');
    setShapeCrop('rectangle');
  };
  
  // Handle showing a different image in the cropper
  const handleSelectImage = (index) => {
    // Save current crop settings before switching
    if (cropperRef.current?.cropper && images.length > 0 && currentImageIndex < images.length) {
      const currentId = images[currentImageIndex].id;
      const cropper = cropperRef.current.cropper;
      
      setImageCropSettings(prev => ({
        ...prev,
        [currentId]: {
          cropBoxData: cropper.getCropBoxData(),
          canvasData: cropper.getCanvasData(),
          cropData: cropper.getData()
        }
      }));
      
      // Save current filters
      setImageFilters(prev => ({
        ...prev,
        [currentId]: { ...filters }
      }));
    }
    
    setCurrentImageIndex(index);
  };
  
  // Image adjustment functions
  const handleRotateLeft = () => {
    if (cropperRef.current?.cropper) {
      cropperRef.current.cropper.rotate(-90);
      setRotationValue(rotationValue - 90);
    }
  };
  
  const handleRotateRight = () => {
    if (cropperRef.current?.cropper) {
      cropperRef.current.cropper.rotate(90);
      setRotationValue(rotationValue + 90);
    }
  };
  
  const handleFlipHorizontal = () => {
    if (cropperRef.current?.cropper) {
      cropperRef.current.cropper.scaleX(cropperRef.current.cropper.getImageData().scaleX * -1);
    }
  };
  
  const handleFlipVertical = () => {
    if (cropperRef.current?.cropper) {
      cropperRef.current.cropper.scaleY(cropperRef.current.cropper.getImageData().scaleY * -1);
    }
  };
  
  const handleZoomChange = (e) => {
    const value = parseFloat(e.target.value);
    setZoomValue(value);
    
    if (cropperRef.current?.cropper) {
      cropperRef.current.cropper.zoomTo(value);
    }
  };
  
  const handleWidthChange = (e) => {
    const newWidth = parseInt(e.target.value, 10);
    if (isNaN(newWidth) || !cropperRef.current?.cropper) return;
    
    setCropWidth(newWidth);
    
    if (lockDimensions && aspectRatio) {
      const newHeight = Math.round(newWidth / aspectRatio);
      setCropHeight(newHeight);
      
      const data = cropperRef.current.cropper.getData();
      cropperRef.current.cropper.setData({
        ...data,
        width: newWidth,
        height: newHeight
      });
    } else {
      const data = cropperRef.current.cropper.getData();
      cropperRef.current.cropper.setData({
        ...data,
        width: newWidth
      });
    }
  };
  
  const handleHeightChange = (e) => {
    const newHeight = parseInt(e.target.value, 10);
    if (isNaN(newHeight) || !cropperRef.current?.cropper) return;
    
    setCropHeight(newHeight);
    
    if (lockDimensions && aspectRatio) {
      const newWidth = Math.round(newHeight * aspectRatio);
      setCropWidth(newWidth);
      
      const data = cropperRef.current.cropper.getData();
      cropperRef.current.cropper.setData({
        ...data,
        width: newWidth,
        height: newHeight
      });
    } else {
      const data = cropperRef.current.cropper.getData();
      cropperRef.current.cropper.setData({
        ...data,
        height: newHeight
      });
    }
  };
  
  const handleUnitChange = (e) => {
    setMeasurementUnit(e.target.value);
  };
  
  const handleResetImage = () => {
    if (cropperRef.current?.cropper) {
      cropperRef.current.cropper.reset();
      setRotationValue(0);
      setZoomValue(1);
    }
  };
  
  // History management for current image
  const addToHistory = (currentId, cropperData) => {
    const newHistory = cropHistory[currentId] ? 
      cropHistory[currentId].slice(0, (historyIndex[currentId] || 0) + 1) : 
      [];
    
    newHistory.push({
      ...cropperData,
      dimensions: {
        width: cropWidth,
        height: cropHeight,
        unit: measurementUnit
      },
      filters: { ...filters }
    });
    
    setCropHistory(prev => ({
      ...prev,
      [currentId]: newHistory
    }));
    
    setHistoryIndex(prev => ({
      ...prev,
      [currentId]: newHistory.length - 1
    }));
  };
  
  const handleUndo = () => {
    const currentId = images[currentImageIndex]?.id;
    if (!currentId || !cropHistory[currentId] || !cropperRef.current?.cropper) return;
    
    const currentHistoryIndex = historyIndex[currentId] || 0;
    if (currentHistoryIndex <= 0) return;
    
    const newIndex = currentHistoryIndex - 1;
    const historyItem = cropHistory[currentId][newIndex];
    
    const cropper = cropperRef.current.cropper;
    cropper.setCropBoxData(historyItem.cropBoxData);
    cropper.setCanvasData(historyItem.canvasData);
    
    // Restore filters if available
    if (historyItem.filters) {
      setFilters(historyItem.filters);
      
      setImageFilters(prev => ({
        ...prev,
        [currentId]: historyItem.filters
      }));
    }
    
    setHistoryIndex(prev => ({
      ...prev,
      [currentId]: newIndex
    }));
  };
  
  const handleRedo = () => {
    const currentId = images[currentImageIndex]?.id;
    if (!currentId || !cropHistory[currentId] || !cropperRef.current?.cropper) return;
    
    const currentHistoryIndex = historyIndex[currentId] || 0;
    const history = cropHistory[currentId];
    
    if (currentHistoryIndex >= history.length - 1) return;
    
    const newIndex = currentHistoryIndex + 1;
    const historyItem = history[newIndex];
    
    const cropper = cropperRef.current.cropper;
    cropper.setCropBoxData(historyItem.cropBoxData);
    cropper.setCanvasData(historyItem.canvasData);
    
    // Restore filters if available
    if (historyItem.filters) {
      setFilters(historyItem.filters);
      
      setImageFilters(prev => ({
        ...prev,
        [currentId]: historyItem.filters
      }));
    }
    
    setHistoryIndex(prev => ({
      ...prev,
      [currentId]: newIndex
    }));
  };
  
  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('crop-tool-settings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        
        // Apply editor settings
        if (parsedSettings.editor) {
          // Apply aspect ratio
          if (parsedSettings.editor.defaultAspectRatio) {
            handleAspectRatioChange(parsedSettings.editor.defaultAspectRatio);
          }
          
          // Apply default format
          if (parsedSettings.editor.defaultFormat) {
            setCropSettings(prev => ({
              ...prev,
              format: parsedSettings.editor.defaultFormat
            }));
          }
          
          // Apply default quality
          if (parsedSettings.editor.defaultQuality) {
            setCropSettings(prev => ({
              ...prev,
              quality: parsedSettings.editor.defaultQuality
            }));
          }
        }
        
        // Apply appearance settings
        if (parsedSettings.appearance) {
          // Apply grid overlay
          if (parsedSettings.appearance.showGridLines !== undefined) {
            setGridOverlay(parsedSettings.appearance.showGridLines ? 'rule-of-thirds' : 'none');
          }
        }
        
        console.log('Settings loaded from localStorage');
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Save current settings as defaults
  const saveAsDefaults = () => {
    try {
      // First, load existing settings if available
      const savedSettings = localStorage.getItem('crop-tool-settings');
      let settingsToSave = {
        editor: {
          defaultAspectRatio: cropSettings.aspectRatio,
          defaultFormat: cropSettings.format,
          defaultQuality: cropSettings.quality,
          preserveEXIF: true,
          showTransformationValues: true,
          enableAutoSuggestions: true,
        },
        appearance: {
          theme: 'system',
          uiDensity: 'comfortable',
          showGridLines: gridOverlay !== 'none',
          accentColor: '#4285f4',
        },
        keyboard: {
          cropShortcut: 'Ctrl+Enter',
          rotateLeftShortcut: 'Ctrl+[',
          rotateRightShortcut: 'Ctrl+]',
          flipHorizontalShortcut: 'Ctrl+H',
          flipVerticalShortcut: 'Ctrl+V',
          undoShortcut: 'Ctrl+Z',
          redoShortcut: 'Ctrl+Y',
          resetShortcut: 'Ctrl+R',
        },
        advanced: {
          maxImageSize: 20,
          autosaveInterval: 30,
          enableCloudIntegration: false,
          enableAnalytics: false,
          keepOriginalCopy: true,
        },
        privacy: {
          localProcessingOnly: true,
          autoDeleteAfterDownload: true,
          imageMetadataHandling: 'preserve',
        }
      };
      
      if (savedSettings) {
        // Merge with existing settings
        const parsedSettings = JSON.parse(savedSettings);
        settingsToSave = {
          ...parsedSettings,
          editor: {
            ...parsedSettings.editor,
            defaultAspectRatio: cropSettings.aspectRatio,
            defaultFormat: cropSettings.format,
            defaultQuality: cropSettings.quality,
          },
          appearance: {
            ...parsedSettings.appearance,
            showGridLines: gridOverlay !== 'none',
          }
        };
      }
      
      localStorage.setItem('crop-tool-settings', JSON.stringify(settingsToSave));
      alert('Current settings saved as defaults!');
      console.log('Settings saved to localStorage');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings: ' + error.message);
    }
  };
  
  return (
    <div className="batch-processing">
      <div className="batch-container">
        <div className="batch-sidebar">
          <div className="batch-section">
            <h3>Images</h3>
            <Dropzone onDrop={handleDrop} accept={{ 'image/*': [] }} multiple={true}>
              {({ getRootProps, getInputProps }) => (
                <div {...getRootProps()} className="batch-dropzone">
                  <input {...getInputProps()} />
                  <button className="btn">
                    <FaUpload /> Upload Images
                  </button>
                </div>
              )}
            </Dropzone>
            
            <div className="image-list">
              {images.length === 0 ? (
                <div className="no-images">
                  <p>No images uploaded yet</p>
                </div>
              ) : (
                images.map((image, index) => (
                  <div 
                    key={image.id} 
                    className={`image-item ${index === currentImageIndex ? 'active' : ''} ${image.cropped ? 'cropped' : ''}`}
                    onClick={() => handleSelectImage(index)}
                  >
                    <div className="image-thumbnail">
                      <img src={image.src} alt={`Thumbnail ${index}`} />
                    </div>
                    <div className="image-info">
                      <span className="image-name">{image.file.name}</span>
                      <span className="image-status">
                        {image.cropped ? 'Cropped' : 'Not Cropped'}
                      </span>
                    </div>
                    <button 
                      className="btn-icon remove-image" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(index);
                      }}
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {images.length > 0 && (
            <>
              <div className="batch-section">
                <h3>Crop Settings</h3>
                <div className="settings-options">
                  <div className="option-group">
                    <label>Aspect Ratio:</label>
                    <select 
                      value={cropSettings.aspectRatio}
                      onChange={(e) => handleAspectRatioChange(e.target.value)}
                    >
                      <option value="free">Free</option>
                      <option value="1:1">1:1 (Square)</option>
                      <option value="4:3">4:3</option>
                      <option value="16:9">16:9</option>
                      <option value="3:4">3:4</option>
                      <option value="9:16">9:16</option>
                    </select>
                  </div>
                  
                  <div className="option-group dimensions-group">
                    <div className="dimensions-header">
                      <label>Dimensions:</label>
                      <div className="lock-dimensions">
                        <input
                          type="checkbox"
                          id="lockDimensions"
                          checked={lockDimensions}
                          onChange={(e) => setLockDimensions(e.target.checked)}
                        />
                        <label htmlFor="lockDimensions">Lock ratio</label>
                      </div>
                    </div>
                    <div className="dimensions-inputs">
                      <div className="dimension-input">
                        <label>W:</label>
                        <input
                          type="number"
                          value={cropWidth}
                          onChange={handleWidthChange}
                          min="1"
                        />
                      </div>
                      <div className="dimension-input">
                        <label>H:</label>
                        <input
                          type="number"
                          value={cropHeight}
                          onChange={handleHeightChange}
                          min="1"
                        />
                      </div>
                      <select 
                        value={measurementUnit}
                        onChange={handleUnitChange}
                      >
                        <option value="px">px</option>
                        <option value="in">in</option>
                        <option value="cm">cm</option>
                        <option value="mm">mm</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="option-group">
                    <label>Shape:</label>
                    <select 
                      value={shapeCrop}
                      onChange={(e) => setShapeCrop(e.target.value)}
                    >
                      <option value="rectangle">Rectangle</option>
                      <option value="circle">Circle</option>
                    </select>
                  </div>
                  
                  <div className="option-group">
                    <label>Grid Overlay:</label>
                    <select 
                      value={gridOverlay}
                      onChange={(e) => setGridOverlay(e.target.value)}
                    >
                      <option value="rule-of-thirds">Rule of Thirds</option>
                      <option value="grid">Grid</option>
                      <option value="golden-ratio">Golden Ratio</option>
                      <option value="none">None</option>
                    </select>
                  </div>
                  
                  <div className="option-group">
                    <label>Background Color:</label>
                    <div className="color-picker-container">
                      <div 
                        className="color-preview" 
                        style={{ backgroundColor: cropSettings.backgroundColor }}
                        onClick={() => setColorPickerVisible(!colorPickerVisible)}
                      ></div>
                      {colorPickerVisible && (
                        <div className="color-picker-popover">
                          <div 
                            className="color-picker-cover" 
                            onClick={() => setColorPickerVisible(false)}
                          ></div>
                          <SketchPicker
                            color={cropSettings.backgroundColor}
                            onChange={(color) => setCropSettings({...cropSettings, backgroundColor: color.hex})}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="option-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={cropSettings.applyToAll}
                        onChange={(e) => setCropSettings({...cropSettings, applyToAll: e.target.checked})}
                      />
                      Apply crop to all images
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="batch-section">
                <h3>Image Adjustments</h3>
                <div className="toolbar-buttons">
                  <button className="btn btn-small" onClick={handleRotateLeft}>
                    <MdRotate90DegreesCcw /> Left
                  </button>
                  <button className="btn btn-small" onClick={handleRotateRight}>
                    <MdRotate90DegreesCcw style={{ transform: 'scaleX(-1)' }} /> Right
                  </button>
                  <button className="btn btn-small" onClick={handleFlipHorizontal}>
                    <MdFlip /> Flip H
                  </button>
                  <button className="btn btn-small" onClick={handleFlipVertical}>
                    <MdFlip style={{ transform: 'rotate(90deg)' }} /> Flip V
                  </button>
                  <button className="btn btn-small" onClick={handleResetImage}>
                    Reset
                  </button>
                </div>
                <div className="zoom-control">
                  <label>Zoom: {zoomValue.toFixed(1)}x</label>
                  <input
                    type="range"
                    min="0.1"
                    max="3"
                    step="0.1"
                    value={zoomValue}
                    onChange={handleZoomChange}
                  />
                </div>
              </div>
              
              <div className="batch-section">
                <h3>History</h3>
                <div className="toolbar-buttons">
                  <button 
                    className="btn btn-small" 
                    onClick={handleUndo}
                    disabled={!images[currentImageIndex]?.id || !(historyIndex[images[currentImageIndex]?.id] > 0)}
                  >
                    <FaUndo /> Undo
                  </button>
                  <button 
                    className="btn btn-small" 
                    onClick={handleRedo}
                    disabled={!images[currentImageIndex]?.id || 
                      !(historyIndex[images[currentImageIndex]?.id] < (cropHistory[images[currentImageIndex]?.id]?.length || 0) - 1)}
                  >
                    <FaRedo /> Redo
                  </button>
                </div>
              </div>
              
              <div className="batch-section">
                <h3>Export Options</h3>
                <button
                  className="btn settings-toggle"
                  onClick={() => setShowSettings(!showSettings)}
                >
                  <FaInfoCircle /> {showSettings ? 'Hide Settings' : 'Show Settings'}
                </button>
                
                {showSettings && (
                  <div className="export-settings">
                    <div className="option-group">
                      <label>Format:</label>
                      <select 
                        value={cropSettings.format}
                        onChange={(e) => setCropSettings({...cropSettings, format: e.target.value})}
                      >
                        <option value="png">PNG</option>
                        <option value="jpeg">JPEG</option>
                        <option value="webp">WebP</option>
                      </select>
                    </div>
                    
                    {cropSettings.format !== 'png' && (
                      <div className="option-group">
                        <label>Quality: {Math.round(cropSettings.quality * 100)}%</label>
                        <input
                          type="range"
                          min="0.1"
                          max="1"
                          step="0.1"
                          value={cropSettings.quality}
                          onChange={(e) => setCropSettings({...cropSettings, quality: parseFloat(e.target.value)})}
                        />
                      </div>
                    )}
                    
                    <div className="option-group save-settings">
                      <button
                        className="btn btn-small"
                        onClick={saveAsDefaults}
                        title="Save current settings as default for all sessions"
                      >
                        <FaSave /> Save As Default Settings
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="batch-actions">
                  <button 
                    className="btn btn-primary" 
                    onClick={handleCrop}
                    disabled={images.length === 0 || processing}
                  >
                    <FaCropAlt /> Crop Image
                  </button>
                  <button 
                    className="btn" 
                    onClick={handleDownloadAll}
                    disabled={!images.some(img => img.cropped) || processing}
                  >
                    <FaCloudDownloadAlt /> Download All
                  </button>
                  <button 
                    className="btn btn-small" 
                    onClick={handleReset}
                    title="Clear all images and reset"
                  >
                    Reset All
                  </button>
                </div>
              </div>
              
              {processing && (
                <div className="processing-status">
                  <p>Processing images: {processedCount}/{images.length - 1}</p>
                  <div className="progress-bar">
                    <div 
                      className="progress" 
                      style={{width: `${(processedCount / (images.length - 1)) * 100}%`}}
                    ></div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        
        <div className="batch-main">
          {images.length === 0 ? (
            <div className="upload-prompt">
              <h2>Batch Image Processing</h2>
              <p>Upload multiple images to crop them with the same settings.</p>
              <p>Perfect for processing product photos, gallery images, or any batch of images that need consistent cropping.</p>
            </div>
          ) : (
            <div className={`cropper-container ${gridOverlay}`}>
              <Cropper
                ref={cropperRef}
                src={images[currentImageIndex]?.src}
                style={{ height: '100%', width: '100%' }}
                aspectRatio={aspectRatio}
                guides={true}
                autoCropArea={1}
                background={false}
                responsive={true}
                checkOrientation={true}
                onInitialized={(instance) => {
                  setTimeout(handleCropperReady, 100);
                }}
                viewMode={1}
                minCropBoxHeight={10}
                minCropBoxWidth={10}
                zoomOnWheel={false}
              />
              
              <div className="image-pagination">
                <span>{currentImageIndex + 1} of {images.length}</span>
                <div className="navigation-buttons">
                  <button 
                    className="btn-small" 
                    onClick={() => handleSelectImage(Math.max(0, currentImageIndex - 1))}
                    disabled={currentImageIndex === 0}
                  >
                    Previous
                  </button>
                  <button 
                    className="btn-small" 
                    onClick={() => handleSelectImage(Math.min(images.length - 1, currentImageIndex + 1))}
                    disabled={currentImageIndex === images.length - 1}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Add a button to toggle filters panel */}
      <button 
        className={`toolbar-button ${showFilterPanel ? 'active' : ''}`} 
        onClick={() => setShowFilterPanel(!showFilterPanel)}
      >
        <FaAdjust /> <span>Filters</span>
      </button>
      
      {/* Add the filters panel */}
      {showFilterPanel && images.length > 0 && (
        <div className="filter-panel">
          <FilterControls 
            initialFilters={filters}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </div>
      )}
    </div>
  );
};

export default BatchProcessing; 