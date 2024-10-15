import 'knex';

import type { Knex } from 'knex';
import { getConfig } from 'src/framework/configurations/config.service';

const config: Knex.Config = {
  client: 'pg',
  connection: getConfig().database.url,
  migrations: {
    directory: __dirname + '/migrations',
  },
  seeds: {
    directory: __dirname + '/seeds',
  },
};

export default config;
