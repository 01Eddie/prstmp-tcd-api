import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { LoginUseCase } from 'src/application/auth/use-cases/login.use-case';
import { RegisterUseCase } from 'src/application/auth/use-cases/register.use-case';
import { UserPrismaRepository } from 'src/infraestructure/database/user.prisma.repository';
import { JwtService } from 'src/infraestructure/security/jwt/jwt.service';
import { PrismaService } from 'src/infraestructure/security/prisma/prisma.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userRepo: UserPrismaRepository,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    try {
      const useCase = new LoginUseCase(this.userRepo, this.jwtService);
      const result = await useCase.login(body.email, body.password);
      return result;
    } catch (err: unknown) {
      if (err instanceof Error) throw new BadRequestException(err.message);
      throw new BadRequestException('Se produjo un error desconocido.');
    }
  }

  @Post('register')
  async register(@Body() body: { email: string; password: string }) {
    try {
      const useCase = new RegisterUseCase(this.userRepo, this.prisma);

      return await useCase.register(body.email, body.password);
    } catch (err: unknown) {
      if (err instanceof Error) throw new BadRequestException(err.message);
      throw new BadRequestException('Se produjo un error desconocido.');
    }
  }
}
