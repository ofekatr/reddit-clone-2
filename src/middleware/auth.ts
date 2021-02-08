import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from "express";
import { User } from '../entities/User';

const ServerConfig = require('../configs/server-config');


export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.cookies || {};
    if (!token) throw new Error('Unauthenticated.');
    
    const { username }: any = jwt.verify(token, ServerConfig.JWT_Key);
    const user = await User.findOne({ username });
    if (!user) throw new Error('Unauthenticated.');

    res.locals.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: error.message });
  }  
}