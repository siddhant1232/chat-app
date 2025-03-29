import express from 'express';
import { privateRoute } from '../middlewares/auth.middleware.js';
import {getUsersForSidebar,getAllmessages,sendMessage} from '../controllers/message.controller.js'


const router = express.Router();

router.get('/users',privateRoute,getUsersForSidebar);
router.get('/:id',privateRoute,getAllmessages)

router.post('/send/:id',privateRoute,sendMessage)
export default router;