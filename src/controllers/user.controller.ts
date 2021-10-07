import { Request, Response } from 'express';
import { User } from './../models/user.model';
import { Roles } from './../models/role.model';
import { generateJwt, passwordCompare, verifyToken } from './../helpers/auth.service';
import { Mail } from './../helpers/mailer';
import { clientUrl } from './../config/client';
import createError from 'http-errors';
import { Profile } from './../models/profile.model';


export const signup = async (req: Request, res: Response) => {
  try {
    let { name, email, password, confirm_password, wallet_address, ref } = req.body;
    const existingUser = await User.findOne({ email }).exec();
    if (ref) {
      const refUser = await User.findOne({ referredBy: ref }).exec();
      if (!refUser) {
        ref = null;
      }
    }
    // Get the user role from Db to default sign person as role "user"
    const role = await Roles.findOne({ name: 'user' }).exec();

    if (existingUser) {
      return res.status(401).json({
        error: 'account with that email already exists.',
        success: false,
      });
    }
    const user = new User({
      name,
      email,
      password,
      confirm_password,
      wallet_address,
      referredBy: ref,
      role: role!._id,
    });
    
    if (confirm_password !== password) {
      return res.status(400).json({
        error: 'password do not match.',
        success: false,
      });
    }
    let userData = await user.save();

    let data = {
      _id: userData._id,
      name: userData.name,
      email: userData.email,
      bitcoin_wallet: userData.wallet_address,
      role: userData.role,
    };

    const token = await generateJwt(data._id);
    res.cookie('jwt-token', token, {
      sameSite: 'none',
      secure: process.env.NODE_ENV === 'production',
    });
    // let link = `${clientUrl}confirm-account/${token}`;
   
    const options = {
      mail: email,
      me: 'admin@alexawealthmngt.com',
      subject: 'Welcome to Bitcoin Store!, Your login details',
      email: '../email/welcome.html',
      variables: { name: name, email: email, password: password },
    };
    await Mail(options);
   
    return res.json({
      message: 'Signup successfully',
      success: true,
      token: token,
      name: data.name,
      email: data.email,
      bitcoin_wallet: data.bitcoin_wallet,
      role: data.role,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: 'There was an error signing up. Please try again.',
      success: false,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).exec();    

    const token = await generateJwt({ user });
    return res.json({
      success: true,
      token: token,
      name: user!.name,
      email: user!.email,
      emailConfirm: user!.emailConfirm,
      blocked: user!.blocked,
      wallet_address: user!.wallet_address,
      wallet_balance: user!.wallet_balance,
      referredBy: user!.referredBy,
      referralUrl: user!.referralUrl,
      userName: user!.userName,
      role: user!.role,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: 'There was an error signing in. Please try again.',
      success: false,
    });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { oldPassword, newPassword } = req.body;
    let { id } = req.params;
    const user = await User.findOne({ _id: id }).exec();

    if (!user) {
      return res.status(401).json({ success: false, error: 'Wrong Email or Password combination' });
    }
    if (user.blocked) {
      throw new createError.BadRequest(
        `Account with email: ${user.email} has been blocked, contact Administrator`
      );
    }
    // if (id !== req.user._id) {
    //   throw new createError.BadRequest(`You cannot change this password`);
    // }
    if (!user.emailConfirm) {
      throw new createError.BadRequest(
        `Please confirm your email: ${user.email} before you can login`
      );
    }
    if (oldPassword === newPassword) {
      throw new createError.BadRequest(`Please you can't use your old password, please change`);
    }

    const passwordMatch = await passwordCompare(user.password, oldPassword);

    if (!passwordMatch) {
      return res.status(401).json({
        error: 'You entered an incorrect password.',
        success: false,
      });
    }
    user.password = newPassword;
    await user.save();

    let email = user.email;    
    let name = user.name;

    const options = {
      mail: email,
      me: 'admin@alexawealthmngt.com',
      subject: 'Welcome to Bitcoin Store!, Your new password details',
      email: '../email/changePassword.html',
      variables: { name: name, email: email, newPassword: newPassword },
    };
    await Mail(options);

    return res.json({
      message: 'Password updated successfully.',
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: 'There was an error. Please try again.',
      success: false,
    });
  }
};
export const forgetPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).exec();

    if (!user) {
      let link = `${clientUrl}confirm-account/${user}`;
      const options = {
        mail: email,
        me: 'admin@alexawealthmngt.com',
        subject: 'Password Reset - Bitcoin Store',
        email: '../email/emailForUserNotFound.html',
        variables: { link: link },
      };
      await Mail(options);
      return res.json({
        message: 'Verification email has been sent.',
        success: true,
      });
    }
    if (user.blocked) {
      throw new createError.BadRequest(
        `Account with email: ${user.email} has been blocked, contact Administrator`
      );
    }

    if (!user.emailConfirm) {
      throw new createError.BadRequest(
        `Please confirm your email: ${user.email} before you can login`
      );
    }

    const token = await generateJwt(email);

    const link = `${clientUrl}pass-reset/${token}/${user._id}`;
    const options = {
      mail: email,
      me: 'admin@alexawealthmngt.com',
      subject: 'Password reset - Bitcoin Store',
      email: '../email/forgotPassword.html',
      variables: { name: user.name, link: link },
    };
    await Mail(options);
    return res.json({
      message: 'Verification email has been sent.',
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: 'There was an error. Please try again.',
      success: false,
    });
  }
};

