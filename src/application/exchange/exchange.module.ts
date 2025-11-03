import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/infraestructure/security/prisma/prisma.module';
import { ExchangeController } from 'src/infraestructure/http/exchange/exchange.controller';
import { ExchangeService } from './exchange.service';
import { AuthModule } from '../auth/auth.module';
import { ExchangePrismaRepository } from 'src/infraestructure/database/exchange.prisma.repository';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ExchangeController],
  providers: [ExchangeService, ExchangePrismaRepository],
})
export class ExchangeModule {}
