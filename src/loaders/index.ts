import * as express from 'express';
import 'reflect-metadata';
import errorHandlers from './errorHandlers';
import database from './postgres';
import server from './server';

export default async (app: express.Application) => {
  const connection = await database();
  console.log('DB loaded and connected!', connection.isConnected);

  await server(app);
  console.log('Server loaded!');
  
  await errorHandlers(app);
  console.log('Error handlers running!');
};
