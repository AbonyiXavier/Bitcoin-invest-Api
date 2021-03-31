// import { NextFunction, Request, Response } from 'express';
// import { Roles } from './../models/role.model'
// var _ = require('lodash');

// export const permit = (permit: any) => {
//     try {
//     return async function (req: Request, res: Response, next: NextFunction) {
//     let role = await Roles.findOne({ _id: req.user.role._id })
//     const permissions = role.permission
//     const hasPermit = _.includes(permissions, permit)
//     if (!hasPermit) {
//         return res.status(403).send("Unauthorized access!")
//     }
//     req.user = req.user
//     next()
//     return
//      }
//     } catch (error) {
//         return res.status(401).send("Invalid/expired Token")
//     } 
// }