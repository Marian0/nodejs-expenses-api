import * as express from 'express';
import config from './config';
import loaders from './loaders';

async function main() {
  const app = express.default();
  await loaders(app);

  app.listen(config.appPort, () => {
    console.log(`Server listening on port: ${config.appPort}`);
  });
}

main();
