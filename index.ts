import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import ItemRoutes from './src/routes/ItemRoutes';
import UserRoutes from './src/routes/UserRoutes';
import multer from 'multer';

const server = express();
dotenv.config();
const PORT = process.env.PORT || 8000;

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(cors());

// Set up multer middleware to handle multipart/form-data
const upload = multer({ dest: 'uploads/' });

// Mount your routes after setting up multer
server.use('/items', upload.array('images'), ItemRoutes);
server.use('/users', UserRoutes);

// Start the server
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
