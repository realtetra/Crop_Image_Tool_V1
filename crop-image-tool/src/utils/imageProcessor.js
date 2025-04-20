import { defaultOutputFormat, outputQuality } from '../config/editorConfig';

/**
 * Creates a cropped image from the original image and crop data
 * 
 * @param {HTMLImageElement} image - The source image element
 * @param {Object} cropData - The crop data (x, y, width, height)
 * @param {Object} options - Additional options for processing
 * @returns {Promise<Blob>} A promise that resolves with the cropped image blob
 */
export const cropImage = (image, cropData, options = {}) => {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      
      // Set dimensions for the output canvas
      const pixelRatio = window.devicePixelRatio || 1;
      const { x, y, width, height } = cropData;
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw the cropped portion to the canvas
      ctx.drawImage(
        image,
        x, y, width, height,
        0, 0, width, height
      );
      
      // Apply any additional processing if needed
      if (options.applyFilters) {
        applyFilters(ctx, canvas.width, canvas.height, options.filters);
      }
      
      // Convert to blob with specified format and quality
      const format = options.format || defaultOutputFormat;
      const quality = options.quality || outputQuality;
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create image blob'));
          }
        },
        `image/${format}`,
        quality
      );
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Applies filters to the canvas context
 * 
 * @param {CanvasRenderingContext2D} ctx - The canvas context to apply filters to
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {Object} filters - Filter values to apply
 * @returns {void}
 */
export const applyFilters = (ctx, width, height, filters) => {
  if (!filters) return;
  
  // Save current canvas content
  const imageData = ctx.getImageData(0, 0, width, height);
  
  // Create a new canvas to apply filters
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext('2d');
  
  // Draw the original image to the temp canvas
  tempCtx.putImageData(imageData, 0, 0);
  
  // Clear the original canvas
  ctx.clearRect(0, 0, width, height);
  
  // Apply CSS filters using the filter property
  ctx.filter = getFilterString(filters);
  
  // Draw the temp canvas back to the original with filters applied
  ctx.drawImage(tempCanvas, 0, 0);
  
  // Reset filters
  ctx.filter = 'none';
};

/**
 * Generates a CSS filter string from filter values
 * 
 * @param {Object} filters - Filter values
 * @returns {string} CSS filter string
 */
export const getFilterString = (filters) => {
  if (!filters) return 'none';
  
  return `brightness(${filters.brightness}%) 
          contrast(${filters.contrast}%) 
          saturate(${filters.saturation}%) 
          blur(${filters.blur}px)`;
};

/**
 * Resizes an image to specified dimensions
 * 
 * @param {HTMLImageElement} image - The source image element
 * @param {Object} dimensions - Target dimensions { width, height }
 * @param {Object} options - Additional options for processing
 * @returns {Promise<Blob>} A promise that resolves with the resized image blob
 */
export const resizeImage = (image, dimensions, options = {}) => {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      
      const { width, height } = dimensions;
      canvas.width = width;
      canvas.height = height;
      
      // Draw the image at the new size
      ctx.drawImage(image, 0, 0, width, height);
      
      // Convert to blob with specified format and quality
      const format = options.format || defaultOutputFormat;
      const quality = options.quality || outputQuality;
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create image blob'));
          }
        },
        `image/${format}`,
        quality
      );
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Rotates an image by the given angle
 * 
 * @param {HTMLImageElement} image - The source image element
 * @param {number} angle - Rotation angle in degrees
 * @param {Object} options - Additional options for processing
 * @returns {Promise<Blob>} A promise that resolves with the rotated image blob
 */
