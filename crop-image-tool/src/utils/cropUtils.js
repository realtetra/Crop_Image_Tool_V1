/**
 * Utility functions for image cropping and downloading
 */
import { defaultFilters } from '../config/editorConfig';
import { getFilterString } from './imageProcessor';

/**
 * Creates a cropped image based on the provided parameters
 * @param {string} imageSrc - Source URL of the image
 * @param {Object} cropData - Crop data with x, y, width, height, and rotation
 * @param {Object} [filters] - Optional filter settings to apply
 * @returns {Promise<string>} - Promise resolving to the cropped image data URL
 */
export const createCroppedImage = async (imageSrc, cropData, filters = null) => {
  const { x, y, width, height, rotation = 0 } = cropData;
  const imageFilters = filters || { ...defaultFilters };
  
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Calculate the size of the cropped image
      const maxSize = Math.max(image.width, image.height);
      const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));
      
      // Set dimensions to the cropped size
      canvas.width = width;
      canvas.height = height;
      
      // Draw the rotated and cropped image
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
      
      // Move to center of canvas
      ctx.translate(width / 2, height / 2);
      // Rotate around the center
      ctx.rotate((rotation * Math.PI) / 180);
      // Move back to top left of canvas
      ctx.translate(-safeArea / 2, -safeArea / 2);
      
      // Draw the original image
      ctx.drawImage(
        image,
        safeArea / 2 - image.width * 0.5 - x,
        safeArea / 2 - image.height * 0.5 - y,
        image.width,
        image.height
      );
      
      // Apply filters if provided
      if (filters) {
        // Create a temporary canvas for applying filters
        const filteredCanvas = document.createElement('canvas');
        filteredCanvas.width = width;
        filteredCanvas.height = height;
        const filteredCtx = filteredCanvas.getContext('2d');
        
        // Draw the original canvas to the filtered canvas
        filteredCtx.drawImage(canvas, 0, 0);
        
        // Clear the original canvas
        ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
        ctx.clearRect(0, 0, width, height);
        
        // Apply filters
        ctx.filter = getFilterString(imageFilters);
        ctx.drawImage(filteredCanvas, 0, 0);
        ctx.filter = 'none'; // Reset filters
      }
      
      // Get the data URL from the canvas
      const dataUrl = canvas.toDataURL('image/jpeg');
      resolve(dataUrl);
    };
    
    image.onerror = (error) => {
      reject(error);
    };
    
    image.src = imageSrc;
  });
};

/**
 * Downloads an image with the given filename
 * @param {string} imageUrl - URL or data URL of the image to download
 * @param {string} fileName - File name for the downloaded image
 */
export const downloadImage = (imageUrl, fileName = 'cropped-image.jpg') => {
  const link = document.createElement('a');
  link.download = fileName;
  link.href = imageUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Reads a file as a data URL
 * 
 * @param {File} file - File object to read
 * @returns {Promise<string>} - Promise resolving to data URL
 */
export const readFileAsDataUrl = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      resolve(reader.result);
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
}; 