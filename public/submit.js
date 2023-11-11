document.getElementById('uploadForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const formData = new FormData();
  const imageFile = document.querySelector('input[type="file"]').files[0];
  formData.append('image', imageFile);

  fetch('/upload', {
    method: 'POST',
    body: formData,
  })
    .then((response) => response.blob())
    .then((blob) => {
      var file = window.URL.createObjectURL(blob);

      var a = document.createElement('a');
      a.href = file;
      a.download = 'download.zip';

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // delete the file from the server
      fetch('/delete', {
        method: 'POST',
        body: formData,
      });
    })
    .catch((error) => console.error(error));
});
