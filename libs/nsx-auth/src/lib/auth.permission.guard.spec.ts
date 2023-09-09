import { AuthPermissionGuard } from './auth.permission.guard';

describe('AuthPermissionGuard', () => {
  it('should be defined', () => {
    expect(new AuthPermissionGuard()).toBeDefined();
  });
});
