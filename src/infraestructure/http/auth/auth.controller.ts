import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { LoginDto } from '../../../application/auth/dto/login.dto';
import { RegisterDto } from '../../../application/auth/dto/register.dto';
import { AuthService } from 'src/application/auth/auth.service';
import { JwtAuthGuard } from 'src/infraestructure/security/jwt/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }

  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body.email, body.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile() {
    return { message: 'This is a protected profile route' };
  }
}
