import { Router } from 'express';
import * as AuthService from '../services/authService.js';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const user = await AuthService.registerUser(req.body);
    res.status(201).json({ status: 'success', user });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { token, user } = await AuthService.loginUser(req.body.email, req.body.password);
    res.cookie('token', token, { httpOnly: true }).json({ status: 'success', user });
  } catch (err) {
    res.status(401).json({ status: 'error', message: err.message });
  }
});

export default router;