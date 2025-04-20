// Main entry point for the library
import ImageEditor from './components/ImageEditor';
import BatchProcessing from './components/BatchProcessing';
import CropperComponent from './components/CropperComponent';
import FilterControls from './components/FilterControls';
import SimpleExample from './components/SimpleExample';

// Re-export config
import * as config from './config/editorConfig';

// Re-export all utilities
import * as utils from './utils';

export {
  // Components
  ImageEditor,
  BatchProcessing,
  CropperComponent,
  FilterControls,
  SimpleExample,
  
  // Configuration
  config,
  
  // Utilities
  utils
};

export default ImageEditor; 