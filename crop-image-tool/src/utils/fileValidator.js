import { acceptedFileTypes, maxFileSize } from '../config/editorConfig';

/**
 * Validates a file based on type and size
 * @param {File} file - The file to validate
 * @returns {Object} Object containing validation status and any error messages
 */
export const validateFile = (file) => {
  if (!file) {
    return {
      isValid: false,
      error: 'No file provided'
    };
  }

  // Check file type
  if (!acceptedFileTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `Invalid file type. Accepted types: ${acceptedFileTypes.join(', ')}`
    };
  }

  // Check file size
  if (file.size > maxFileSize) {
    const maxSizeMB = maxFileSize / (1024 * 1024);
    return {
      isValid: false,
      error: `File size exceeds the maximum limit of ${maxSizeMB}MB`
    };
  }

  return {
    isValid: true,
    error: null
  };
};

/**
 * Validates multiple files
 * @param {FileList|File[]} files - The files to validate
 * @returns {Object} Object containing validation results for each file
 */
export const validateMultipleFiles = (files) => {
  const results = {
    allValid: true,
    validFiles: [],
    invalidFiles: [],
    errors: []
  };

  Array.from(files).forEach((file, index) => {
    const validation = validateFile(file);
    
    if (validation.isValid) {
      results.validFiles.push(file);
    } else {
      results.allValid = false;
      results.invalidFiles.push(file);
      results.errors.push({
        fileName: file.name,
        error: validation.error,
        index
      });
    }
  });

  return results;
};

/**
 * Reads a file as a data URL
 * @param {File} file - The file to read
 * @returns {Promise<string>} A promise that resolves with the data URL
 */
export const readFileAsDataURL = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read file'));
    
    reader.readAsDataURL(file);
  });
};

/**
 * Generates a unique filename for downloaded files
 * @param {string} originalName - The original filename
 * @param {string} prefix - Optional prefix to add to the filename
 * @returns {string} A unique filename
 */
export const generateUniqueFilename = (originalName, prefix = 'cropped') => {
  const timestamp = new Date().getTime();
  const extension = originalName.split('.').pop();
  const baseName = originalName.substring(0, originalName.lastIndexOf('.'));
  
  return `${prefix}-${baseName}-${timestamp}.${extension}`;
}; 