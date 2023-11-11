import fs from 'fs';
import path from 'path';

import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import archiver from 'archiver';

const app = express();
const upload = multer({ dest: 'uploads/' });

const PORT = process.env.PORT || 8080;

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

  Promise.all(promises.map((p) => p.promise))
    .then((promiseRes) => {
      var archive = archiver('zip');
      archive.pipe(res);

      res.setHeader('Content-Disposition', 'attachment; filename=download.zip');

      // add each file in promiseRes to the archive
      promiseRes.forEach((file, i) => {
        archive.file(file, { name: promises[i].name });
      });

      // finalize the archive
      archive.finalize();

      return archive;
    })
    .catch((err) => {
      console.error("Error processing files, let's clean it up", err);
      try {
        fs.unlink(`${name}-1920.jpg`);
        fs.unlink(`${name}-1280.jpeg`);
        fs.unlink(`${name}-1024.jpeg`);
        fs.unlink(`${name}-768.jpeg`);
        fs.unlink(`${name}-lr.jpeg`);
      } catch (e) {
        res.send('Error processing files');
      }
    });

  // cleanup
  // fs.unlink(req.file.path);
  return res;
});
