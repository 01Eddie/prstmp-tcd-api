/* eslint-disable */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../../../application/auth/auth.service';
import { LoginDto } from '../../../application/auth/dto/login.dto';
import { RegisterDto } from '../../../application/auth/dto/register.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            register: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('debería llamar a authService.login con email y password', async () => {
      const body: LoginDto = { email: 'test@example.com', password: '123456' };
      const mockResponse = {
        message: 'Inicio de sesión exitoso',
        access_token: 'jwt.token',
      };

      service.login.mockResolvedValue(mockResponse);

      const result = await controller.login(body);

      expect(service.login).toHaveBeenCalledWith(body.email, body.password);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('register', () => {
    it('debería llamar a authService.register con email y password', async () => {
      const body: RegisterDto = {
        email: 'test@example.com',
        password: '123456',
      };
      const mockResponse = {
        message: 'Usuario registrado correctamente',
        user: {
          id: '1',
          email: body.email,
          password: body.password,
          createdAt: new Date('2024-01-01T00:00:00Z'),
        },
      };

      service.register.mockResolvedValue(mockResponse);

      const result = await controller.register(body);

      expect(service.register).toHaveBeenCalledWith(body.email, body.password);
      expect(result).toEqual(mockResponse);
    });
  });
});
