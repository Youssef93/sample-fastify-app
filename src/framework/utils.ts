const isLocalEnv = (): boolean =>
  !process.env.NODE_ENV || ['local', 'test'].includes(process.env['NODE_ENV'] as string);

export { isLocalEnv };
