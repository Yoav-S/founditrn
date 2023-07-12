// Import necessary modules and packages
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import UserRoutes from './src/routes/UserRoutes'
import ItemRoutes from './src/routes/ItemRoutes'
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialize Express app and set up middleware
const server = express();
dotenv.config();
const PORT = process.env.PORT || 8000;

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(cors());

server.use('/items', ItemRoutes);

// User routes
server.use('/users', UserRoutes);
// Start the server
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
