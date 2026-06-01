import { Test, TestingModule } from '@nestjs/testing';
import { InvitationTokenService } from './invitation-token.service';

describe('InvitationTokenService', () => {
  let service: InvitationTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InvitationTokenService],
    }).compile();

    service = module.get<InvitationTokenService>(InvitationTokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
