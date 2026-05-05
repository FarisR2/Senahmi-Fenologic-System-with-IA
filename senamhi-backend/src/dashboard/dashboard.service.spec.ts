import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { Station } from '../station/entities/station.entity';
import { Cultive } from '../cultive/entities/cultive.entity';
import { Fenologic } from '../fenologic/entities/fenologic.entity';

describe('DashboardService', () => {
  let service: DashboardService;

  const mockRepository = {
    count: jest.fn().mockResolvedValue(0),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        {
          provide: getRepositoryToken(Station),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(Cultive),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(Fenologic),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
