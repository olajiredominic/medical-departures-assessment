import { createPool } from "mysql2/promise";

export default createPool({
  host: process.env.DB_HOST || 'database-1.cpmfeonrpv8m.us-east-1.rds.amazonaws.com',
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASS || 'UCHowrAz88Hu6yBn6PKB',
  database: 'meddev',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});