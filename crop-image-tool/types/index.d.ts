// Type definitions for Crop Image Tool

// Image object type
export interface ImageItem {
  id: number | string;
  src: string;
  filename: string;
  cropped?: boolean;
  dataUrl?: string;
}

// Crop settings type
export interface CropSettings {
  x: number;
  y: number;
  width: number;
  height: number;
  rotate?: number;
  scaleX?: number;
  scaleY?: number;
  aspectRatio?: number;
}

// Filter settings type
export interface FilterSettings {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
}

// Props for CropperComponent
export interface CropperComponentProps {
  imageSrc: string;
  onCrop?: (croppedImageDataUrl: string) => void;
  onCropCancel?: () => void;
  onCropperReady?: (instance: any) => void;
  aspectRatio?: number;
  minCropBoxWidth?: number;
  minCropBoxHeight?: number;
  circularCrop?: boolean;
  initialCropSettings?: CropSettings;
  zoomable?: boolean;
  rotatable?: boolean;
  initialFilters?: FilterSettings;
  applyFilters?: boolean;
}

// Props for FilterControls component
export interface FilterControlsProps {
  initialFilters?: FilterSettings;
  onChange: (filters: FilterSettings) => void;
  onReset?: () => void;
}

// Props for BatchProcessing component
export interface BatchProcessingProps {
  initialImages?: ImageItem[];
  onBatchComplete?: (croppedImages: ImageItem[]) => void;
  allowImageImport?: boolean;
  defaultAspectRatio?: number;
  maxImages?: number;
  allowZoom?: boolean;
  allowRotate?: boolean;
  defaultFilters?: FilterSettings;
}

// Crop utility function type
export type CropImageFunction = (
  image: HTMLImageElement, 
  cropSettings: CropSettings,
  options?: {
    format?: string;
    quality?: number;
    applyFilters?: boolean;
    filters?: FilterSettings;
  }
) => Promise<Blob>;

// Apply filters function type
export type ApplyFiltersFunction = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  filters: FilterSettings
) => void;

// Filter string generator function type
export type GetFilterStringFunction = (
  filters: FilterSettings
) => string;

// Cropper instance interface (simplified version of react-cropper's type)
export interface CropperInstance {
  crop: () => void;
  getCroppedCanvas: (options?: Object) => HTMLCanvasElement;
  getImageData: () => any;
  getCropBoxData: () => any;
  setCropBoxData: (data: any) => void;
  getData: () => CropSettings;
  setData: (data: CropSettings) => void;
  rotateTo: (degree: number) => void;
  scale: (scaleX: number, scaleY: number) => void;
  reset: () => void;
}

// Error types
export enum CropErrorType {
  IMAGE_LOAD_ERROR = 'IMAGE_LOAD_ERROR',
  CROP_PROCESSING_ERROR = 'CROP_PROCESSING_ERROR',
  INVALID_CROP_SETTINGS = 'INVALID_CROP_SETTINGS',
}

export interface CropError {
  type: CropErrorType;
  message: string;
  details?: any;
} 