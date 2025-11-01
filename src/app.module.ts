import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from './infraestructure/security/prisma/prisma.module';
import { AuthService } from './application/auth/auth.service';
import { JwtService } from './infraestructure/security/jwt/jwt.service';
import { AuthController } from './infraestructure/http/auth/auth.controller';
import { SecurityJwtModule } from './infraestructure/security/jwt/jwt.module';
import { ConfigModule } from '@nestjs/config';
import { UserPrismaRepository } from './infraestructure/database/user.prisma.repository';
// import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot(),
    // MongooseModule.forRoot('mongodb://localhost/prestamype-tcd'),
    // MongooseModule.forRoot(String(process.env.DATABASE_URL)),
    // MongooseModule.forFeature([{ name: 'User', schema: {} }]),
    SecurityJwtModule,
    PrismaModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService, UserPrismaRepository, JwtService],
})
export class AppModule {}
