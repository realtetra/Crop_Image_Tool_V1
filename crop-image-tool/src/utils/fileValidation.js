import { maxFileSize, acceptedFileTypes } from '../config/editorConfig';

/**
 * Validates if the file is an acceptable image file
 * @param {File} file - The file to validate
 * @returns {Object} Object containing validation result and error message if any
 */
export const validateImageFile = (file) => {
  // Check if file exists
  if (!file) {
    return {
      isValid: false,
      errorMessage: 'No file selected'
    };
  }

  // Check file type
  const fileType = file.type;
  const acceptedTypes = acceptedFileTypes.split(',').map(type => type.trim());
  
  if (!acceptedTypes.includes(fileType)) {
    return {
      isValid: false,
      errorMessage: `File type ${fileType} is not supported. Please use ${acceptedFileTypes}`
    };
  }

  // Check file size
  if (file.size > maxFileSize) {
    const maxSizeMB = Math.round(maxFileSize / (1024 * 1024));
    return {
      isValid: false,
      errorMessage: `File size exceeds the maximum allowed size of ${maxSizeMB}MB`
    };
  }

  return {
    isValid: true,
    errorMessage: null
  };
};

/**
 * Validates multiple image files
 * @param {FileList|Array} files - The files to validate
 * @returns {Object} Object containing arrays of valid files and error messages
 */
export const validateMultipleImages = (files) => {
  const validFiles = [];
  const errorMessages = [];

  Array.from(files).forEach(file => {
    const validation = validateImageFile(file);
    
    if (validation.isValid) {
      validFiles.push(file);
    } else {
      errorMessages.push(`${file.name}: ${validation.errorMessage}`);
    }
  });

  return {
    validFiles,
    errorMessages,
    isValid: errorMessages.length === 0
  };
};

/**
 * Reads a file and returns a promise with the data URL
 * @param {File} file - The file to read
 * @returns {Promise<string>} Promise resolving to the data URL
 */
export const readFileAsDataURL = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read file'));
    
    reader.readAsDataURL(file);
  });
}; 