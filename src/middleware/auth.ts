import { verifyToken } from "../helpers/auth.service";
import { NextFunction, Request, Response } from 'express';
import joi from 'joi';


export const validateUserToken = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) {
    return res.status(403).json({ success: false, error: 'Authorization Token is required.' });
  }
  const { authorization } = req.headers;
  const schema = joi.object()
    .keys({
      authorization: joi.string()
        .regex(/^Bearer [A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/)
        .required()
        .label('authorization [header]')
    })
    .unknown(true);
   await schema.validateAsync(req.headers)
  try {
    const [, token, ] = authorization!.split('Bearer ');
    const  user = await verifyToken(token);
    
    req.currentUser = user
    // console.log("test",  req.currentUser);
    
    return next();
  } catch (error) {
    return res.status(403).json({ success: false, error: 'Invalid or no Authorization Token was provided.' });
  }
};