import React, { useState } from 'react';
import { FaQuestionCircle, FaKeyboard, FaCropAlt, FaCamera, FaFileUpload, FaBug } from 'react-icons/fa';
import './Help.css';

const Help = () => {
  const [activeTab, setActiveTab] = useState('getting-started');
  
  const renderContent = () => {
    switch (activeTab) {
      case 'getting-started':
        return (
          <div className="help-content">
            <h2>Getting Started with Image Crop Tool</h2>
            
            <div className="help-section">
              <h3>Introduction</h3>
              <p>
                Image Crop Tool is a powerful, web-based application designed to help you crop and edit images with precision.
                Whether you need to create perfect squares for social media, remove unwanted portions of an image, or batch process multiple images,
                our tool provides the features you need.
              </p>
            </div>
            
            <div className="help-section">
              <h3>Basic Workflow</h3>
              <ol className="workflow-steps">
                <li>
                  <strong>Upload an image</strong> - Drag and drop an image file, use the upload button, or capture from your webcam.
                </li>
                <li>
                  <strong>Adjust the crop area</strong> - Drag the corners or edges of the crop box to select the area you want to keep.
                </li>
                <li>
                  <strong>Fine-tune your selection</strong> - Use the options panel to set aspect ratio, rotate, or apply other adjustments.
                </li>
                <li>
                  <strong>Crop the image</strong> - Click the "Crop Image" button to apply your changes.
                </li>
                <li>
                  <strong>Download the result</strong> - Save your cropped image in your preferred format.
                </li>
              </ol>
            </div>
            
            <div className="help-section">
              <h3>Features Overview</h3>
              <ul className="features-list">
                <li><strong>Interactive cropping</strong> with resizable and movable selection</li>
                <li><strong>Aspect ratio presets</strong> for common formats (1:1, 4:3, 16:9, etc.)</li>
                <li><strong>Rotation and flipping</strong> capabilities</li>
                <li><strong>Grid overlays</strong> (rule of thirds, golden ratio) for better composition</li>
                <li><strong>Non-rectangular crops</strong> including circular options</li>
                <li><strong>Batch processing</strong> for multiple images</li>
                <li><strong>Multiple export formats</strong> (PNG, JPEG, WebP)</li>
              </ul>
            </div>
          </div>
        );
      
      case 'upload-options':
        return (
          <div className="help-content">
            <h2>Upload Options</h2>
            
            <div className="help-section">
              <h3>Local File Upload</h3>
              <p>
                You can upload images from your local device in several ways:
              </p>
              <ul>
                <li><strong>Drag and drop</strong> - Simply drag image files from your computer and drop them onto the upload area.</li>
                <li><strong>Upload button</strong> - Click the "Upload" button to open a file browser and select images.</li>
                <li><strong>Paste from clipboard</strong> - Copy an image and press Ctrl+V (or Cmd+V on Mac) when the editor is active.</li>
              </ul>
              <p>Supported file formats include: JPEG, PNG, GIF, BMP, TIFF, and WebP.</p>
            </div>
            
            <div className="help-section">
              <h3>Webcam Capture</h3>
              <p>
                To capture an image using your webcam:
              </p>
              <ol>
                <li>Click the "Webcam" button in the upload section.</li>
                <li>Allow access to your camera when prompted by your browser.</li>
                <li>Position yourself or the subject as desired.</li>
                <li>The image will be captured and loaded into the editor automatically.</li>
              </ol>
              <p><strong>Note:</strong> This feature requires a working webcam and browser permission.</p>
            </div>
            
            <div className="help-section">
              <h3>URL Import</h3>
              <p>
                To import an image from a URL:
              </p>
              <ol>
                <li>Click the "Import URL" button.</li>
                <li>Enter the full URL of the image in the prompt.</li>
                <li>Click OK to load the image.</li>
              </ol>
              <p>
                <strong>Important:</strong> Some images may not load due to Cross-Origin Resource Sharing (CORS) restrictions.
                For best results, ensure the image source allows cross-origin access.
              </p>
            </div>
          </div>
        );
      
      case 'cropping-features':
        return (
          <div className="help-content">
            <h2>Cropping Features</h2>
            
            <div className="help-section">
              <h3>Basic Cropping</h3>
              <p>
                Once an image is loaded, a crop box will appear over the image. You can:
              </p>
              <ul>
                <li><strong>Resize the crop box</strong> by dragging any of the handles on the edges or corners.</li>
                <li><strong>Move the crop box</strong> by clicking inside it and dragging.</li>
                <li><strong>Adjust with precision</strong> using keyboard arrow keys for fine-tuning.</li>
              </ul>
            </div>
            
            <div className="help-section">
              <h3>Aspect Ratio Options</h3>
              <p>
                The aspect ratio determines the shape of your crop. Options include:
              </p>
              <ul>
                <li><strong>Free</strong> - No constraints, crop to any dimensions</li>
                <li><strong>1:1 (Square)</strong> - Perfect for profile pictures and Instagram posts</li>
                <li><strong>4:3</strong> - Standard photo ratio</li>
                <li><strong>16:9</strong> - Widescreen format for videos and presentations</li>
                <li><strong>3:4</strong> - Portrait orientation of the 4:3 ratio</li>
                <li><strong>9:16</strong> - Portrait orientation for mobile screens, stories</li>
              </ul>
              <p>
                Select an aspect ratio from the dropdown menu to constrain your crop to those proportions.
              </p>
            </div>
            
            <div className="help-section">
              <h3>Grid Overlays</h3>
              <p>
                Grid overlays help you compose your crop more effectively:
              </p>
              <ul>
                <li><strong>Rule of Thirds</strong> - Divides the image into nine equal parts</li>
                <li><strong>Grid</strong> - Simple square grid for alignment</li>
                <li><strong>Golden Ratio</strong> - Based on the aesthetic proportion of 1:1.618</li>
                <li><strong>None</strong> - No grid display</li>
              </ul>
              <p>
                Photography tip: Position key elements along grid lines or at their intersections for more balanced compositions.
              </p>
            </div>
            
            <div className="help-section">
              <h3>Shape Options</h3>
              <p>
                In addition to rectangular crops, you can also create:
              </p>
              <ul>
                <li><strong>Circle/Oval</strong> - Perfect for profile pictures or circular thumbnails</li>
                <li><strong>Custom</strong> - For more advanced users, create custom shapes (premium feature)</li>
              </ul>
              <p>
                After selecting a circular crop, the background color option lets you choose the fill color for transparent areas.
              </p>
            </div>
          </div>
        );
      
      case 'image-adjustments':
        return (
          <div className="help-content">
            <h2>Image Adjustments</h2>
            
            <div className="help-section">
              <h3>Rotation</h3>
              <p>
                You can rotate your image before cropping:
              </p>
              <ul>
                <li><strong>Rotate Left</strong> - Rotates the image 90° counterclockwise</li>
                <li><strong>Rotate Right</strong> - Rotates the image 90° clockwise</li>
              </ul>
              <p>
                Keyboard shortcuts: Use Ctrl+[ to rotate left and Ctrl+] to rotate right.
              </p>
            </div>
            
            <div className="help-section">
              <h3>Flip Options</h3>
              <p>
                Flipping allows you to mirror your image:
              </p>
              <ul>
                <li><strong>Flip Horizontal</strong> - Mirrors the image left to right</li>
                <li><strong>Flip Vertical</strong> - Mirrors the image top to bottom</li>
              </ul>
              <p>
                Keyboard shortcuts: Use Ctrl+H to flip horizontally and Ctrl+V to flip vertically.
              </p>
            </div>
            
            <div className="help-section">
              <h3>Zoom</h3>
              <p>
                The zoom control allows you to:
              </p>
              <ul>
                <li>Zoom in for more precise cropping of small details</li>
                <li>Zoom out to see more of the image at once</li>
              </ul>
              <p>
                You can adjust zoom level using the slider or mouse wheel when hovering over the image.
              </p>
            </div>
            
            <div className="help-section">
              <h3>Reset</h3>
              <p>
                If you want to start over with your adjustments:
              </p>
              <ul>
                <li>Click the <strong>Reset</strong> button to return the image to its original state</li>
                <li>This will clear all rotations, flips, and zoom adjustments</li>
                <li>The crop box will return to its default position</li>
              </ul>
              <p>
                Keyboard shortcut: Press Ctrl+R to reset all adjustments.
              </p>
            </div>
          </div>
        );
      
      case 'batch-processing':
        return (
          <div className="help-content">
            <h2>Batch Processing</h2>
            
            <div className="help-section">
              <h3>Overview</h3>
              <p>
                Batch processing allows you to crop multiple images with the same settings, saving you time when working with sets of images.
              </p>
            </div>
            
            <div className="help-section">
              <h3>Getting Started with Batch Processing</h3>
              <ol>
                <li>Click on the "Batch Process" link in the navigation menu.</li>
                <li>Upload multiple images using the upload button or drag and drop.</li>
                <li>Your images will appear in the sidebar list.</li>
                <li>Select each image to set up the crop area.</li>
              </ol>
            </div>
            
            <div className="help-section">
              <h3>Batch Options</h3>
              <ul>
                <li>
                  <strong>Apply crop to all images</strong> - Enable this option to apply the same crop dimensions to all uploaded images.
                  This is useful for creating consistent crops across multiple images.
                </li>
                <li>
                  <strong>Format selection</strong> - Choose the output format for all processed images.
                </li>
                <li>
                  <strong>Quality setting</strong> - Adjust the compression level for JPEG and WebP formats.
                </li>
              </ul>
            </div>
            
            <div className="help-section">
              <h3>Processing and Downloading</h3>
              <p>
                After setting up your crops:
              </p>
              <ol>
                <li>Click "Crop Image" to process the current image (or all images if "Apply to all" is enabled).</li>
                <li>Each processed image will be marked as "Cropped" in the list.</li>
                <li>Click "Download All" to get a ZIP file containing all your cropped images.</li>
              </ol>
              <p>
                <strong>Tip:</strong> For large batches, the processing may take a moment. A progress indicator will show the status.
              </p>
            </div>
          </div>
        );
      
      case 'keyboard-shortcuts':
        return (
          <div className="help-content">
            <h2>Keyboard Shortcuts</h2>
            
            <div className="help-section">
              <h3>Navigation</h3>
              <table className="shortcuts-table">
                <thead>
                  <tr>
                    <th>Shortcut</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Tab</td>
                    <td>Navigate between controls</td>
                  </tr>
                  <tr>
                    <td>Esc</td>
                    <td>Cancel current operation</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="help-section">
              <h3>Image Operations</h3>
              <table className="shortcuts-table">
                <thead>
                  <tr>
                    <th>Shortcut</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Ctrl+Enter</td>
                    <td>Crop image</td>
                  </tr>
                  <tr>
                    <td>Ctrl+[</td>
                    <td>Rotate left</td>
                  </tr>
                  <tr>
                    <td>Ctrl+]</td>
                    <td>Rotate right</td>
                  </tr>
                  <tr>
                    <td>Ctrl+H</td>
                    <td>Flip horizontal</td>
                  </tr>
                  <tr>
                    <td>Ctrl+V</td>
                    <td>Flip vertical</td>
                  </tr>
                  <tr>
                    <td>Ctrl+Z</td>
                    <td>Undo</td>
                  </tr>
                  <tr>
                    <td>Ctrl+Y</td>
                    <td>Redo</td>
                  </tr>
                  <tr>
                    <td>Ctrl+R</td>
                    <td>Reset all adjustments</td>
                  </tr>
                  <tr>
                    <td>Ctrl+S</td>
                    <td>Save/Download cropped image</td>
                  </tr>
                </tbody>
              </table>
              <p><strong>Note:</strong> On Mac, use Cmd instead of Ctrl for these shortcuts.</p>
            </div>
            
            <div className="help-section">
              <h3>Crop Box Adjustments</h3>
              <table className="shortcuts-table">
                <thead>
                  <tr>
                    <th>Shortcut</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Arrow Keys</td>
                    <td>Move crop box by 1px</td>
                  </tr>
                  <tr>
                    <td>Shift + Arrow Keys</td>
                    <td>Move crop box by 10px</td>
                  </tr>
                  <tr>
                    <td>Ctrl + Arrow Keys</td>
                    <td>Resize crop box by 1px</td>
                  </tr>
                  <tr>
                    <td>Ctrl + Shift + Arrow Keys</td>
                    <td>Resize crop box by 10px</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="help-section">
              <h3>Customizing Shortcuts</h3>
              <p>
                You can customize keyboard shortcuts in the Settings page:
              </p>
              <ol>
                <li>Go to the Settings page by clicking the gear icon in the navigation menu.</li>
                <li>Scroll to the "Keyboard Shortcuts" section.</li>
                <li>Edit the shortcuts to your preference.</li>
                <li>Click "Save Settings" to apply your changes.</li>
              </ol>
            </div>
          </div>
        );
      
      case 'troubleshooting':
        return (
          <div className="help-content">
            <h2>Troubleshooting</h2>
            
            <div className="help-section">
              <h3>Common Issues</h3>
              
              <div className="issue-solution">
                <h4>Issue: Image Won't Upload</h4>
                <p><strong>Possible solutions:</strong></p>
                <ul>
                  <li>Check that your file is a supported format (JPEG, PNG, GIF, BMP, TIFF, WebP).</li>
                  <li>Ensure the file size is under 20MB (or the limit set in Settings).</li>
                  <li>Try a different browser or update your current browser.</li>
                  <li>Clear your browser cache and cookies.</li>
                </ul>
              </div>
              
              <div className="issue-solution">
                <h4>Issue: Webcam Not Working</h4>
                <p><strong>Possible solutions:</strong></p>
                <ul>
                  <li>Check that you have allowed camera access in your browser permissions.</li>
                  <li>Make sure no other application is currently using your webcam.</li>
                  <li>Restart your browser.</li>
                  <li>Try using a different browser.</li>
                </ul>
              </div>
              
              <div className="issue-solution">
                <h4>Issue: Image URL Import Failed</h4>
                <p><strong>Possible solutions:</strong></p>
                <ul>
                  <li>Verify that the URL points directly to an image file.</li>
                  <li>The image source may have CORS restrictions. Try downloading the image and uploading it directly.</li>
                  <li>Check your internet connection.</li>
                </ul>
              </div>
              
              <div className="issue-solution">
                <h4>Issue: Poor Image Quality After Cropping</h4>
                <p><strong>Possible solutions:</strong></p>
                <ul>
                  <li>Check the export format and quality settings. For best quality, use PNG format.</li>
                  <li>If using JPEG or WebP, increase the quality percentage.</li>
                  <li>Avoid extreme enlargements of small images.</li>
                </ul>
              </div>
            </div>
            
            <div className="help-section">
              <h3>Browser Compatibility</h3>
              <p>
                This tool works best with the following browsers:
              </p>
              <ul>
                <li>Google Chrome (recommended)</li>
                <li>Mozilla Firefox</li>
                <li>Microsoft Edge</li>
                <li>Safari (latest version)</li>
              </ul>
              <p>
                If you're experiencing issues, try updating your browser to the latest version.
              </p>
            </div>
            
            <div className="help-section">
              <h3>Contact Support</h3>
              <p>
                If you're still having problems after trying the solutions above:
              </p>
              <ul>
                <li>Email us at <a href="mailto:support@imagecrop.tool">support@imagecrop.tool</a></li>
                <li>Visit our <a href="#support-forum">support forum</a></li>
                <li>Check our <a href="#faq">FAQ page</a> for more common issues and solutions</li>
              </ul>
              <p>
                When contacting support, please include:
              </p>
              <ul>
                <li>The browser and operating system you're using</li>
                <li>A detailed description of the issue</li>
                <li>Steps to reproduce the problem</li>
                <li>Screenshots if applicable</li>
              </ul>
            </div>
          </div>
        );
      
      default:
        return <div>Content not found</div>;
    }
  };
  
  return (
    <div className="help-page">
      <div className="help-container">
        <div className="help-sidebar">
          <ul className="help-topics">
            <li 
              className={activeTab === 'getting-started' ? 'active' : ''}
              onClick={() => setActiveTab('getting-started')}
            >
              <FaQuestionCircle /> Getting Started
            </li>
            <li 
              className={activeTab === 'upload-options' ? 'active' : ''}
              onClick={() => setActiveTab('upload-options')}
            >
              <FaFileUpload /> Upload Options
            </li>
            <li 
              className={activeTab === 'cropping-features' ? 'active' : ''}
              onClick={() => setActiveTab('cropping-features')}
            >
              <FaCropAlt /> Cropping Features
            </li>
            <li 
              className={activeTab === 'image-adjustments' ? 'active' : ''}
              onClick={() => setActiveTab('image-adjustments')}
            >
              <FaCamera /> Image Adjustments
            </li>
            <li 
              className={activeTab === 'batch-processing' ? 'active' : ''}
              onClick={() => setActiveTab('batch-processing')}
            >
              <FaImages /> Batch Processing
            </li>
            <li 
              className={activeTab === 'keyboard-shortcuts' ? 'active' : ''}
              onClick={() => setActiveTab('keyboard-shortcuts')}
            >
              <FaKeyboard /> Keyboard Shortcuts
            </li>
            <li 
              className={activeTab === 'troubleshooting' ? 'active' : ''}
              onClick={() => setActiveTab('troubleshooting')}
            >
              <FaBug /> Troubleshooting
            </li>
          </ul>
        </div>
        
        <div className="help-main">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

const FaImages = () => <span role="img" aria-label="Images">🖼️</span>;

export default Help; 