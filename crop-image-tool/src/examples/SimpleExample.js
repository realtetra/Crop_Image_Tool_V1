import React, { useState } from 'react';
import { CropperComponent } from '../components/CropperComponent';
import { cropImage, downloadImage } from '../utils/cropImage';

const SimpleExample = () => {
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [cropSettings, setCropSettings] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
        setCroppedImage(null); // Reset cropped image when new image is selected
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCrop = (settings) => {
    setCropSettings(settings);
  };

  const handleCropComplete = async () => {
    if (image && cropSettings) {
      try {
        // Create an image element from the source
        const imgElement = new Image();
        imgElement.src = image;
        
        // Wait for the image to load
        await new Promise((resolve) => {
          imgElement.onload = resolve;
        });
        
        // Crop the image using the utility function
        const croppedDataUrl = await cropImage(imgElement, cropSettings, {
          format: 'image/jpeg',
          quality: 0.9
        });
        
        setCroppedImage(croppedDataUrl);
      } catch (error) {
        console.error('Failed to crop image:', error);
      }
    }
  };

  const handleDownload = () => {
    if (croppedImage) {
      downloadImage(croppedImage, 'cropped-image.jpg');
    }
  };

  return (
    <div className="simple-example">
      <h2>Simple Image Cropper Example</h2>
      
      <div className="file-upload">
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
        />
      </div>
      
      {image && (
        <div className="cropper-container">
          <h3>Original Image with Cropper</h3>
          <CropperComponent
            src={image}
            onCrop={handleCrop}
            aspectRatio={16 / 9} // Set desired aspect ratio
          />
          <button 
            onClick={handleCropComplete}
            disabled={!cropSettings}
            className="crop-button"
          >
            Crop Image
          </button>
        </div>
      )}
      
      {croppedImage && (
        <div className="result-container">
          <h3>Cropped Result</h3>
          <img 
            src={croppedImage} 
            alt="Cropped" 
            className="cropped-preview" 
          />
          <button 
            onClick={handleDownload}
            className="download-button"
          >
            Download
          </button>
        </div>
      )}
      
      <style jsx>{`
        .simple-example {
          max-width: 900px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .file-upload {
          margin-bottom: 20px;
        }
        
        .cropper-container {
          margin-bottom: 30px;
        }
        
        .crop-button, .download-button {
          background-color: #4CAF50;
          color: white;
          padding: 10px 15px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 10px;
          font-size: 16px;
        }
        
        .crop-button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }
        
        .cropped-preview {
          max-width: 100%;
          max-height: 300px;
          border: 1px solid #ddd;
        }
        
        h2, h3 {
          color: #333;
        }
      `}</style>
    </div>
  );
};

export default SimpleExample; 