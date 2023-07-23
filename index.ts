import express from 'express';
import dotenv from 'dotenv';
import UserRoutes from './src/routes/UserRoutes'
import ItemRoutes from './src/routes/ItemRoutes'
const cors = require('cors');
const bodyParser = require('body-parser');
import multer from 'multer'; // Import multer here

// Initialize Express app and set up middleware
const server = express();
dotenv.config();
const PORT = process.env.PORT || 8000;

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(cors());

// Set up multer middleware to handle multipart/form-data
const upload = multer();

// Mount your routes after setting up multer
server.use('/items', upload.none(), ItemRoutes);

// User routes
server.use('/users', UserRoutes);

// Start the server
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
