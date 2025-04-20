import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

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

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

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