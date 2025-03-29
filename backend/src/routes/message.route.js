import express from 'express';
import { privateRoute } from '../middlewares/auth.middleware.js';
import {getUsersForSidebar,getAllmessages} from '../controllers/message.controller.js'


const router = express.Router();

router.get('/users',privateRoute,getUsersForSidebar);
router.get('/:id',privateRoute,getAllmessages)

export default router;