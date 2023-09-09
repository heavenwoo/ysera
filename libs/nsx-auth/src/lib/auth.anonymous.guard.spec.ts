import { AuthAnonymousGuard } from './auth.anonymous.guard';

describe('AuthAnonymousGuard', () => {
  it('should be defined', () => {
    expect(new AuthAnonymousGuard()).toBeDefined();
  });
});
