# Crop Image Tool

A flexible and powerful React-based image cropping library for single images and batch processing.

## Features

- Single image cropping with customizable options
- Batch processing for multiple images
- Maintain crop settings when switching between images
- Circular crop option
- Customizable aspect ratio
- Zoom and rotation controls
- Image filters for brightness, contrast, saturation, and blur
- Crop history with undo/redo support
- TypeScript support

## Installation

```bash
npm install crop-image-tool
# or
yarn add crop-image-tool
```

## Dependencies

This library depends on:
- React 16.8+ (for Hooks support)
- Material-UI v4 (@material-ui/core)
- React-Cropper
- File-Saver

## Basic Usage

### Single Image Cropping

```jsx
import React, { useState } from 'react';
import { CropperComponent } from 'crop-image-tool';

const SingleImageExample = () => {
  const [croppedImage, setCroppedImage] = useState(null);

  const handleCrop = (croppedImageDataUrl) => {
    setCroppedImage(croppedImageDataUrl);
    console.log('Image cropped successfully!');
  };

  return (
    <div>
      <CropperComponent
        imageSrc="path/to/your/image.jpg"
        onCrop={handleCrop}
        aspectRatio={16 / 9}
        minCropBoxWidth={100}
        minCropBoxHeight={100}
      />
      
      {croppedImage && (
        <div>
          <h3>Cropped Result:</h3>
          <img src={croppedImage} alt="Cropped result" />
        </div>
      )}
    </div>
  );
};
```

### Batch Processing

```jsx
import React from 'react';
import { BatchProcessing } from 'crop-image-tool';

const BatchProcessingExample = () => {
  const handleBatchComplete = (croppedImages) => {
    console.log('All images processed:', croppedImages);
    // Do something with the array of cropped images
  };

  const sampleImages = [
    { id: 1, src: '/images/sample1.jpg', filename: 'sample1.jpg' },
    { id: 2, src: '/images/sample2.jpg', filename: 'sample2.jpg' },
  ];

  return (
    <BatchProcessing
      initialImages={sampleImages}
      onBatchComplete={handleBatchComplete}
      allowImageImport={true}
      defaultAspectRatio={1}
    />
  );
};
```

### Using Image Filters

```jsx
import React, { useState } from 'react';
import { CropperComponent, FilterControls } from 'crop-image-tool';
import { defaultFilters } from 'crop-image-tool/config';

const ImageEditorExample = () => {
  const [filters, setFilters] = useState({ ...defaultFilters });
  const [cropData, setCropData] = useState(null);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    // Re-apply crop if needed
    if (cropData) {
      handleCrop(cropData);
    }
  };

  const handleCrop = (data) => {
    setCropData(data);
    // Apply filters to cropped image
  };

  return (
    <div className="editor-container">
      <div className="main-area">
        <CropperComponent
          imageSrc="path/to/your/image.jpg"
          onCrop={handleCrop}
        />
      </div>
      <div className="sidebar">
        <FilterControls
          initialFilters={filters}
          onChange={handleFilterChange}
        />
      </div>
    </div>
  );
};
```

## API Reference

### CropperComponent Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| imageSrc | string | *Required* | Source URL of the image to crop |
| onCrop | function | - | Callback function that receives the cropped image data URL |
| onCropCancel | function | - | Callback function when cropping is cancelled |
| aspectRatio | number | - | Fixed aspect ratio for the crop box (width/height) |
| minCropBoxWidth | number | 0 | Minimum crop box width in pixels |
| minCropBoxHeight | number | 0 | Minimum crop box height in pixels |
| circularCrop | boolean | false | Enable circular cropping mask |
| initialCropSettings | object | - | Initial crop box position and size |
| zoomable | boolean | true | Allow image zooming |
| rotatable | boolean | true | Allow image rotation |

### BatchProcessing Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| initialImages | array | [] | Array of image objects to process |
| onBatchComplete | function | - | Callback when all images are processed |
| allowImageImport | boolean | true | Allow user to import additional images |
| defaultAspectRatio | number | - | Default aspect ratio for all images |
| maxImages | number | 50 | Maximum number of images allowed |
| allowZoom | boolean | true | Allow image zooming |
| allowRotate | boolean | true | Allow image rotation |

### FilterControls Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| initialFilters | object | defaultFilters | Initial filter values |
| onChange | function | *Required* | Callback function when filters change |
| onReset | function | - | Callback function when filters are reset |

## Filter Values

The filter values object has the following properties:

```js
{
  brightness: 100, // 0-200%, where 100% is normal
  contrast: 100,   // 0-200%, where 100% is normal
  saturation: 100, // 0-200%, where 100% is normal
  blur: 0          // 0-10px
}
```

## Programmatic Usage

You can also use the core cropping utility without the UI components:

```js
import { cropImage, applyFilters } from 'crop-image-tool/utils';

// Load an image
const image = new Image();
image.src = 'path/to/image.jpg';

image.onload = async () => {
  try {
    // Define crop settings
    const cropSettings = {
      x: 100,
      y: 50,
      width: 300,
      height: 200,
      rotate: 0,
      scaleX: 1,
      scaleY: 1,
    };

    const filterSettings = {
      brightness: 120, // Slightly brighter
      contrast: 110,   // Slightly more contrast
      saturation: 100, // Normal saturation
      blur: 0          // No blur
    };

    // Options for processing
    const options = {
      format: 'jpeg',
      quality: 0.9,
      applyFilters: true,
      filters: filterSettings
    };

    // Crop the image
    const croppedImageBlob = await cropImage(image, cropSettings, options);
    
    // Convert to data URL if needed
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      console.log('Processed image:', dataUrl);
    };
    reader.readAsDataURL(croppedImageBlob);
  } catch (error) {
    console.error('Cropping failed:', error);
  }
};
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT 