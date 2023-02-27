import { Context } from 'aws-lambda';
import { MessageUtil, StatusCode } from '../utils/message';
import { UsersService } from '../service/user';
import { ChangeUserPasswordDTO, ForgotPasswordDTO, LoginUserDTO, ResetPasswordDTO } from '../model/dto/userDTO';
import { Pool } from 'mysql2/promise';
import bcrypt from "bcrypt";
import { IUser } from '../model/entities/user';

export class AuthController extends UsersService {
  constructor(db_conn: Pool) {
    super(db_conn);
  }

  /**
   * Login user
   * @param event
   */
  async login(event: any, context: Context) {
    const body: LoginUserDTO = JSON.parse(event.body);

    try {
      const user = await this.findOneUser(" WHERE email = ? OR telephone = ? ", [body.loginId, body.loginId]);
      if (!user) return MessageUtil.error(StatusCode.badRequest, "Invalid username or password");

      const valid = await bcrypt.compare(body.password, user.password)
      if (!valid) return MessageUtil.error(StatusCode.badRequest, "Invalid username or password");

      return MessageUtil.success({ message: "Login success", token: this.generateJWT(user.id) });
    } catch (err) {
      return MessageUtil.error(StatusCode.intetnalError, "Internal server error");
    }
  }

  /**
   * Generates token for user to reset password
   */
  async forgotpassword(event: any, context: Context) {
    const body: ForgotPasswordDTO = JSON.parse(event.body);
    try {
      const user: IUser = await this.findOneUser("WHERE email = ? OR telephone = ? ", [body.loginId, body.loginId]);
      if (!user) return MessageUtil.error(StatusCode.badRequest, "User not found or does not exist!");
      const update: any = await this.updateUser(user.id, { token: this.generateToken() })
      if (update.changedRows > 0)
        return MessageUtil.success({ message: "Password reset initiate success" });
    } catch (err) {
      return MessageUtil.error(StatusCode.intetnalError, "Internal server error");
    }
  }

  /**
   * reset user password
   * @param event
   */
  async resetpassword(event: any, context: Context) {
    // The amount of memory allocated for the function
    const body: ResetPasswordDTO = JSON.parse(event.body);


    try {
      const user: IUser = await this.findOneUser("WHERE email = ? OR telephone = ?  token = ? ", [body.loginId, body.loginId, body.token]);
      if (!user) return MessageUtil.error(StatusCode.badRequest, "User not found or does not exist!");

      const currentTime = new Date().getTime();
      const tokenUpdate = new Date(user.updated_at).getTime() + 30 * 60 * 1000;

      if (currentTime > tokenUpdate) return MessageUtil.error(StatusCode.badRequest, "Token already expired please request new token");

      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(body.password, salt);
      // Update token to ensure old token is invalid
      // Update new password and salt
      const update: any = await this.updateUser(user.id, { token: this.generateToken(), password, salt })
      if (update.changedRows > 0)
        return MessageUtil.success({ message: "Password reset initiate success" });
    } catch (err) {
      return MessageUtil.error(StatusCode.intetnalError, "Internal server error");
    }
  }

  /**
   * Change user password
   * @param event
   */
  async changepassword(event: any, context: Context) {

    // The amount of memory allocated for the function
    const body: ChangeUserPasswordDTO = JSON.parse(event.body);
    const userid: number = await this.getRequestUserId(event);

    try {
      const user: IUser = await this.findOneUserById(userid);

      const valid = await bcrypt.compare(body.oldPassword, user.password)
      if (!valid) return MessageUtil.error(StatusCode.forbidden, "Please provide current passowrd");

      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(body.newPassword, salt);
      // Update token to ensure old token is invalid
      // Update new password and salt
      await this.updateUser(userid, { password, salt });
      return MessageUtil.success({ messagw: "Success" });
    } catch (err) {
      console.error(err);

      return MessageUtil.error(err.code, err.message);
    }
  }


  async validateJWT(event: any, context: Context) {
    // The amount of memory allocated for the function

    const authHeader = event.headers['Authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    const user: any = await this.authenticateToken(token);

    if (!token || !user) throw Error('Unauthorized');
    return this.generatePolicy('user', 'Allow', event.methodArn, user.userid)
  };
}
