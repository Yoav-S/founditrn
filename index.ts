// Import necessary modules and packages
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import ItemRoutes from './src/routes/ItemRoutes';
import UserRoutes from './src/routes/UserRoutes';
const multer = require('multer');

const server = express();
dotenv.config();
const PORT = process.env.PORT || 8000;

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(cors());

// Set up multer middleware to handle multipart/form-data
const upload = multer({ dest: 'uploads/', limits: { fileSize: 10 * 1024 * 1024 } });

// Mount your routes after setting up multer
server.use('/items', upload.array('images'), ItemRoutes);
server.use('/users', upload.single('image'), UserRoutes);

// Start the server
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
