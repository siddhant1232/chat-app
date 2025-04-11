import express from 'express';
import { privateRoute } from '../middlewares/auth.middleware.js';
import {getUsersForSidebar,getAllmessages,sendMessage} from '../controllers/message.controller.js'
import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(), // Store file in buffer (not disk)
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max (adjust as needed)
});

const router = express.Router();

router.get('/users',privateRoute,getUsersForSidebar);
router.get('/:id',privateRoute,getAllmessages)

router.post('/send/:id',privateRoute,sendMessage)
export default router;