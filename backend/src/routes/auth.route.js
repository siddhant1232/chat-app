import express from 'express';
import {  signin, signup,logout } from '../controllers/auth.controllers.js';
import { privateRoute } from '../middlewares/auth.middleware.js';
const router = express.Router();


router.post('/signin',signin);
router.post('/signup',signup);
router.post('/logout',logout);

router.put('/update-profile',privateRoute,updateProfile)

export default router;