export const confirmEmail = async (req: Request, res: Response) => {
  try {
    const { email, token } = req.params;
    await verifyToken(token);
    const user = await User.findOne({ email });
    if (!user) {
      throw new createError.BadRequest(`Account doesn't exist`);
    }
    if (user.blocked) {
      throw new createError.BadRequest(
        `Account with email: ${user.email} has been blocked, contact Administrator`
      );
    }
    if (user.emailConfirm) {
      throw new createError.BadRequest(
        `Account with email: ${user.email} has already been confirmed`
      );
    }
    await User.findOneAndUpdate({ email }, { emailConfirm: true });
    return res.status(200).send('Account Activated succesfully!!');
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: 'There was an error. Please try again.',
      success: false,
    });
  }
};

export const blockUser = async (req: Request, res: Response) => {
  try {
    let { id } = req.params;
    const user = await User.findOne({ _id: id }).exec();

    let blockValue = !user?.blocked;

    const userSaved = await User.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: { blocked: blockValue },
      },
      {
        new: true,
      }
    );
    return res.status(200).send(userSaved);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: 'There was an error. Please try again.',
      success: false,
    });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const user = await User.find({})
      .populate([
        {
          path: 'role',
          model: 'Roles',
          select: 'name description permissions',
        },
      ])
      .exec();
    return res.send(user);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: 'There was an error. Please try again.',
      success: false,
    });
  }
};

export const createReferLink = async (req: Request, res: Response) => {
  try {
    const { userName } = req.body;
    const getReferal = await User.findOne({ referralUrl: userName }).exec();

    if (getReferal) {
      return res.status(401).json({
        error: 'Referal link with that username already exists.',
        success: false,
      });
    }

    let link = `${clientUrl}api/v1/signup?ref=${userName}`;

    await User.findOneAndUpdate(
      {
        _id: req.currentUser._id,
      },
      {
        $set: { referralUrl: link, userName: userName },
      }
    );

    return res.status(200).json({
      data: link,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: 'There was an error. Please try again.',
      success: false,
    });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const profile = await new User({
      image: req.file.filename,
      phoneNumber: req.body.phoneNumber,
    });

    const value = await User.findOneAndUpdate(
      {
        _id: req.currentUser._id,
      },
      {
        $set: { image: profile.image, phoneNumber: profile.phoneNumber },
      }
    );

    return res.status(200).json({
      message: 'Profile updated succesfully!!',
      success: true,
      name: value!.name,
      email: value!.email,
      emailConfirm: value!.emailConfirm,
      blocked: value!.blocked,
      wallet_address: value!.wallet_address,
      wallet_balance: value!.wallet_balance,
      referredBy: value!.referredBy,
      referralUrl: value!.referralUrl,
      userName: value!.userName,
      image: value!.image,
      phoneNumber: value!.phoneNumber,
      role: value!.role,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: 'There was an error. Please try again.',
      success: false,
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    await User.findOneAndUpdate({ _id: req.currentUser._id });
    res.clearCookie('jwt-token');
    return res.status(200).json({
      status: true,
      message: 'log out successfully',
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: 'There was an error. Please try again.',
      success: false,
    });
  }
};
