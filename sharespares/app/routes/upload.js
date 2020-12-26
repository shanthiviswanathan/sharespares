module.exports = app => {
    const upload = require('../utils/ImageStorage');
    // Upload a file
    app.post("/upload", upload.ImageStorage);

  };