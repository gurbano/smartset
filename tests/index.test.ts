import * as exported from '../src/index';

describe('index exports', () => {
  it('should export SmartSet', () => {
    expect(exported.SmartSet).toBeDefined();
  });
});