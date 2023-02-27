
import { Handler, Context } from 'aws-lambda';
import dotenv from 'dotenv';
import path from 'path';
const dotenvPath = path.join(__dirname, '../../', `config/.env.${process.env.NODE_ENV}`);
dotenv.config({
  path: dotenvPath,
});

// 
import { UserController } from './controller/user';
import { AuthController } from './controller/auth';
import conn from './model/mysql-db';


const userController = new UserController(conn);
const authController = new AuthController(conn);

export const get: Handler = (event: any, context: Context) => {
  return userController.get(event, context);
};
export const updateprofile: Handler = (event: any, context: Context) => {
  return userController.update(event, context);
};
export const register: Handler = (event: any, context: Context) => {
  return userController.create(event, context);
};
export const login: Handler = (event: any, context: Context) => {
  return authController.login(event, context);
};
export const forgotpassword: Handler = (event: any, context: Context) => {
  return authController.forgotpassword(event, context);
};
export const changepassword: Handler = (event: any, context: Context) => {
  return authController.changepassword(event, context);
};
export const resetpassword: Handler = (event: any, context: Context) => {
  return authController.resetpassword(event, context);
};


export const authAuthorizer: Handler = (event: any, context: Context) => {
  return authController.validateJWT(event, context);
};
