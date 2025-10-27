const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const { protect, admin } = require("../middleware/authMiddleware");
const { upload: localUpload, processImage, cleanupOriginal } = require("../config/upload");

require("dotenv").config();

const router = express.Router();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer setup using memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file Uploaded" });
    }

    // Function to handle the stream upload to Cloudinary
    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });

        // Use streamifier to convert file buffer to a stream
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };

    // Call the streamUpload function
    const result = await streamUpload(req.file.buffer);

    // Respond with the uploaded image URL
    res.json({ imageUrl: result.secure_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// ===== LOCAL UPLOAD ENDPOINTS =====

// @route POST /api/upload/local/image
// @desc Upload and process a single image locally
// @access Private/Admin
router.post("/local/image", protect, admin, localUpload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: "No image file uploaded" 
      });
    }

    // Process the image (create optimized and thumbnail versions)
    const processedImage = await processImage(req.file.path, req.file.filename);
    
    // Clean up the original file
    await cleanupOriginal(req.file.path);

    res.status(201).json({
      success: true,
      message: "Image uploaded and processed successfully",
      data: {
        id: req.file.filename.split('.')[0], // UUID without extension
        original: processedImage.original,
        optimized: processedImage.optimized,
        thumbnail: processedImage.thumbnail,
        metadata: processedImage.metadata
      }
    });

  } catch (error) {
    console.error("Upload error:", error);
    
    // Clean up file if processing failed
    if (req.file) {
      await cleanupOriginal(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: error.message || "Image upload failed"
    });
  }
});

// @route POST /api/upload/local/images
// @desc Upload and process multiple images locally
// @access Private/Admin
router.post("/local/images", protect, admin, localUpload.array("images", 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No image files uploaded"
      });
    }

    const processedImages = [];
    const errors = [];

    // Process each uploaded file
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      
      try {
        const processedImage = await processImage(file.path, file.filename);
        await cleanupOriginal(file.path);
        
        processedImages.push({
          id: file.filename.split('.')[0],
          original: processedImage.original,
          optimized: processedImage.optimized,
          thumbnail: processedImage.thumbnail,
          metadata: processedImage.metadata
        });
      } catch (error) {
        errors.push({
          filename: file.originalname,
          error: error.message
        });
        
        // Clean up failed file
        await cleanupOriginal(file.path);
      }
    }

    res.status(201).json({
      success: true,
      message: `Successfully processed ${processedImages.length} images`,
      data: {
        images: processedImages,
        errors: errors.length > 0 ? errors : undefined
      }
    });

  } catch (error) {
    console.error("Multiple upload error:", error);
    
    // Clean up all files if processing failed
    if (req.files) {
      for (const file of req.files) {
        await cleanupOriginal(file.path);
      }
    }
    
    res.status(500).json({
      success: false,
      message: error.message || "Multiple image upload failed"
    });
  }
});

// @route DELETE /api/upload/local/image/:filename
// @desc Delete an uploaded image and its variants
// @access Private/Admin
router.delete("/local/image/:filename", protect, admin, async (req, res) => {
  try {
    const { filename } = req.params;
    const fs = require("fs").promises;
    const path = require("path");
    
    // Extract name without extension for finding variants
    const nameWithoutExt = path.parse(filename).name;
    const ext = path.parse(filename).ext;
    
    const filesToDelete = [
      `uploads/images/original/${filename}`,
      `uploads/images/optimized/${nameWithoutExt}_optimized${ext}`,
      `uploads/images/thumbnails/${nameWithoutExt}_thumb${ext}`
    ];
    
    let deletedCount = 0;
    const errors = [];
    
    for (const filePath of filesToDelete) {
      try {
        await fs.unlink(filePath);
        deletedCount++;
      } catch (error) {
        if (error.code !== 'ENOENT') { // Ignore "file not found" errors
          errors.push({ file: filePath, error: error.message });
        }
      }
    }
    
    res.json({
      success: true,
      message: `Deleted ${deletedCount} image files`,
      deletedCount,
      errors: errors.length > 0 ? errors : undefined
    });
    
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete image"
    });
  }
});

module.exports = router;
