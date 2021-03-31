// import User, { IUser } from './../models/user.model';
// import { generateJwt, passwordCompare } from "./../helpers/auth.service"
// import createError from "http-errors";
// import { response } from 'express';


// export default class userService {
//     async createUser(
//         name: string,
//         email: string,
//         password: string,
//         confirmPassword: string,
//         role: string,
//       ) : Promise<IUser>{
//         try {
//           const existingUser = await User.findOne({ email }).exec();
    
//           if (existingUser) {
//             throw new createError.Conflict('account with that email already exists.');         
//          }
//          if (confirmPassword !== password) {
//             throw new createError.BadRequest('Password don not match.'); 
//           }
//           const newUser = new User({
//             name,
//             email,
//             password,
//             confirmPassword,
//             role,
//           });
//           let jwt_token = await generateJwt(newUser);
//           response.cookie("jwt_token", jwt_token);
//           return await newUser.save();
         
//         } catch (error) {
//           return error.response;
//         }
//       }
    
// }