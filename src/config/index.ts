import * as dotenv from 'dotenv';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (!envFound) {
  // Throw generic error
  throw new Error("Couldn't find .env file");
}

export default {
  /**
   *  Application port.
   */
  appPort: process.env.APP_PORT,

  /**
   * JWT Secret
   */
  jwtSecret: process.env.JWT_SECRET,

  /**
   * MongoDB connection options.
   */
  database: {
    /**
     * Database host.
     */
    host: process.env.POSTGRES_HOST,
    /**
     * Database host port.
     */
    // tslint:disable-next-line: radix
    port: Number.parseInt(process.env.POSTGRES_PORT),
    /**
     * Database username.
     */
    username: process.env.POSTGRES_USER,
    /**
     * Database password.
     */
    password: process.env.POSTGRES_PASSWORD,
    /**
     * Database name to connect to.
     */
    database: process.env.POSTGRES_DB,
  },

  agenda: {
    dbCollection: process.env.AGENDA_DB_COLLECTION,
    pooltime: process.env.AGENDA_POOL_TIME,
    concurrency: process.env.AGENDA_CONCURRENCY,
  },
};
