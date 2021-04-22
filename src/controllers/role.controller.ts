import { Request, Response } from 'express';
import { Roles } from './../models/role.model';
import createError from 'http-errors';
import permissions from './../helpers/permission';

export const createRole = async (req: Request, res: Response) => {
  try {
    const { name, description, permissions } = req.body;
    const existingRole = await Roles.findOne({ name }).exec();
    if (existingRole) {
      return res.status(401).json({
        error: 'Role name already exists.',
        success: false,
      });
    }
    const newRole = await new Roles({
      name,
      description,
      permissions,
      ModifiedBy: req.currentUser._id,
    });

    await newRole.save();
    return res.send(newRole);
  } catch (error) {
    console.log('error', error);

    return res.status(500).json({
      message: error.message,
      error: 'There was an error. Please try again.',
      success: false,
    });
  }
};

export const getRoles = async (req: Request, res: Response) => {
  try {
    const role = await Roles.find({});
    if (!role) {
      throw new createError.Conflict(`No Role exist`);
    }
    return res.status(200).send(role);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: 'There was an error. Please try again.',
      success: false,
    });
  }
};

export const getPermissions = async (req: Request, res: Response) => {
  try {
    return res.status(200).send(permissions);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: 'There was an error. Please try again.',
      success: false,
    });
  }
};

export const editRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const role = await Roles.findOne({ _id: id });
    if (!role) {
      throw new createError.BadRequest(`role doesn't exist`);
    }
    if (role.name == 'administrator' || role.name == 'user') {
      return res.status(400).send('Sorry You cannot edit this role');
    }
    if (req.body.name) role.name = req.body.name;
    if (req.body.permissions) role.permissions = req.body.permission;
    if (req.body.description) role.description = req.body.description;
    role.ModifiedBy = req.currentUser._id;
    await Roles.findByIdAndUpdate({ _id: role.id }, role);
    return res.status(200).send('Updated succesfully!!');
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: 'There was an error. Please try again.',
      success: false,
    });
  }
};

export const deleteRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const role = await Roles.findOne({ _id: id });
    if (!role) {
      throw new createError.BadRequest(`role doesn't exist`);
    }
    if (role.name == 'administrator' || role.name == 'user') {
      return res.status(400).send('Sorry You cannot delete this role');
    }
    await Roles.deleteOne({ _id: id });
    return res.status(200).send(`Role Deleted!`);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: 'There was an error. Please try again.',
      success: false,
    });
  }
};
