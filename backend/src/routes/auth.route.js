import express from 'express';
import {  signin, signup,logout } from '../controllers/auth.controllers.js';
const router = express.Router();


router.get('/signin',signin);
router.post('/signup',signup);
router.post('/logout',logout);

export default router;