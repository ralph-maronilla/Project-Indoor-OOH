// controllers/authController.js
import User from '../models/User.js';
import { hashPassword, comparePassword } from '../utils/passwordUtils.js';
import { UnauthenticatedError, BadRequestError } from '../errors/customError.js';
import { createJWT } from '../utils/tokenUtils.js';
import {generateCookieOptions} from '../utils/cookieUtils.js';
import { StatusCodes } from 'http-status-codes';
export const register = async (req, res, next) => {
  try {
    const { email, password, mobile_number } = req.body;

    if (!email || !password) {
      throw new BadRequestError('Email and password are required');
    }

    const existingUser = await User.query().findOne({ email });
    if (existingUser) {
      throw new BadRequestError('User already exists');
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await User.query().insert({
      email,
      password: hashedPassword,
      mobile_number,
    });

    const token = createJWT({ id: newUser.id, email: newUser.email });
     
    res.status(201).json({
      message: 'User registered successfully',
      user: { id: newUser.id, email: newUser.email },
      token,
    });
  } catch (error) {
    next(error);
  }
};



export const login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        throw new BadRequestError('Email and password are required');
      }
  
      const user = await User.query().findOne({ email });
      if (!user) {
        throw new UnauthenticatedError('Invalid credentials');
      }
  
      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        throw new UnauthenticatedError('Invalid credentials');
      }
  
      const token = createJWT({ id: user.id, email: user.email });
      const cookieName = "project-indoor-ooh"
      const cookieOptions = generateCookieOptions();
      res.cookie(cookieName, token, cookieOptions);
      res.status(StatusCodes.OK).json({
        message: 'User logged in successfully',
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };
  