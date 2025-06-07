import 'knex';

import knex, { type Knex } from 'knex';
import { isLocalEnv } from 'src/framework/utils';

const extensions = isLocalEnv() && process.env.IS_DOCKER !== 'true' ? ['.ts'] : ['.js'];

const config: Knex.Config = {
  client: 'pg',
  connection: process.env.DATABASE_URL,
  migrations: {
    directory: __dirname + '/migrations',
    loadExtensions: extensions,
  },
  seeds: {
    directory: __dirname + '/seeds',
    loadExtensions: extensions,
  },
};

export default config;

export const knexClient = knex.default(config);
