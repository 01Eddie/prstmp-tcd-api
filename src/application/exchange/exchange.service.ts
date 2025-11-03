import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from '../../domain/dto/user.entity.dto';
import { ExchangePrismaRepository } from '../../infraestructure/database/exchange.prisma.repository';
import { GetExchangeResponseDto } from './dto/getExchangeResponse.dto';
import { CalculateAmountResponseDto } from './dto/calculateAmountResponse.dto';
import { GetExchangeHistoryResponseDto } from './dto/getExchangeHistoryResponse.dto';
import { GetExchangeHistoryDetailResponseDto } from './dto/getExchangeHistoryDetailResponse.dto';
import { DeleteExchangeHistoryResponseDto } from './dto/deleteExchangeHistoryResponse.dto';

@Injectable()
export class ExchangeService {
  constructor(private readonly exchangeRepo: ExchangePrismaRepository) {}
  async getExchange(
    tipoDeCambio: 'compra' | 'venta',
    user: User,
  ): Promise<GetExchangeResponseDto> {
    const url = String(process.env.URL_CAMBIO_SEGURO);
    const rates = await this.exchangeRepo.getCambioSeguro(url);
    const tasa =
      tipoDeCambio === 'venta'
        ? rates.sale_price
        : tipoDeCambio === 'compra'
          ? rates.purchase_price
          : null;

    if (tasa === null) {
      throw new BadRequestException('Tipo de cambio inválido');
    }

    return {
      tipoDeCambio,
      tasa,
      user,
      idTipoDeCambio: rates._id,
    };
  }

  async calculateAmount(
    amount: number,
    tipoDeCambio: 'compra' | 'venta',
    user: User,
  ): Promise<CalculateAmountResponseDto> {
    try {
      const exchange = await this.getExchange(tipoDeCambio, user);
      const savedExchange = await this.exchangeRepo.ammountReceivedCalculation(
        tipoDeCambio,
        exchange.idTipoDeCambio,
        amount,
        exchange.tasa,
        user,
      );

      return {
        ...savedExchange,
        id_usuario: {
          id: user.id,
          email: user.email,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException('Error al calcular monto', error);
    }
  }

  async getExchangeHistory(
    page: number,
    limit: number,
    user: User,
  ): Promise<GetExchangeHistoryResponseDto> {
    return this.exchangeRepo.getExchangeHistory(page, limit, user);
  }

  async getExchangeHistoryDetail(
    id: string,
    user: User,
  ): Promise<GetExchangeHistoryDetailResponseDto> {
    return this.exchangeRepo.getExchangeHistoryDetail(id, user);
  }

  async deleteExchangeHistory(
    id: string,
    user: User,
  ): Promise<DeleteExchangeHistoryResponseDto> {
    return this.exchangeRepo.deleteExchangeHistory(id, user);
  }
}
