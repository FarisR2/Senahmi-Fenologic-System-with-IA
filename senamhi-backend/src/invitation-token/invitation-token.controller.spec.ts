import { Test, TestingModule } from '@nestjs/testing';
import { InvitationTokenController } from './invitation-token.controller';

describe('InvitationTokenController', () => {
  let controller: InvitationTokenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvitationTokenController],
    }).compile();

    controller = module.get<InvitationTokenController>(InvitationTokenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
