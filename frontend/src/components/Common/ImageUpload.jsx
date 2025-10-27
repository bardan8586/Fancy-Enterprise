import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { 
  FaCloudUploadAlt, 
  FaTimes, 
  FaSpinner, 
  FaImage,
  FaCheckCircle,
  FaExclamationTriangle
} from 'react-icons/fa';

const ImageUpload = ({ 
  onImagesChange, 
  maxFiles = 5, 
  existingImages = [], 
  className = "" 
}) => {
  const [images, setImages] = useState(existingImages || []);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const backendBaseUrl = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '') || '';
  const resolveUrl = (pathOrUrl) => {
    if (!pathOrUrl) return '';
    // If already absolute (http/https), return as-is
    if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
    // Ensure leading slash, then prefix backend base URL
    const withLeadingSlash = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
    const resolved = `${backendBaseUrl}${withLeadingSlash}`;
    console.log('Resolving URL:', pathOrUrl, '->', resolved);
    return resolved;
  };

  const handleImagesChange = (newImages) => {
    setImages(newImages);
    onImagesChange(newImages);
  };

  const uploadImages = async (files) => {
    if (files.length === 0) return;

    // Check file count limit
    if (images.length + files.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} images allowed`);
      return;
    }

    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const invalidFiles = Array.from(files).filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      toast.error('Only JPEG, PNG, and WebP images are allowed');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('images', file);
      });

      const response = await fetch(`${backendBaseUrl}/api/upload/local/images`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        },
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        const newImages = result.data.images.map(img => ({
          id: img.id,
          url: resolveUrl(img.optimized),
          thumbnail: resolveUrl(img.thumbnail),
          original: resolveUrl(img.original),
          metadata: img.metadata
        }));

        const updatedImages = [...images, ...newImages];
        handleImagesChange(updatedImages);
        
        toast.success(`Successfully uploaded ${newImages.length} image(s)`);
        
        if (result.data.errors && result.data.errors.length > 0) {
          result.data.errors.forEach(error => {
            toast.warning(`Failed to upload ${error.filename}: ${error.error}`);
          });
        }
      } else {
        throw new Error(result.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadImages(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      uploadImages(e.target.files);
    }
    // Reset input
    e.target.value = '';
  };

  const removeImage = (imageId) => {
    const updatedImages = images.filter(img => img.id !== imageId);
    handleImagesChange(updatedImages);
    toast.success('Image removed');
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
          }
          ${uploading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileInput}
          className="hidden"
        />

        {uploading ? (
          <div className="flex flex-col items-center">
            <FaSpinner className="text-4xl text-blue-500 mb-3 animate-spin" />
            <p className="text-gray-600 mb-1">Uploading images...</p>
            <p className="text-sm text-gray-500">Please wait</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <FaCloudUploadAlt className="text-4xl text-gray-400 mb-3" />
            <p className="text-gray-600 mb-1">Drag & drop images here</p>
            <p className="text-sm text-gray-500 mb-2">
              or <span className="text-blue-500 font-medium">click to browse</span>
            </p>
            <p className="text-xs text-gray-400">
              Supports JPEG, PNG, WebP • Max {maxFiles} images • 10MB each
            </p>
          </div>
        )}
      </div>

      {/* Uploaded Images Grid */}
      {images.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Uploaded Images ({images.length}/{maxFiles})
            </h3>
            {images.length > 0 && (
              <button
                onClick={() => handleImagesChange([])}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={image.id} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={resolveUrl(image.thumbnail || image.url)}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('Image load error:', e.target.src);
                      console.error('Backend URL:', backendBaseUrl);
                      console.error('Image data:', image);
                      e.target.src = `data:image/svg+xml,${encodeURIComponent(`
                        <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                          <rect width="100" height="100" fill="#f3f4f6"/>
                          <text x="50" y="50" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="Arial">ERROR</text>
                        </svg>
                      `)}`;
                    }}
                    onLoad={() => console.log('✅ Image loaded successfully:', resolveUrl(image.thumbnail || image.url))}
                  />
                  {/* Debug info */}
                  <div className="absolute top-0 left-0 bg-black bg-opacity-75 text-white text-xs p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {resolveUrl(image.thumbnail || image.url)}
                  </div>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => removeImage(image.id)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove image"
                >
                  <FaTimes className="w-3 h-3" />
                </button>

                {/* Image info */}
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="truncate">
                    {image.metadata?.width}×{image.metadata?.height}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Primary image selector */}
          {images.length > 1 && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Primary Image (Featured)
              </label>
              <div className="flex space-x-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    className={`
                      flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden
                      ${index === 0 ? 'border-blue-500' : 'border-gray-300'}
                    `}
                    onClick={() => {
                      const reordered = [image, ...images.filter(img => img.id !== image.id)];
                      handleImagesChange(reordered);
                    }}
                    title={index === 0 ? 'Primary image' : 'Set as primary'}
                  >
                    <img
                      src={resolveUrl(image.thumbnail || image.url)}
                      alt={`Option ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('Primary image load error:', e.target.src);
                        e.target.src = `data:image/svg+xml,${encodeURIComponent(`
                          <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                            <rect width="100" height="100" fill="#f3f4f6"/>
                            <text x="50" y="50" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="Arial">Image</text>
                          </svg>
                        `)}`;
                      }}
                    />
                    {index === 0 && (
                      <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                        <FaCheckCircle className="text-blue-500 text-sm" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Upload Status */}
      {uploading && (
        <div className="flex items-center space-x-2 text-blue-600">
          <FaSpinner className="animate-spin" />
          <span className="text-sm">Processing images...</span>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
