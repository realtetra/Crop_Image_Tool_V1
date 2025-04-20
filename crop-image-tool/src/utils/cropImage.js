/**
 * Utility function to crop an image based on provided crop settings
 * @param {HTMLImageElement} image - The image element to crop
 * @param {Object} cropSettings - The crop settings
 * @param {number} cropSettings.x - The x coordinate of the top-left corner of the crop box
 * @param {number} cropSettings.y - The y coordinate of the top-left corner of the crop box
 * @param {number} cropSettings.width - The width of the crop box
 * @param {number} cropSettings.height - The height of the crop box
 * @param {number} [cropSettings.rotate=0] - The rotation angle of the image
 * @param {number} [cropSettings.scaleX=1] - The horizontal scaling of the image
 * @param {number} [cropSettings.scaleY=1] - The vertical scaling of the image
 * @param {Object} [options] - Additional options
 * @param {string} [options.format='image/jpeg'] - The format of the output image
 * @param {number} [options.quality=0.9] - The quality of the output image (0-1)
 * @param {boolean} [options.circular=false] - Whether to crop the image in a circular shape
 * @returns {Promise<string>} A promise that resolves with the data URL of the cropped image
 */
export const cropImage = (image, cropSettings, options = {}) => {
  return new Promise((resolve, reject) => {
    try {
      const {
        x,
        y,
        width,
        height,
        rotate = 0,
        scaleX = 1,
        scaleY = 1
      } = cropSettings;
      
      const {
        format = 'image/jpeg',
        quality = 0.9,
        circular = false
      } = options;

      // Create canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Apply circular clipping if requested
      if (circular) {
        ctx.beginPath();
        const radius = Math.min(width, height) / 2;
        const centerX = width / 2;
        const centerY = height / 2;
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.clip();
      }

      // Save context for transformations
      ctx.save();
      
      // Translate to center for rotation
      ctx.translate(width / 2, height / 2);
      
      // Apply rotation
      if (rotate !== 0) {
        ctx.rotate((rotate * Math.PI) / 180);
      }
      
      // Apply scaling
      if (scaleX !== 1 || scaleY !== 1) {
        ctx.scale(scaleX, scaleY);
      }
      
      // Draw the image at the correct position
      ctx.drawImage(
        image,
        x, // Source x
        y, // Source y
        width, // Source width
        height, // Source height
        -width / 2, // Destination x
        -height / 2, // Destination y
        width, // Destination width
        height // Destination height
      );
      
      // Restore context
      ctx.restore();
      
      // Convert canvas to data URL
      const dataUrl = canvas.toDataURL(format, quality);
      resolve(dataUrl);
    } catch (error) {
      reject({
        type: 'CROP_ERROR',
        message: 'Failed to crop image',
        details: error
      });
    }
  });
};

/**
 * Utility function to check if the browser supports the required features for image cropping
 * @returns {boolean} Whether the browser supports the required features
 */
export const checkBrowserSupport = () => {
  return (
    typeof document !== 'undefined' &&
    typeof document.createElement === 'function' &&
    typeof HTMLCanvasElement !== 'undefined' &&
    typeof HTMLImageElement !== 'undefined'
  );
};

/**
 * Utility function to load an image from a URL or File
 * @param {string|File} source - The image source (URL string or File object)
 * @returns {Promise<HTMLImageElement>} A promise that resolves with the loaded image element
 */
export const loadImage = (source) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    
    image.onload = () => resolve(image);
    image.onerror = (error) => reject({
      type: 'IMAGE_LOAD_ERROR',
      message: 'Failed to load image',
      details: error
    });
    
    if (typeof source === 'string') {
      // Source is a URL
      image.src = source;
    } else if (source instanceof File) {
      // Source is a File object
      const reader = new FileReader();
      reader.onload = (e) => {
        image.src = e.target.result;
      };
      reader.onerror = (error) => reject({
        type: 'FILE_READ_ERROR',
        message: 'Failed to read file',
        details: error
      });
      reader.readAsDataURL(source);
    } else {
      reject({
        type: 'INVALID_SOURCE',
        message: 'Source must be a URL string or File object'
      });
    }
  });
};

/**
 * Utility function to download a data URL as a file
 * @param {string} dataUrl - The data URL to download
 * @param {string} [filename='cropped-image.jpg'] - The filename to use for the download
 */
export const downloadImage = (dataUrl, filename = 'cropped-image.jpg') => {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default {
  cropImage,
  checkBrowserSupport,
  loadImage,
  downloadImage
}; 