// Example usage of Crop Image Tool as a library/API

// Import the CropperComponent
import CropperComponent from '../src/components/CropperComponent';
import BatchProcessing from '../src/components/BatchProcessing';

// Basic usage with a single image
function SingleImageExample() {
  // Function to handle the cropped result
  const handleCroppedImage = (croppedImage) => {
    console.log('Cropped image data URL:', croppedImage);
    // You can save this to file, display it, or process it further
  };

  return (
    <CropperComponent
      imageSrc="path/to/your/image.jpg"
      aspectRatio={16 / 9} // Optional: Set a fixed aspect ratio
      onCrop={handleCroppedImage}
      minCropBoxWidth={100} // Optional: Minimum crop box dimensions
      minCropBoxHeight={100}
    />
  );
}

// Advanced usage with batch processing
function BatchProcessingExample() {
  // Function to handle all cropped images
  const handleBatchComplete = (croppedImages) => {
    console.log(`Processed ${croppedImages.length} images`);
    croppedImages.forEach((img, index) => {
      console.log(`Image ${index + 1}:`, img.dataUrl);
    });
  };

  // Sample images array
  const sampleImages = [
    { id: 1, src: 'path/to/image1.jpg', filename: 'image1.jpg' },
    { id: 2, src: 'path/to/image2.jpg', filename: 'image2.jpg' },
    { id: 3, src: 'path/to/image3.jpg', filename: 'image3.jpg' },
  ];

  return (
    <BatchProcessing
      initialImages={sampleImages}
      onBatchComplete={handleBatchComplete}
      allowImageImport={false} // Optional: Disable the import button
      defaultAspectRatio={4 / 3} // Optional: Default aspect ratio
    />
  );
}

// Programmatic cropping without UI
async function programmaticCropping() {
  // Import the core cropping utility
  const { cropImage } = await import('../src/utils/cropUtils');
  
  // Load an image
  const image = new Image();
  image.src = 'path/to/image.jpg';
  
  await new Promise((resolve) => {
    image.onload = resolve;
  });
  
  // Define crop settings
  const cropSettings = {
    x: 100,
    y: 50,
    width: 400,
    height: 300,
    aspectRatio: 4 / 3,
  };
  
  // Crop the image
  const result = await cropImage(image, cropSettings);
  console.log('Cropped result:', result);
  
  // You can convert to Blob or File if needed
  const blob = await fetch(result).then(r => r.blob());
  console.log('Blob:', blob);
}

// Example of integration with existing form
function FormIntegrationExample() {
  const [croppedImage, setCroppedImage] = useState(null);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    
    // Convert data URL to Blob
    if (croppedImage) {
      const blob = dataURLtoBlob(croppedImage);
      formData.append('profileImage', blob, 'profile.jpg');
    }
    
    // Add other form fields
    formData.append('name', document.getElementById('name').value);
    
    // Submit the form data
    fetch('/api/submit-profile', {
      method: 'POST',
      body: formData,
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input type="text" id="name" placeholder="Name" />
      
      <h3>Profile Image</h3>
      <CropperComponent
        imageSrc="path/to/default-avatar.jpg"
        aspectRatio={1} // 1:1 square for profile pic
        onCrop={setCroppedImage}
        circularCrop={true} // Optional: Enable circular cropping
      />
      
      <button type="submit">Submit Profile</button>
    </form>
  );
}

// Utility function to convert Data URL to Blob
function dataURLtoBlob(dataURL) {
  const parts = dataURL.split(';base64,');
  const contentType = parts[0].split(':')[1];
  const raw = window.atob(parts[1]);
  const array = new Uint8Array(raw.length);
  
  for (let i = 0; i < raw.length; i++) {
    array[i] = raw.charCodeAt(i);
  }
  
  return new Blob([array], { type: contentType });
} 