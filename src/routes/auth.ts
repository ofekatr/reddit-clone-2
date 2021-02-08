import { Request, Response, Router } from 'express';
import { isEmpty, validate } from 'class-validator';
import bcrpyt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

import { User } from '../entities/User';
import { authMiddleware } from '../middleware/auth';
const ServerConfig = require('../configs/server-config');

const register = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  try {
    let errors: any= {};
    const existingUserEmail = await User.findOne({ email });
    const existingUserUsername = await User.findOne({ username });
    if (existingUserEmail) errors.email = "Email is already taken.";
    if (existingUserUsername) errors.username = "Username is already taken.";
    if (Object.keys(errors).length > 0) return res.status(400).json(errors);

    const user = new User({ email, username, password });

    errors = await validate(user);
    if (errors.length > 0) return res.status(400).json(errors);

    await user.save();
    return res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
}

const login = async (req: Request, res: Response) => {
  const { DEV_MODE } = process.env;
  const { username, password } = req.body;
  
  try { 
    const errors: any = {};
    if (isEmpty(username)) errors.username = 'Username must not be empty';
    if (isEmpty(password)) errors.password = 'Password must not be empty';
    if (Object.keys(errors).length > 0) return res.status(400).json(errors);

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const passwordMatch = await bcrpyt.compare(password, user.password)
    if (!passwordMatch) res.status(401).json({ error: 'Invalid credentials.' });

    const token = jwt.sign({
      username,
    }, ServerConfig.JWT_Key);

    res.set('Set-Cookie', cookie.serialize('token', token, {
      httpOnly: true,
      secure: !DEV_MODE,
      sameSite: 'strict',
      maxAge: 3600,
      path: '/'
    }));

    return res.json({ user, token });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: e.message });
  }
}

const me = async (req: Request, res: Response) => {
  return res.json(res.locals.user);
}

const logout = (_: Request, res: Response) => {
  const { DEV_MODE } = process.env;
  res.set('Set-Cookie', cookie.serialize('token', '', {
    httpOnly: true,
    secure: !DEV_MODE,
    sameSite: 'strict',
    expires: new Date(0),
    path: '/'
  }));


  return res.status(204).send();
}

const router = Router();
router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, me);
router.get('/logout', authMiddleware, logout);

export { router as authRoutes };