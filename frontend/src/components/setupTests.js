// Mock axios for testing
global.console = {
  ...console,
  error: jest.fn(),
};