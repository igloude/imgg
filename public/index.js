import fs from 'fs';

import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import archiver from 'archiver';

const app = express();
const upload = multer({ dest: 'uploads/' });

const PORT = process.env.PORT || 8080;

function deleteFile(filePath) {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`Error deleting file ${filePath}:`, err);
    }
  });
}

app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.post('/upload', upload.single('image'), async (req, res) => {
  // req.file contains the uploaded image information
  // You can now process this image and create different sizes
  const file = req.file.path;
  const name = req.file.originalname.split('.')[0];
  const promises = [];

  const name1 = `${name}-full.jpeg`;
  promises.push({
    promise: sharp(file).clone().jpeg({ quality: 100 }).toFile(name1),
    name: name1,
  });

  // TODO: check file size and skip 1920 if not big enough
  const name2 = `${name}-1920.jpeg`;
  promises.push({
    promise: sharp(file)
      .clone()
      .resize({ width: 1920 })
      .jpeg({ quality: 100 })
      .toFile(name2),
    name: name2,
  });

  const name3 = `${name}-1280.jpeg`;
  promises.push({
    promise: sharp(file)
      .clone()
      .resize({ width: 1280 })
      .jpeg({ quality: 80 })
      .toFile(name3),
    name: name3,
  });

  const name4 = `${name}-1024.jpeg`;
  promises.push({
    promise: sharp(file)
      .clone()
      .resize({ width: 1024 })
      .jpeg({ quality: 80 })
      .toFile(name4),
    name: name4,
  });

  const name5 = `${name}-768.jpeg`;
  promises.push({
    promise: sharp(file)
      .clone()
      .resize({ width: 768 })
      .jpeg({ quality: 80 })
      .toFile(name5),
    name: name5,
  });

  const name6 = `${name}-lr.jpeg`;
  promises.push({
    promise: sharp(file)
      .clone()
      .resize({ width: 384 })
      .jpeg({ quality: 30 })
      .toFile(name6),
    name: name6,
  });

  const cleanup = () => {
    deleteFile(name1); // full size
    deleteFile(name2); // 1920
    deleteFile(name3); // 1280
    deleteFile(name4); // 1024
    deleteFile(name5); // 768
    deleteFile(name6); // lr
  };

  Promise.all(promises.map((p) => p.promise))
    .then((promiseResponse) => {
      var archive = archiver('zip');
      archive.pipe(res);

      res.setHeader('Content-Disposition', 'attachment; filename=download.zip');

      // add each file in promiseRes to the archive
      promiseResponse.forEach((file, i) => {
        let fileName = promises[i].name;
        archive.file(fileName, { name: fileName });
      });

      // finalize the archive & cleanup
      archive.finalize().then(() => {
        cleanup();
      });
    })
    .catch((err) => {
      console.error("Error processing files, let's clean it up", err);
      try {
        cleanup();
      } catch (e) {
        console.error('Error cleaning up files', e);
      }
    });
});

app.post('/delete', async (req, res) => {
  const directory = 'uploads';

  fs.readdir(directory, (err, files) => {
    if (err) {
      console.error(`Error reading directory ${directory}:`, err);
      res.status(500).send('Error reading directory');
      return;
    }

    files.forEach((file) => {
      deleteFile(`uploads/${file}`);
    });

    res.send('Uploads directory cleaned');
  });
});
