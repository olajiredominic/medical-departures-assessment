import { Pool } from 'mysql2/promise';
import { IUser } from '../model/entities/user';
import jwt from "jsonwebtoken";

export class UsersService {
  private userDBConn: Pool;
  constructor(conn: Pool) {
    this.userDBConn = conn;
  }

  /**
   * Create book
   * @param params
   */
  protected async createUser(params: IUser): Promise<any> {
    try {
      const conn = await this.userDBConn.getConnection()
      const [rows, fields] = await conn.execute(
        'INSERT INTO users (firstname, lastname, email, telephone, password, salt) VALUES (?,?,?,?,?,?)',
        [params.firstname, params.lastname, params.email, params.telephone, params.password, params.salt]);

      return rows
    } catch (err) {
      console.error(err);

      throw err;
    }
  }

  /**
   * Update a book by id
   * @param id
   * @param data
   */
  protected async updateUser(id: number, data: IUser) {
    const field = Object.keys(data).map(item => `${item} = ?`).join(",");
    const conn = await this.userDBConn.getConnection()
    const [rows, fields] = await conn.execute(
      `UPDATE users SET ${field} WHERE id = ? `,
      [...Object.values(data), id]);
    return rows
  }

  /**
   * Find users
   * @param condition -  query string from "where"
   * @param values - values passed for query
   */
  protected async findOneUser(condition: string, values: Array<string>): Promise<any> {
    const conn = await this.userDBConn.getConnection()
    const [rows, fields] = await conn.execute(
      `SELECT * FROM users  ${condition} `,
      [...values]);
    return rows[0]
  }
  /**
   * Find users
   * @param condition -  query string from "where"
   * @param values - values passed for query
   */
  protected async findUsers(condition: string, values: Array<string>): Promise<any> {
    const conn = await this.userDBConn.getConnection()
    const [rows, fields] = await conn.execute(
      `SELECT * FROM users  ${condition} `,
      [...values]);
    return rows
  }

  /**
   * Query book by id
   * @param id
   */
  protected async findOneUserById(id: number) {
    const conn = await this.userDBConn.getConnection()
    const [rows, fields] = await conn.execute(
      `SELECT * FROM users WHERE id = ?`,
      [id]);
    return rows[0]
  }

  /**
   * Delete book by id
   * @param id
   */
  protected async deleteOneUserById(id: number) {
    const conn = await this.userDBConn.getConnection()
    const [rows, fields] = await conn.execute(
      `DELETE FROM users WHERE id = ?`,
      [id]);
    return rows
  }

  /**
   * generates jwt token
   * @param id
   */
  protected generateJWT(id: number) {
    return jwt.sign({ userid: id }, process.env.TOKEN_SECRET || "0f1b84c98a20d6b0339f535c606e2f26e402aa8da98a20d6b", { expiresIn: '1800s' })
  }

  /**
   * generates 6  digit token
   * 
   */
  protected generateToken() {
    return Math.floor(100000 + Math.random() * 900000)
  }

  protected getRequestUserId(event: any): Promise<number> {

    const authHeader = event.headers['Authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    return new Promise(resolve => {
      const user: any = jwt.verify(token, process.env.TOKEN_SECRET as string || "0f1b84c98a20d6b0339f535c606e2f26e402aa8da98a20d6b")
      resolve(user.userid)
    })
  }


  protected async authenticateToken(token) {
    return new Promise(resolve => {
      const user = jwt.verify(token, process.env.TOKEN_SECRET as string || "0f1b84c98a20d6b0339f535c606e2f26e402aa8da98a20d6b")
      if (!user) resolve(false)
      resolve(user)
    })
  }

  protected generatePolicy = function (principalId, effect, resource, userId?) {
    var authResponse: any = {};

    authResponse.principalId = principalId;
    if (effect && resource) {
      var policyDocument: any = {};
      policyDocument.Version = '2012-10-17';
      policyDocument.Statement = [];
      var statementOne: any = {};
      statementOne.Action = 'execute-api:Invoke';
      statementOne.Effect = effect;
      statementOne.Resource = resource;
      policyDocument.Statement[0] = statementOne;
      authResponse.policyDocument = policyDocument;
    }

    // Optional output with custom properties of the String, Number or Boolean type.
    authResponse.context = {
      user: userId,
      test: "test"
    };
    return authResponse;
  }


}