import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UserPrismaRepository } from '../../infraestructure/database/user.prisma.repository';
import { JwtService } from '../../infraestructure/security/jwt/jwt.service';
import { PrismaService } from '../../infraestructure/security/prisma/prisma.service';
import { MailerService } from '../mailer/mailer.service';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;

  const mockUserRepo = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockPrisma = {
    user: {
      create: jest.fn(),
    },
  };

  const mockMailer = {
    sendCreateAccountWelcome: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserPrismaRepository, useValue: mockUserRepo },
        { provide: JwtService, useValue: mockJwtService },
        { provide: PrismaService, useValue: mockPrisma },
        { provide: MailerService, useValue: mockMailer },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    const mockUser = { id: '1', email: 'test@example.com', password: 'hashed' };

    it('debería devolver token si credenciales son válidas', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue('fake-jwt-token');

      const result = await service.login('test@example.com', '123456');

      expect(mockUserRepo.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(bcrypt.compare).toHaveBeenCalledWith('123456', 'hashed');
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
      });
      expect(result).toEqual({
        message: 'Inicio de sesión exitoso',
        access_token: 'fake-jwt-token',
      });
    });

    it('debería lanzar UnauthorizedException si el usuario no existe', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(null);

      await expect(service.login('nope@example.com', '123')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('debería lanzar UnauthorizedException si la contraseña no coincide', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(service.login('test@example.com', 'wrong')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('debería lanzar InternalServerErrorException si ocurre un error inesperado', async () => {
      mockUserRepo.findByEmail.mockRejectedValue(new Error('DB error'));

      await expect(service.login('test@example.com', '123')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('register', () => {
    const mockUser = { id: '1', email: 'test@example.com', password: 'hashed' };

    it('debería registrar un usuario nuevo correctamente', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedpass');
      mockPrisma.user.create.mockResolvedValue(mockUser);
      mockMailer.sendCreateAccountWelcome.mockResolvedValue(undefined);

      const result = await service.register('test@example.com', '123456');

      expect(mockUserRepo.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(bcrypt.hash).toHaveBeenCalledWith('123456', 10);
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: { email: 'test@example.com', password: 'hashedpass' },
      });
      expect(mockMailer.sendCreateAccountWelcome).toHaveBeenCalledWith(
        'test@example.com',
      );
      expect(result).toEqual({
        message: 'Usuario registrado exitosamente',
        user: mockUser,
      });
    });

    it('debería lanzar BadRequestException si el usuario ya existe', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(mockUser);

      await expect(service.register('test@example.com', '123')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('debería lanzar InternalServerErrorException en error inesperado', async () => {
      mockUserRepo.findByEmail.mockRejectedValue(new Error('DB error'));

      await expect(service.register('test@example.com', '123')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('validateUser', () => {
    it('debería llamar a userRepo.findById', async () => {
      mockUserRepo.findById.mockResolvedValue({ id: '1' });

      const result = await service.validateUser('1');

      expect(mockUserRepo.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual({ id: '1' });
    });
  });
});
