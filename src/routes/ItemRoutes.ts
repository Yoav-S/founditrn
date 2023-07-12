import express, { Request, Response } from 'express';
import Item, { IItem } from '../models/ItemModel';

const router = express.Router();

// Route to get all items
router.get('/', (req, res) => {
    // Handle GET request for items
  });

// Route to create a new item
router.post('/', (req, res) => {
    // Handle POST request for items
  });

export default router;
