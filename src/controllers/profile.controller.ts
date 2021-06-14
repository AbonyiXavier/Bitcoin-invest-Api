import { Request, Response } from 'express';
import { Profile } from './../models/profile.model';
import createError from 'http-errors';
const axios = require('axios');

export const addProfile = async (req: Request, res: Response) => {
  try {
    const newProfile = await new Profile({
      image: req.file.filename,
      phoneNumber: req.body.phoneNumber,
      owner: req.currentUser._id,
    });
    await newProfile.save();
    return res.json({
      message: 'Profile details added successfully',
      success: true,
      newProfile,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: 'There was an error. Please try again.',
      success: false,
    });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await Profile.find({})
      .populate([
        {
          path: 'owner',
          model: 'User',
          select:
            'name email _id emailConfirm blocked wallet_address wallet_balance referredBy referralUrl userName role',
        },
      ])
      .exec();
    return res.json({
      success: true,
      name: user.owner.name,
      email: user.owner.email,
      emailConfirm: user.owner.emailConfirm,
      blocked: user.owner.blocked,
      wallet_address: user.owner.wallet_address,
      wallet_balance: user.owner.wallet_balance,
      referredBy: user.owner.referredBy,
      referralUrl: user.owner.referralUrl,
      userName: user.owner.userName,
      role: user.owner.role,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: 'There was an error. Please try again.',
      success: false,
    });
  }
};
export const getCountries = async (req: Request, res: Response) => {
  try {
    let response = await axios.get('https://restcountries.eu/rest/v2/all');
    res.json(response.data);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: 'There was an error. Please try again.',
      success: false,
    });
  }
};

export const editProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const profile = await Profile.findOne({ _id: id })
      .populate([
        {
          path: 'owner',
          model: 'User',
          select: 'name email _id emailConfirm blocked',
        },
      ])
      .exec();

    if (!profile) {
      throw new createError.BadRequest(`Profile doesn't exist`);
    }
    if (req.file.filename) profile.image = req.file.filename;
    if (req.body.phoneNumber) profile.phoneNumber = req.body.phoneNumber;
    const updateProfile = await profile.save();
    return res.status(200).json({
      message: 'Profile updated succesfully!!',
      updateProfile,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: 'There was an error. Please try again.',
      success: false,
    });
  }
};
