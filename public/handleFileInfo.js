document
  .getElementById('imageInput')
  .addEventListener('change', handleFileSelect, false);

function handleFileSelect(e) {
  const file = e.target.files[0];

  if (!file) {
    console.log('No file selected.');
    return;
  }

  // Basic File Information
  console.log('File Name: ' + file.name);
  console.log('File Size: ' + file.size + ' bytes');
  console.log('File Type: ' + file.type);
}
