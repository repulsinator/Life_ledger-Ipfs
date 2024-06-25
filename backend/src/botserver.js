const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

app.use(bodyParser.json());

// Endpoint to handle chatbot requests
app.post('/chatbot', async (req, res) => {
  const { userInput } = req.body;

  try {
    // Replace with your Hugging Face API call
    const response = await axios.post('YOUR_HUGGING_FACE_API_ENDPOINT', {
      inputs: userInput
    }, {
      headers: {
        'Authorization': `Bearer YOUR_HUGGING_FACE_API_TOKEN`
      }
    });

    res.json({ reply: response.data });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing the request');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
