import logger from './logger';

describe('Logger', () => {
  const originalLog = console.log;
  const originalWarn = console.warn;
  const originalError = console.error;

  beforeEach(() => {
    console.log = jest.fn();
    console.warn = jest.fn();
    console.error = jest.fn();
  });

  afterEach(() => {
    console.log = originalLog;
    console.warn = originalWarn;
    console.error = originalError;
  });

  it('logs info messages', () => {
    logger.info('hello');
    expect(console.log).toHaveBeenCalledTimes(1);
    const msg = (console.log as jest.Mock).mock.calls[0][0];
    expect(msg).toMatch(/INFO: hello$/);
  });

  it('logs warnings', () => {
    logger.warn('warn');
    expect(console.warn).toHaveBeenCalledTimes(1);
    const msg = (console.warn as jest.Mock).mock.calls[0][0];
    expect(msg).toMatch(/WARN: warn$/);
  });

  it('logs errors', () => {
    logger.error('oops');
    expect(console.error).toHaveBeenCalledTimes(1);
    const msg = (console.error as jest.Mock).mock.calls[0][0];
    expect(msg).toMatch(/ERROR: oops$/);
  });
});
