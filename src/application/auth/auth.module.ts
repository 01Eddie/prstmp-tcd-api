import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from 'src/infraestructure/http/auth/auth.controller';
import { MailerModule } from '../mailer/mailer.module';
import { SecurityJwtModule } from 'src/infraestructure/security/jwt/jwt.module';
import { JwtStrategy } from 'src/infraestructure/security/jwt/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { UserPrismaRepository } from 'src/infraestructure/database/user.prisma.repository';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    SecurityJwtModule,
    MailerModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, UserPrismaRepository],
  exports: [PassportModule, JwtStrategy],
})
export class AuthModule {}
