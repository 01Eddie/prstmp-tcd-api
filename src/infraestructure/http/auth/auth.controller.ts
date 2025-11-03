import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from '../../../application/auth/dto/login.dto';
import { RegisterDto } from '../../../application/auth/dto/register.dto';
import { AuthService } from '../../../application/auth/auth.service';

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
}
