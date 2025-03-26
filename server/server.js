
require('dotenv').config();
const express = require('express');
const firebaseAdmin = require('firebase-admin');

const serviceAccount = process.env.SERVICE_ACCOUNT_PATH; 

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
});

const db = firebaseAdmin.firestore();

// Set up Express app
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());

// POST route to store data in Firestore
app.post('/store-speedtest', async (req, res) => {
  try {
    const speedtestData = req.body; // Assuming the data comes as JSON
    const docRef = db.collection('speedtests').doc(); // Create a new document
    await docRef.set(speedtestData); // Store the data

    res.status(200).json({ message: 'Data stored successfully!' });
  } catch (error) {
    console.error('Error storing data:', error); // Log the error
    res.status(500).json({ error: 'Failed to store data', details: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
