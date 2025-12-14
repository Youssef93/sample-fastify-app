// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function getMockedLogger() {
  return {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
  };
}
