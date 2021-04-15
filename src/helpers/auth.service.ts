import jwt, { Secret } from "jsonwebtoken";
import * as bcrypt from 'bcrypt';
import { addMonths, format, formatDistance } from "date-fns";

const secret: Secret = `${process.env.JWT_KEY}`;
const refreshKey = `${process.env.REFRESH_TOKEN_KEY}`;

    export const  generateJwt = async (payload: string | object) => {
    const token = await jwt.sign({ payload } , secret, { expiresIn: "1d" });
    return token;
  }
  
  // export const refreshToken = async (payload: string | object , secret = refreshKey) => {
  //   const token = await jwt.sign({ payload }, secret, { expiresIn: "7d" });
  //   return token;
  // }

  export const hashPassword = async (password: string) => {
    const hashPass = await bcrypt.hash(password, bcrypt.genSaltSync(10));
    return hashPass;
  }

  export const passwordCompare = async(hashPassword: string, password: string) => {
    const compareHash = bcrypt.compareSync(password, hashPassword);
    return compareHash;
  }

 export const verifyToken = (token: string) => {
    return jwt.verify(token, secret)
}

export const calculateInvestmentMaturityDate = (date: string | number | Date, numberOfMonths: number) => {
    let time = addMonths(new Date(date), numberOfMonths);
    const dates = {
      formatted: format(new Date(time), "EEEE do, MMMM yyyy"),
      jsDate: format(new Date(time), "yyyy-MM-dd"),
    };
    return dates;
  }
