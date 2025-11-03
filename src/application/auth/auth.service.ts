import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import bcrypt from 'bcrypt';
import { JwtService } from '../../infraestructure/security/jwt/jwt.service';
import { PrismaService } from '../../infraestructure/security/prisma/prisma.service';
import { LoginResponseDto } from './dto/loginResponse.dto';
import { RegisterResponseDto } from './dto/registerResponse.dto';
import { MailerService } from '../mailer/mailer.service';
import { UserPrismaRepository } from '../../infraestructure/database/user.prisma.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepo: UserPrismaRepository,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly mailer: MailerService,
  ) {}

  async login(email: string, password: string): Promise<LoginResponseDto> {
    try {
      const user = await this.userRepo.findByEmail(email);
      if (!user) throw new UnauthorizedException('Credenciales Inválidas');

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new UnauthorizedException('Credenciales Inválidas');

      const token = this.jwtService.sign({ sub: user.id, email: user.email });

      return {
        message: 'Inicio de sesión exitoso',
        access_token: token,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      console.error('Error en login:', error);
      throw new InternalServerErrorException('Error interno del servidor');
    }
  }

  async register(
    email: string,
    password: string,
  ): Promise<RegisterResponseDto> {
    try {
      const existingUser = await this.userRepo.findByEmail(email);

      if (existingUser)
        throw new BadRequestException(
          'Este usuario ya está registrado, intenta con otro correo',
        );

      const hashed = await bcrypt.hash(password, 10);
      const user = await this.prisma.user.create({
        data: {
          email,
          password: hashed,
        },
      });

      await this.mailer.sendCreateAccountWelcome(email);

      return {
        message: 'Usuario registrado exitosamente',
        user,
      };
    } catch (error) {
      console.error('Error en register:', error);
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Error interno del servidor');
    }
  }

  async validateUser(id: string) {
    return this.userRepo.findById(id);
  }
}
