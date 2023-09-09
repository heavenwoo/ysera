import { Test, TestingModule } from '@nestjs/testing';
import { AuthSecurityService } from './auth.security.service';

describe('AuthSecurityService', () => {
  let service: AuthSecurityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthSecurityService],
    }).compile();

    service = module.get<AuthSecurityService>(AuthSecurityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
