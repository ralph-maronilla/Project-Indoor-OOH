// controllers/authController.js
import User from '../models/User.js';
import { hashPassword, comparePassword } from '../utils/passwordUtils.js';
import { UnauthenticatedError, BadRequestError } from '../errors/customError.js';
import { createJWT } from '../utils/tokenUtils.js';
import {generateCookieOptions} from '../utils/cookieUtils.js';
import { StatusCodes } from 'http-status-codes';


export const register = async (req, res, next) => {


  try {


    const { email, password, mobile_number,first_name,last_name,role } = req.body;
    console.log(req.body);
    if (!email || !password) {
      throw new BadRequestError('Email and password are required');
    }

    const existingUser = await User.query().findOne({ email });
    if (existingUser) {
      throw new BadRequestError('User already exists');
    }

    const imageBlob = req.file.buffer;
    const mimeType = req.file.mimetype;
    const hashedPassword = await hashPassword(password);
    const newUser = await User.query().insert({
      email,
      password: hashedPassword,
      mobile_number,
      first_name,
      last_name,
      role,
      user_image: imageBlob,
      mime_type: mimeType
    });

    if(!newUser.role)
    {
      newUser.role = 'user';
    }

    const token = createJWT({ id: newUser.id, email: newUser.email });
     const base64Image = Buffer.from(imageBlob).toString('base64');
    const user_image = `data:${mimeType};base64,${base64Image}`;
    res.status(201).json({
      message: 'User registered successfully',
      user: { id: newUser.id, email: newUser.email, role: newUser.role, 
        first_name: newUser.first_name, last_name: newUser.last_name , 
        mobile_number: newUser.mobile_number , user_image: user_image },
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
      let user_image = null;
      if(user.userImage){
        const base64Image = Buffer.from(user.userImage).toString('base64');
        user_image = `data:${user.mime_type};base64,${base64Image}`;
      }
  
      res.cookie(cookieName, token, cookieOptions);
      res.status(StatusCodes.OK).json({
        message: 'User logged in successfully',
        success: true,
        user: { id: user.id, email: user.email, role: user.role, 
          first_name: user.firstName, last_name: user.lastName , 
          mobile_number: user.mobileNumber , user_image: user_image },
      });
    } catch (error) {
      next(error);
    }
  };
  