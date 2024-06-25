///to use this install dependencies by running npm install express multer axios cors form-data
// run the server by running node src/backend/ipfsserver.js
// This is the backend server that will handle the file uploads and pinning to IPFS using Pinata
const express = require('express');
const multer = require('multer');
const axios = require('axios');
const cors = require('cors');
const FormData = require('form-data');
require('dotenv').config();

const app = express();
const port = process.env.PINATA_PORT || 4000; // Default port to listen


// Set up CORS
app.use(cors());

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const PINATA_API_KEY = process.env.PINATA_API;
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET;

const pinata = axios.create({
  baseURL: 'https://api.pinata.cloud/',
  headers: {
    pinata_api_key: PINATA_API_KEY,
    pinata_secret_api_key: PINATA_SECRET_API_KEY,
  },
});

const uploadFileToIPFS = async (file) => {
  const formData = new FormData();
  formData.append('file', file.buffer, { filename: file.originalname });

  const metadata = JSON.stringify({
    name: file.originalname,
  });
  formData.append('pinataMetadata', metadata);

  const options = JSON.stringify({
    cidVersion: 0,
  });
  formData.append('pinataOptions', options);

  try {
    const response = await pinata.post('pinning/pinFileToIPFS', formData, {
      headers: {
        ...formData.getHeaders()
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading file to IPFS:', error);
    throw error;
  }
};

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const result = await uploadFileToIPFS(req.file);
    res.json({
      success: true,
      ipfsHash: result.IpfsHash,
      timestamp: result.Timestamp,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to upload file to IPFS',
      error: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${4000}`);
});
