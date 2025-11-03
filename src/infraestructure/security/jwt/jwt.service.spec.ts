/* eslint-disable */
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { JwtService } from './jwt.service';

describe('JwtService', () => {
  let service: JwtService;
  let nestJwtService: jest.Mocked<NestJwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtService,
        {
          provide: NestJwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<JwtService>(JwtService);
    // nestJwtService = module.get<NestJwtService>(NestJwtService);
    nestJwtService = module.get<NestJwtService>(
      NestJwtService,
    ) as jest.Mocked<NestJwtService>;
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
    expect(nestJwtService).toBeDefined();
  });

  describe('sign', () => {
    it('debería delegar correctamente en NestJwtService.sign', () => {
      const payload = { userId: '123' };
      const token = 'fake.jwt.token';
      nestJwtService.sign.mockReturnValue(token);

      const result = service.sign(payload);

      expect(nestJwtService.sign).toHaveBeenCalledWith(payload);
      expect(result).toBe(token);
    });
  });

  describe('verify', () => {
    it('debería delegar correctamente en NestJwtService.verify', () => {
      const token = 'fake.jwt.token';
      const decoded = { userId: '123' };
      nestJwtService.verify.mockReturnValue(decoded);

      const result = service.verify(token);

      expect(nestJwtService.verify).toHaveBeenCalledWith(token);
      expect(result).toBe(decoded);
    });
  });
});
