import Container from 'typedi';
import { Connection, createConnection, useContainer } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import config from '../config';
import { User } from '../models/user.model';

const entitiesFolder = config.env !== 'production' ? 'build/models/*.model.ts' : 'src/models/*.model.js'

export default async (): Promise<Connection> => {
  // read connection options from ormconfig file (or ENV variables)
  // const connectionOptions = await getConnectionOptions();
  const connectionOptions: PostgresConnectionOptions = {
    type: 'postgres',
    host: config.database.host,
    port: config.database.port,
    username: config.database.username,
    password: config.database.password,
    database: config.database.database,
    synchronize: true,
    logging: true,
    entities: [
      entitiesFolder,
    ],
  };

  // typedi + typeorm
  useContainer(Container);

  // create a connection using modified connection options
  const connection = await createConnection(connectionOptions);

  return connection;
};
