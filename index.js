const express = require('express');
const multer = require('multer');
const sharp = require('sharp');

const app = express();
const upload = multer({ dest: 'uploads/' });

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.post('/upload', upload.single('image'), async (req, res) => {
  // req.file contains the uploaded image information
  // You can now process this image and create different sizes
  res.send('Image uploaded successfully!');
  sharp(req.file.path)
    .resize(800) // resize to width 800 keeping aspect ratio
    .toFile('path_to_save_resized_image', (err, resizeImage) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Image resized successfully!');
        return resizeImage;
      }
    });
});
