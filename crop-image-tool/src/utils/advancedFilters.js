/**
 * Advanced image filters utility
 * Provides additional filters and effects beyond basic adjustments
 */

/**
 * Applies a grayscale effect to the canvas
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {number} intensity - Filter intensity (0-100)
 */
export const applyGrayscale = (ctx, width, height, intensity = 100) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    
    // Apply grayscale based on intensity
    const factor = intensity / 100;
    data[i] = data[i] * (1 - factor) + avg * factor;     // Red
    data[i + 1] = data[i + 1] * (1 - factor) + avg * factor; // Green
    data[i + 2] = data[i + 2] * (1 - factor) + avg * factor; // Blue
  }
  
  ctx.putImageData(imageData, 0, 0);
};

/**
 * Applies a sepia tone effect to the canvas
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {number} intensity - Filter intensity (0-100)
 */
export const applySepia = (ctx, width, height, intensity = 100) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const factor = intensity / 100;
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Calculate sepia values
    const sepiaR = (r * 0.393 + g * 0.769 + b * 0.189);
    const sepiaG = (r * 0.349 + g * 0.686 + b * 0.168);
    const sepiaB = (r * 0.272 + g * 0.534 + b * 0.131);
    
    // Apply sepia based on intensity
    data[i] = r * (1 - factor) + sepiaR * factor;
    data[i + 1] = g * (1 - factor) + sepiaG * factor;
    data[i + 2] = b * (1 - factor) + sepiaB * factor;
  }
  
  ctx.putImageData(imageData, 0, 0);
};

/**
 * Applies a vignette effect to the canvas
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {number} intensity - Filter intensity (0-100)
 * @param {string} color - Vignette color (default: black)
 */
export const applyVignette = (ctx, width, height, intensity = 50, color = 'black') => {
  // Save current composite operation
  const prevOp = ctx.globalCompositeOperation;
  
  // Calculate dimensions
  const x = 0;
  const y = 0;
  const outerRadius = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));
  const innerRadius = outerRadius * (1 - intensity / 100);
  
  // Create radial gradient
  const gradient = ctx.createRadialGradient(
    width / 2, height / 2, innerRadius,
    width / 2, height / 2, outerRadius
  );
  
  gradient.addColorStop(0, 'rgba(0,0,0,0)');
  gradient.addColorStop(1, color);
  
  // Draw vignette
  ctx.globalCompositeOperation = 'multiply';
  ctx.fillStyle = gradient;
  ctx.fillRect(x, y, width, height);
  
  // Restore previous composite operation
  ctx.globalCompositeOperation = prevOp;
};

/**
 * Adjusts image hue
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {number} hueRotation - Degrees of hue rotation (0-360)
 */
export const adjustHue = (ctx, width, height, hueRotation) => {
  // We'll use CSS filters for this
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext('2d');
  
  // Copy the current canvas to the temp canvas
  tempCtx.drawImage(ctx.canvas, 0, 0);
  
  // Clear the original canvas
  ctx.clearRect(0, 0, width, height);
  
  // Apply hue rotation filter and draw back to original canvas
  ctx.filter = `hue-rotate(${hueRotation}deg)`;
  ctx.drawImage(tempCanvas, 0, 0);
  ctx.filter = 'none';
};

/**
 * Applies a duotone effect (converts image to gradient between two colors)
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {string} lightColor - Color for lighter areas
 * @param {string} darkColor - Color for darker areas
 * @param {number} intensity - Filter intensity (0-100)
 */
export const applyDuotone = (ctx, width, height, lightColor = '#ffffff', darkColor = '#000000', intensity = 100) => {
  // First convert to grayscale
  applyGrayscale(ctx, width, height, 100);
  
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  // Parse colors to RGB
  const getRGB = (color) => {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 1;
    tempCanvas.height = 1;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.fillStyle = color;
    tempCtx.fillRect(0, 0, 1, 1);
    return tempCtx.getImageData(0, 0, 1, 1).data;
  };
  
  const darkRGB = getRGB(darkColor);
  const lightRGB = getRGB(lightColor);
  const factor = intensity / 100;
  
  for (let i = 0; i < data.length; i += 4) {
    const gray = data[i]; // Since image is grayscale, R=G=B
    const normalized = gray / 255;
    
    // Interpolate between dark and light colors based on grayscale value
    data[i] = data[i] * (1 - factor) + 
              (darkRGB[0] * (1 - normalized) + lightRGB[0] * normalized) * factor;
    data[i + 1] = data[i + 1] * (1 - factor) + 
                  (darkRGB[1] * (1 - normalized) + lightRGB[1] * normalized) * factor;
    data[i + 2] = data[i + 2] * (1 - factor) + 
                  (darkRGB[2] * (1 - normalized) + lightRGB[2] * normalized) * factor;
  }
  
  ctx.putImageData(imageData, 0, 0);
};

/**
 * Applies a sharpen effect to the canvas
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {number} amount - Sharpen amount (0-100)
 */
export const applySharpen = (ctx, width, height, amount = 50) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const tempData = new Uint8ClampedArray(data);
  
  // Sharpen kernel formula based on amount (0-100)
  const strength = amount / 100 * 0.8; // Scale to reasonable range
  const kernel = [
    0, -strength, 0,
    -strength, 1 + 4 * strength, -strength,
    0, -strength, 0
  ];
  
  // Apply convolution
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      for (let c = 0; c < 3; c++) {
        let sum = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const idx = ((y + ky) * width + (x + kx)) * 4 + c;
            sum += tempData[idx] * kernel[(ky + 1) * 3 + (kx + 1)];
          }
        }
        const idx = (y * width + x) * 4 + c;
        data[idx] = Math.min(255, Math.max(0, sum));
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
};

/**
 * Applies a noise effect to the canvas
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {number} amount - Noise amount (0-100)
 * @param {boolean} monochrome - Whether noise should be monochrome or colored
 */
export const applyNoise = (ctx, width, height, amount = 20, monochrome = true) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  // Scale amount to reasonable range
  const noiseStrength = amount / 100 * 70;
  
  for (let i = 0; i < data.length; i += 4) {
    if (monochrome) {
      // Monochrome noise
      const noise = (Math.random() - 0.5) * noiseStrength;
      data[i] = Math.min(255, Math.max(0, data[i] + noise));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
    } else {
      // Color noise
      data[i] = Math.min(255, Math.max(0, data[i] + (Math.random() - 0.5) * noiseStrength));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + (Math.random() - 0.5) * noiseStrength));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + (Math.random() - 0.5) * noiseStrength));
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
}; 