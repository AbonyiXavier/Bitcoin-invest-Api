import { NextFunction, Request, Response } from 'express';
var _ = require('lodash');

export const permit = (permit: any) => {
  try {
    return async function (req: Request, res: Response, next: NextFunction) {
      const permissions = req.currentUser.role.permissions; //Get the permission of user from decoded value
      const hasPermit = _.includes(permissions, permit);
      if (!hasPermit) {
        return res.status(403).send('Unauthorized access!');
      }
      req.currentUser = req.currentUser;
      next();
      return;
    };
  } catch (error) {
    return 'Invalid/expired Token';
  }
};
