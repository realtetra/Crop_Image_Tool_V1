/**
 * Configuration for image editor and processing
 */

// Accepted file types
export const acceptedFileTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

// Maximum file size in bytes (default: 10MB)
export const maxFileSize = 10 * 1024 * 1024; 

// Default crop aspect ratio (null for freeform)
export const defaultAspectRatio = null;

// Output image format
export const defaultOutputFormat = 'jpeg';

// Output image quality (0-1)
export const outputQuality = 0.8;

// Max dimensions for preview images
export const previewDimensions = {
  width: 300,
  height: 300
};

// Interface configuration
export const uiConfig = {
  // Crop grid overlay display
  cropGrid: {
    enabled: true,
    color: 'rgba(255, 255, 255, 0.4)'
  },
  
  // Zoom settings
  zoom: {
    min: 0.5,
    max: 3,
    step: 0.1,
    defaultValue: 1
  },
  
  // Available aspect ratios in cropper
  aspectRatios: [
    { label: 'Free', value: null },
    { label: '1:1', value: 1 },
    { label: '4:3', value: 4/3 },
    { label: '16:9', value: 16/9 },
    { label: '3:2', value: 3/2 }
  ]
};

// Batch processing settings
export const batchConfig = {
  // Maximum number of images allowed in batch mode
  maxBatchImages: 50,
  
  // Default file name for downloaded batch
  defaultBatchName: 'cropped_images'
};

// Default filter values
export const defaultFilters = {
  brightness: 100, // 100% is normal
  contrast: 100,   // 100% is normal
  saturation: 100, // 100% is normal
  blur: 0          // 0 is no blur
}; 

// Advanced filter configuration
export const advancedFilters = {
  // Defines which advanced filters are enabled in the UI
  enabled: true,
  
  // Default values for advanced filters
  defaults: {
    grayscale: 0,     // 0 = off, 100 = full grayscale
    sepia: 0,         // 0 = off, 100 = full sepia effect
    vignette: {
      intensity: 0,   // 0 = off, 100 = max vignette
      color: '#000000' // Default vignette color
    },
    hue: 0,           // 0-360 degrees (0 = no change)
    duotone: {
      enabled: false,
      colorLight: '#ffffff',
      colorDark: '#000000',
      intensity: 50
    },
    sharpen: 0,       // 0 = off, 100 = max sharpen
    noise: {
      amount: 0,      // 0 = off, 100 = maximum noise
      monochrome: true // true = monochrome noise, false = color noise
    }
  },
  
  // Performance settings for advanced filters
  performance: {
    previewResolution: 'medium', // 'low', 'medium', 'high' or 'original'
    applyOnChange: true, // whether to apply filters immediately when slider changes
    debounceTime: 150    // ms to wait after slider stops before applying (when applyOnChange is false)
  }
}; 