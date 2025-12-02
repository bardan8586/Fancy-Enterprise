const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');

// Create uploads directory if it doesn't exist
const ensureUploadsDir = async () => {
  const dirs = [
    'uploads/images/original',
    'uploads/images/optimized', 
    'uploads/images/thumbnails'
  ];
  
  for (const dir of dirs) {
    try {
      await fs.access(dir);
    } catch {
      await fs.mkdir(dir, { recursive: true });
    }
  }
};

// Initialize directories
ensureUploadsDir();

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/images/original/');
  },
  filename: (req, file, cb) => {
    // Generate unique filename with original extension
    const uniqueId = uuidv4();
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueId}${ext}`);
  }
});

// File filter for security
const fileFilter = (req, file, cb) => {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'), false);
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5 // Maximum 5 files per request
  }
});

// Image processing function
const processImage = async (originalPath, filename) => {
  try {
    const nameWithoutExt = path.parse(filename).name;
    const ext = path.parse(filename).ext;
    
    // Create optimized version (max 1200px width, 80% quality)
    const optimizedPath = `uploads/images/optimized/${nameWithoutExt}_optimized${ext}`;
    await sharp(originalPath)
      .resize(1200, null, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      .jpeg({ quality: 80, progressive: true })
      .png({ quality: 80, progressive: true })
      .toFile(optimizedPath);
    
    // Create thumbnail (300x300px, cropped)
    const thumbnailPath = `uploads/images/thumbnails/${nameWithoutExt}_thumb${ext}`;
    await sharp(originalPath)
      .resize(300, 300, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 70 })
      .png({ quality: 70 })
      .toFile(thumbnailPath);
    
    // Get image metadata
    const metadata = await sharp(originalPath).metadata();
    
    return {
      original: `/uploads/images/original/${filename}`,
      optimized: `/uploads/images/optimized/${nameWithoutExt}_optimized${ext}`,
      thumbnail: `/uploads/images/thumbnails/${nameWithoutExt}_thumb${ext}`,
      metadata: {
        width: metadata.width,
        height: metadata.height,
        size: metadata.size,
        format: metadata.format
      }
    };
  } catch (error) {
    throw new Error(`Image processing failed: ${error.message}`);
  }
};

// Clean up original file after processing
const cleanupOriginal = async (originalPath) => {
  try {
    await fs.unlink(originalPath);
  } catch (error) {
    console.warn('Failed to cleanup original file:', error.message);
  }
};

module.exports = {
  upload,
  processImage,
  cleanupOriginal,
  ensureUploadsDir
};










