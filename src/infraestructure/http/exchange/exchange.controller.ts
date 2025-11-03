import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ExchangeService } from '../../../application/exchange/exchange.service';
import { GetUser } from '../../../common/decorators/get-user.decorator';
import { User } from '../../../domain/dto/user.entity.dto';
import { JwtAuthGuard } from '../../../infraestructure/security/jwt/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('exchange')
export class ExchangeController {
  constructor(private exchangeService: ExchangeService) {}

  @Get(':tipo')
  getExchange(@Param('tipo') tipo: 'compra' | 'venta', @GetUser() user: User) {
    return this.exchangeService.getExchange(tipo, user);
  }

  @Post('calculate-amount')
  calculateAmount(
    @Body('amount') amount: number,
    @Body('tipo') tipo: 'compra' | 'venta',
    @GetUser() user: User,
  ) {
    return this.exchangeService.calculateAmount(amount, tipo, user);
  }

  @Get('history/:page/:limit')
  getExchangeHistory(
    @Param('page') page: number,
    @Param('limit') limit: number,
    @GetUser() user: User,
  ) {
    return this.exchangeService.getExchangeHistory(page, limit, user);
  }

  @Get('history/:id')
  getExchangeHistoryDetail(@Param('id') id: string, @GetUser() user: User) {
    return this.exchangeService.getExchangeHistoryDetail(id, user);
  }

  @Delete('history/delete/:id')
  deleteExchangeHistory(@Param('id') id: string, @GetUser() user: User) {
    return this.exchangeService.deleteExchangeHistory(id, user);
  }
}
