import { Context } from 'aws-lambda';
import { MessageUtil } from '../utils/message';
import { UsersService } from '../service/user';
import { RegisterUserDTO, UpdateUserDTO } from '../model/dto/userDTO';
import { Pool } from 'mysql2/promise';
import bcrypt from "bcrypt"
import { IUser } from '../model/entities/user';

export class UserController extends UsersService {
  constructor(db_conn: Pool) {
    super(db_conn);
  }
  /**
 * Create user
 * @param {*} event
 */
  async create(event: any, context?: Context) {
    console.log('functionName', context.functionName);
    const params: RegisterUserDTO = JSON.parse(event.body);

    const salt = await bcrypt.genSalt(10);

    const password = await bcrypt.hash(params.password, salt)

    try {
      const result = await this.createUser({
        firstname: params.firstname,
        lastname: params.lastname,
        email: params.email,
        telephone: params.telephone,
        password,
        salt
      });

      return MessageUtil.success(result);
    } catch (err) {
      console.error(err);

      return MessageUtil.error(err.code, err.message);
    }
  }


  /**
   * List users
   * @param {*} event
   */
  async list(event: any, context?: Context) {
    console.log('functionName', context.functionName);
    const params: RegisterUserDTO = JSON.parse(event.body);

    try {
      const result = await this.createUser({
        firstname: params.firstname,
        lastname: params.lastname,
        email: params.email,
        telephone: params.telephone,
        password: params.password,
      });

      return MessageUtil.success(result);
    } catch (err) {
      console.error(err);

      return MessageUtil.error(err.code, err.message);
    }
  }
  /**
   * Get loggedIn user
   * @param {*} event
   */
  async get(event: any, context?: Context) {
    console.log('functionName', context.functionName);
    const userid: number = await this.getRequestUserId(event);

    try {
      const result: IUser = await this.findOneUserById(userid);
      const { firstname, lastname, email, telephone } = result;

      return MessageUtil.success({
        firstname, lastname, email, telephone
      });

    } catch (err) {
      console.error(err);

      return MessageUtil.error(err.code, err.message);
    }
  }

  /** 
   * Update User
   * @param {*} event
   */
  async update(event: any, context?: Context) {
    const userid: number = await this.getRequestUserId(event);
    const params: UpdateUserDTO = JSON.parse(event.body);

    try {
      await this.updateUser(userid, {
        firstname: params.firstname,
        lastname: params.lastname,
        telephone: params.telephone,
      });

      return MessageUtil.success({});
    } catch (err) {
      console.error(err);

      return MessageUtil.error(err.code, err.message);
    }
  }
}
