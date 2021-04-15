import { Request, Response } from 'express';
import { User } from './../models/user.model';
import { generateJwt, passwordCompare, verifyToken } from "./../helpers/auth.service"
import { Mail } from "./../helpers/mailer"
import { clientUrl } from "./../config/client"
import createError from "http-errors";



    export const signup = async (req: Request, res: Response) => {
        try {
            const { name, email, password, confirm_password, wallet_address } = req.body;
            const existingUser = await User.findOne({ email }).exec();
            if (existingUser) {
              return res
                .status(401)
                .json({
                  error: 'account with that email already exists.',
                  success: false,
                });
            }
            const user = new User({
                name,
                email,
                password,
                confirm_password,
                wallet_address
              });
              if (confirm_password !== password) {
                return res
                .status(400)
                .json({
                  error: 'password do not match.',
                  success: false,
                });
              }
              let userData = await user.save();
              let data = {
                  _id: userData._id,
                  name: userData.name,
                  email: userData.email,
                  bitcoin_wallet: userData.wallet_address
              }

              const token = await generateJwt(data._id);
              res.cookie("jwt-token", token);
              let link = `${clientUrl}confirm-account/${token}`;
              const options = {
                mail: email,
                subject: "Welcome to Bitcoin Store!, confirm your email",
                email: "../services/email/templates/welcome.html",
                variables: { name: name, link: link },
              };
              await Mail(options);
              return res.json({
                   message: `Confirm your email on the link sent to ${email}`,
                   success: true, 
                   jwt: token,
                   user: data,
                 });
        } catch (error) {            
            return res.status(500).json({
                message: error.message,
                error: 'There was an error signing up. Please try again.',
                success: false
              });
        }
    }

    export const login = async (req: Request, res: Response) => {
      try {
        const { email } = req.body;
        const user = await User.findOne({ email }).exec();
        
        const token = await generateJwt({user});
        res.cookie("jwt-token", token);
        return res.json({
           success: true, 
           data: token,
           });
      } catch (error) {
        return res.status(500).json({
          message: error.message,
          error: 'There was an error signing in. Please try again.',
          success: false
        });
      }
    };

    export const changePassword = async (req: Request, res: Response) => {
      try {
        const { oldPassword, newPassword } = req.body;
        let { id } = req.params;
        const user = await User.findOne({ _id: id }).exec();
        console.log("userEmail", user);
        
        if (!user) {
          return res
            .status(401)
            .json({ success: false, error: 'Invalid email/password combination.' });
        }
        if (user.blocked) {
          throw new createError.BadRequest(`Account with email: ${user.email} has been blocked, contact Administrator`);
        }
        // if (id !== req.user._id) {
        //   throw new createError.BadRequest(`You cannot change this password`);
        // }
        if (!user.emailConfirm) {
          throw new createError.BadRequest(`Please confirm your email: ${user.email} before you can login`);
        }
        if (oldPassword === newPassword) {
          throw new createError.BadRequest(`Please you can't use your old password, please change`);
        }
        
        const passwordMatch = await passwordCompare(user.password, oldPassword);
    
        if (!passwordMatch) {
          return res.status(401).json({
            error: 'You entered an incorrect password.',
            success: false
          });
        }
        user.password = newPassword;
        await user.save();
    
        return res.json({
          message: 'Password updated successfully.',
          success: true,
        });
      } catch (error) {        
        return res.status(500).json({
          message: error.message,
          error: 'There was an error. Please try again.',
          success: false
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
            subject: "Password Reset - Bitcoin Store",
            email: "../services/email/templates/emailForUserNotFound.html",
            variables: { link: link },
          };
          await Mail(options);
          return res.json({
            message: 'Verification email has been sent.',
            success: true,
          });
        }
        if (user.blocked) {
          throw new createError.BadRequest(`Account with email: ${user.email} has been blocked, contact Administrator`);
        }
       
        if (!user.emailConfirm) {
          throw new createError.BadRequest(`Please confirm your email: ${user.email} before you can login`);
        }

        const token = await generateJwt(email);

        const link = `${clientUrl}pass-reset/${token}/${user._id}`;
        const options = {
          mail: email,
          subject: "Password reset - Bitcoin Store",
          email: "../services/email/templates/forgotPassword.html",
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
          success: false
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
          throw new createError.BadRequest(`Account with email: ${user.email} has been blocked, contact Administrator`);
        }
        if (user.emailConfirm) {
          throw new createError.BadRequest(`Account with email: ${user.email} has already been confirmed`);
        }
        await User.findOneAndUpdate(
          { email },
          { emailConfirm: true }
        );
        return res.status(200).send("Account Activated succesfully!!");
      } catch (error) {
        return res.status(500).json({
          message: error.message,
          error: 'There was an error. Please try again.',
          success: false
        });
      }
    }

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
          success: false
        });
      }
    }

    export const getUsers = async (req: Request, res: Response) => {
      try {        
        const user = await User.findOne({_id: req.currentUser.payload.user._id }).exec()        
        return res.send(user)        
      } catch (error) {
        return res.status(500).json({
          message: error.message,
          error: 'There was an error. Please try again.',
          success: false
        });
      }
    }