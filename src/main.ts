// If running from build, import module-alias to fix absolute path issue
if (__dirname.includes('dist')) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('module-alias/register');
}

import { instrumentationSDK } from 'src/framework/logging/instrumentation';
instrumentationSDK.start();

import { log } from 'src/framework/logging/logger';
import { startServer } from 'src/server';

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

startServer().then(server => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  server.listen({ port, host: '0.0.0.0' }, (err, address) => {
    log({
      message: `⚡️[server]: Server is running at http://localhost:${port}`,
      serviceName: 'Main',
    });
  });
});
