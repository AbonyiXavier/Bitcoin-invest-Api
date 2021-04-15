import { NextFunction, Request, Response } from 'express';
import joi from 'joi';
import { User } from '../models/user.model';
import { passwordCompare, generateJwt } from "./../helpers/auth.service"
import createError from "http-errors";



export const validateAuthDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const schema = joi.object().keys({
      name : joi.string().min(6).max(255).required(),
      email: joi
        .string()
        .email()
        .required(),
      password: joi.string().min(6).required(),
      confirm_password: joi.string().min(6).required(),
      wallet_address: joi.string().required()
    });
    const val = await schema.validateAsync(req.body)
    return next();
    
  } catch (error) {
    return res
    .status(400)
    .json({ success: false, error:error.details[0].message });
  }
  };
export const validateLoginDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const schema = joi.object().keys({
      email: joi
        .string()
        .email()
        .required(),
      password: joi.string().min(6).required(),
    });
     await schema.validateAsync(req.body)
    return next();
    
  } catch (error) {
    return res
    .status(400)
    .json({ success: false, error:error.details[0].message });
  }
  };

  export const validatePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email }).exec();
      if (!user) {
        return res
        .status(401)
        .json({ success: false, error: 'Invalid email/password combination.' });
      }
      if (user.blocked) {
        throw new createError.BadRequest(`Account with email: ${email} has been blocked, contact Administrator`);
      }
      if (!user.emailConfirm) {
        throw new createError.BadRequest(`Please confirm your email: ${email} before you can login`);
      }
      const passwordMatch = await passwordCompare(user.password, password);
  
      if (!passwordMatch) {
        return res
          .status(401)
          .json({
            error: 'Incorrect email/password combination.',
            success: false,
        });
      }
      return next();
    } catch (error) {
      console.log("error login", error.message);
      
      return res
      .status(500)
      .json({
        message: error.message,
        error: 'There was an error. Please try again.',
        success: false,
      });
    }
  };

  export const validateChangePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const schema = joi.object().keys({
        newPassword: joi.string().min(6).required(),
        oldPassword: joi.string().min(6).required(),
      });
      await schema.validateAsync(req.body)
  
      return next();
      
    } catch (error) {
      return res
      .status(400)
      .json({ success: false, error:error.details[0].message });
    }
  };

  export const validateEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const schema = joi.object().keys({
        email: joi
          .string()
          .email()
          .required(),
      });
      await schema.validateAsync(req.body)
      return next();
      
    } catch (error) {
      return res
      .status(400)
      .json({ success: false, error:error.details[0].message });
    }
  };

  export const validateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const schema = joi.object().keys({
        image: joi.string(),
        phoneNumber: joi.string(),
      });
      await schema.validateAsync(req.body)
  
      return next();
      
    } catch (error) {
      return res
      .status(400)
      .json({ success: false, error:error.details[0].message });
    }
  };