/* eslint-disable */
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

const mockConnect = jest
  .spyOn(PrismaClient.prototype, '$connect')
  .mockResolvedValue();
const mockDisconnect = jest
  .spyOn(PrismaClient.prototype, '$disconnect')
  .mockResolvedValue();

describe('PrismaService', () => {
  let service: PrismaService;
  let configService: ConfigService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('mongodb://localhost:27017/testdb'),
          },
        },
      ],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  it('debería obtener el DATABASE_URL desde ConfigService', () => {
    expect(configService.get).toHaveBeenCalledWith('DATABASE_URL');
  });

  it('debería llamar a $connect en onModuleInit', async () => {
    await service.onModuleInit();
    expect(mockConnect).toHaveBeenCalledTimes(1);
  });

  it('debería llamar a $disconnect en onModuleDestroy', async () => {
    await service.onModuleDestroy();
    expect(mockDisconnect).toHaveBeenCalledTimes(1);
  });
});
