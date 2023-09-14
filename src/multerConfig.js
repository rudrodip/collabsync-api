const multer = require('multer');

// Function to determine the destination directory based on the file type
const destination = function (req, file, cb) {
  let uploadPath = './uploads/';

  // Check the file type based on the fieldname (e.g., 'video' or 'thumbnail')
  if (file.fieldname === 'video') {
    uploadPath += 'videos/';
  } else if (file.fieldname === 'thumbnail') {
    uploadPath += 'thumbnails/';
  }

  cb(null, uploadPath);
};

const storage = multer.diskStorage({
  destination: destination, // Use the custom destination function
  filename: function (req, file, cb) {
    // Extract the original file extension
    const fileExtension = file.originalname.split('.').pop();

    // Format the current date as yyyy-MM-dd
    const formattedDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');

    // Include the ID and formatted date in the filename
    const uniqueSuffix = formattedDate + '-' + Math.round(Math.random() * 1E9) + '-' + req.body.workspaceId;

    // Generate the final filename with the original name and ID
    cb(null, file.originalname + '-' + uniqueSuffix + '.' + fileExtension);
  },
});

const upload = multer({ storage });

module.exports = upload;
