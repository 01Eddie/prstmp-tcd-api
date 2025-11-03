import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExchangeModule } from './application/exchange/exchange.module';
import { ExchangeService } from './application/exchange/exchange.service';
import { ExchangeController } from './infraestructure/http/exchange/exchange.controller';
import { PrismaModule } from './infraestructure/security/prisma/prisma.module';
import { AuthService } from './application/auth/auth.service';
import { JwtService } from './infraestructure/security/jwt/jwt.service';
import { AuthController } from './infraestructure/http/auth/auth.controller';
import { SecurityJwtModule } from './infraestructure/security/jwt/jwt.module';
import { ConfigModule } from '@nestjs/config';
import { ExchangePrismaRepository } from './infraestructure/database/exchange.prisma.repository';
import { MailerModule } from './application/mailer/mailer.module';
import { MailerService } from './application/mailer/mailer.service';
import { PassportModule } from '@nestjs/passport';
import { UserPrismaRepository } from './infraestructure/database/user.prisma.repository';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    SecurityJwtModule,
    PrismaModule,
    MailerModule,
    // AuthModule,
    ExchangeModule,
  ],
  controllers: [AppController, AuthController, ExchangeController],
  providers: [
    AppService,
    AuthService,
    UserPrismaRepository,
    ExchangePrismaRepository,
    JwtService,
    MailerService,
    ExchangeService,
  ],
})
export class AppModule {}
