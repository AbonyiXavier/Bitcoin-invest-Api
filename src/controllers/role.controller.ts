import { Request, Response } from 'express';
import { Roles } from './../models/role.model';

export const createRole = async (req: Request, res: Response) => {
    try {
        const { name, description, permission } = req.body;
        const existingRole = await Roles.findOne({ name }).exec();
        if (existingRole) {
          return res
            .status(401)
            .json({
              error: 'Role name already exists.',
              success: false,
            });
        }
        const newRole = await  new Roles({
            name,
            description,
            permission,
            ModifiedBy: req.currentUser.payload.user._id
        })

        await newRole.save()
      return res.send(newRole) 
    } catch (error) {
        console.log("error", error);
        
    }
}