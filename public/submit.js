document.getElementById('uploadForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const formData = new FormData();
  const imageFile = document.querySelector('input[type="file"]').files[0];
  formData.append('image', imageFile);

  fetch('/upload', {
    method: 'POST',
    body: formData,
  })
    .then((response) => response.text())
    .then((data) => {
      console.log(data);
      alert('Image uploaded successfully!');
    })
    .catch((error) => {
      console.error('Error:', error);
    });
});
