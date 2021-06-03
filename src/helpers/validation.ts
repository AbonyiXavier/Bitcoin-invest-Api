import { NextFunction, Request, Response } from 'express';
import joi from 'joi';
import { User } from '../models/user.model';
import { passwordCompare, generateJwt } from './../helpers/auth.service';
import createError from 'http-errors';
import permissions from './../helpers/permission';

export const validateAuthDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const schema = joi.object().keys({
      name: joi.string().min(6).max(255).required(),
      email: joi.string().email().required(),
      password: joi.string().min(6).required(),
      confirm_password: joi.string().min(6).required(),
      wallet_address: joi.string().required(),
      ref: joi
        .string()
        .min(5)
        .regex(/^[a-zA-Z0-9]{3,8}$/)
        .messages({
          'any.required': 'Sorry, referal username is required',
          'string.pattern.base': 'referal username must contain only from a-z or A-Z or 0-9.',
          'string.empty': 'Sorry, referal username cannot be an empty field',
          'string.min': 'referal username should have a minimum length of 5',
        }),
    });
    const val = await schema.validateAsync(req.body);
    return next();
  } catch (error) {
    return res.status(400).json({ success: false, error: error.details[0].message });
  }
};
export const validateLoginDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const schema = joi.object().keys({
      email: joi.string().email().required(),
      password: joi.string().required(),
    });
    await schema.validateAsync(req.body);
    return next();
  } catch (error) {
    return res.status(400).json({ success: false, error: 'Wrong Email or Password combination' });
  }
};
export const validateTransaction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const schema = joi.object().keys({
      amount: joi.number().required(),
      approved: joi.boolean(),
      txn_type: joi.string().valid('deposit', 'withdraw').default('deposit'),
      plan: joi.string().required(),
    });
    await schema.validateAsync(req.body);
    return next();
  } catch (error) {
    return res.status(400).json({ success: false, error: error.details[0].message });
  }
};

export const validatePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).exec();
    if (!user) {
      return res
        .status(401)
        .json({ success: false, error: 'Wrong Email or Password combination.' });
    }
    if (user.blocked) {
      throw new createError.BadRequest(
        `Account with email: ${email} has been blocked, contact Administrator`
      );
    }
    if (!user.emailConfirm) {
      throw new createError.BadRequest(`Please confirm your email: ${email} before you can login`);
    }
    const passwordMatch = await passwordCompare(user.password, password);

    if (!passwordMatch) {
      return res.status(401).json({
        error: 'Wrong Email or Password combination',
        success: false,
      });
    }
    return next();
  } catch (error) {
    console.log('error login', error.message);

    return res.status(500).json({
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
    await schema.validateAsync(req.body);

    return next();
  } catch (error) {
    return res.status(400).json({ success: false, error: error.details[0].message });
  }
};

export const validateEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const schema = joi.object().keys({
      email: joi.string().email().required(),
    });
    await schema.validateAsync(req.body);
    return next();
  } catch (error) {
    return res.status(400).json({ success: false, error: error.details[0].message });
  }
};

export const validateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const schema = joi.object().keys({
      image: joi.string(),
      phoneNumber: joi.string(),
    });
    await schema.validateAsync(req.body);

    return next();
  } catch (error) {
    return res.status(400).json({ success: false, error: error.details[0].message });
  }
};
export const validatePermission = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const schema = joi.object().keys({
      name: joi.string().trim().lowercase().required(),
      description: joi.string().required(),
      permissions: joi
        .array()
        .items(joi.string().valid(...permissions))
        .required()
        .unique()
        .messages({
          'array.length': `Permissions can not be more than ${permissions.length}`,
          'array.min': 'Please permission should contain atleast 1 permission',
          'any.required': 'Sorry, permission is required',
        }),
    });
    await schema.validateAsync(req.body);

    return next();
  } catch (error) {
    return res.status(400).json({ success: false, error: error.details[0].message });
  }
};

export const validateReferalLink = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const schema = joi.object().keys({
      userName: joi
        .string()
        .min(5)
        .regex(/^[a-zA-Z0-9]{3,8}$/)
        .messages({
          'any.required': 'Sorry, referal username is required',
          'string.pattern.base': 'referal username must contain only from a-z or A-Z or 0-9.',
          'string.empty': 'Sorry, referal username cannot be an empty field',
          'string.min': 'referal username should have a minimum length of 5',
        })
        .required(),
    });
    await schema.validateAsync(req.body);

    return next();
  } catch (error) {
    return res.status(400).json({ success: false, error: error.details[0].message });
  }
};