export const rotateImage = (image, angle, options = {}) => {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      
      const radians = (angle * Math.PI) / 180;
      const imgWidth = image.width;
      const imgHeight = image.height;
      
      // Calculate dimensions for rotated image
      const rotatedWidth = Math.abs(imgWidth * Math.cos(radians)) + Math.abs(imgHeight * Math.sin(radians));
      const rotatedHeight = Math.abs(imgWidth * Math.sin(radians)) + Math.abs(imgHeight * Math.cos(radians));
      
      canvas.width = rotatedWidth;
      canvas.height = rotatedHeight;
      
      // Move to center of canvas
      ctx.translate(rotatedWidth / 2, rotatedHeight / 2);
      
      // Rotate the canvas
      ctx.rotate(radians);
      
      // Draw the image, centered
      ctx.drawImage(image, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);
      
      // Convert to blob with specified format and quality
      const format = options.format || defaultOutputFormat;
      const quality = options.quality || outputQuality;
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create image blob'));
          }
        },
        `image/${format}`,
        quality
      );
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Creates a canvas element from an image with the specified crop area
 * @param {HTMLImageElement} image - The source image element
 * @param {Object} crop - The crop area coordinates and dimensions
 * @param {number} rotation - Rotation angle in degrees
 * @param {string} cropShape - Shape of the crop ('rect' or 'round')
 * @returns {HTMLCanvasElement} The created canvas with the cropped image
 */
export const createCroppedCanvas = (image, crop, rotation = 0, cropShape = 'rect') => {
  if (!image || !crop || !crop.width || !crop.height) {
    console.error('Invalid image or crop data');
    return null;
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Set canvas dimensions to match the cropped area
  canvas.width = crop.width;
  canvas.height = crop.height;

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // If we need a round crop, create a circular clip path
  if (cropShape === 'round') {
    ctx.beginPath();
    const radius = Math.min(canvas.width, canvas.height) / 2;
    ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, 2 * Math.PI);
    ctx.clip();
  }

  // Apply rotation if needed
  if (rotation) {
    // Save context before transformations
    ctx.save();
    
    // Move to the center of the canvas
    ctx.translate(canvas.width / 2, canvas.height / 2);
    
    // Convert degrees to radians and rotate
    ctx.rotate((rotation * Math.PI) / 180);
    
    // Move back to the original position
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
  }

  // Draw the image to the canvas with the crop applied
  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height
  );

  // Restore context if rotation was applied
  if (rotation) {
    ctx.restore();
  }

  return canvas;
};

/**
 * Converts a canvas to a blob
 * @param {HTMLCanvasElement} canvas - The canvas to convert
 * @param {string} format - The output format (image/jpeg, image/png, etc.)
 * @param {number} quality - The output quality (0-1)
 * @returns {Promise<Blob>} Promise resolving to the image blob
 */
export const canvasToBlob = (canvas, format = defaultOutputFormat, quality = outputQuality) => {
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Canvas to Blob conversion failed'));
          }
        },
        format,
        quality
      );
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Creates a cropped image and returns it as a blob
 * @param {HTMLImageElement} image - The source image element
 * @param {Object} crop - The crop area coordinates and dimensions
 * @param {number} rotation - Rotation angle in degrees
 * @param {string} cropShape - Shape of the crop ('rect' or 'round')
 * @returns {Promise<Blob>} Promise resolving to the cropped image blob
 */
export const getCroppedImg = async (image, crop, rotation = 0, cropShape = 'rect') => {
  try {
    const canvas = createCroppedCanvas(image, crop, rotation, cropShape);
    if (!canvas) {
      throw new Error('Failed to create canvas');
    }
    return await canvasToBlob(canvas);
  } catch (error) {
    console.error('Error cropping image:', error);
    throw error;
  }
};

/**
 * Generates a download for the given blob
 * @param {Blob} blob - The blob to download
 * @param {string} fileName - The filename for the download
 */
export const downloadBlob = (blob, fileName) => {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
  
  // Clean up the object URL to avoid memory leaks
  setTimeout(() => {
    URL.revokeObjectURL(link.href);
  }, 100);
};

/**
 * Gets the natural dimensions of an image
 * @param {string} src - The image URL or data URL
 * @returns {Promise<Object>} Promise resolving to an object with width and height
 */
export const getImageDimensions = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    };
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    img.src = src;
  });
}; 