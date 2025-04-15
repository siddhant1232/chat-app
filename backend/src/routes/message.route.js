// src/routes/message.route.js
import express from 'express';
import { privateRoute } from '../middlewares/auth.middleware.js';
import {getUsersForSidebar,getAllmessages,sendMessage} from '../controllers/message.controller.js'
import upload from '../lib/multer.config.js';

const router = express.Router();

router.get('/users',privateRoute,getUsersForSidebar);
router.get('/:id',upload.single('file'),privateRoute,getAllmessages)

router.post('/send/:id', upload.single('file'),privateRoute,sendMessage)
export default router;