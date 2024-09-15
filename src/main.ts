// If running from build, import module-alias to fix absolute path issue
if (__dirname.includes('dist')) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('module-alias/register');
}

import { startServer } from 'src/server';

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

startServer().then(server => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  server.listen({ port }, (err, address) => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  });
});
