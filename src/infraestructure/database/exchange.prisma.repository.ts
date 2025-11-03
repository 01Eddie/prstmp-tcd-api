import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../security/prisma/prisma.service';
import { IExchangeRepository } from 'src/domain/exchange.repository';
import { User } from 'src/domain/dto/user.entity.dto';
import { CambioSeguroResponse } from 'src/application/exchange/dto/cambioSeguroResponse.dto';
import { GetExchangeHistoryResponseDto } from 'src/application/exchange/dto/getExchangeHistoryResponse.dto';
import { GetExchangeHistoryDetailResponseDto } from 'src/application/exchange/dto/getExchangeHistoryDetailResponse.dto';
import { AmmountReceivedCalculation } from 'src/domain/dto/exchange.entity.dto';
import { DeleteExchangeHistoryResponseDto } from 'src/application/exchange/dto/deleteExchangeHistoryResponse.dto';

@Injectable()
export class ExchangePrismaRepository implements IExchangeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async ammountReceivedCalculation(
    tipoDeCambio: 'compra' | 'venta',
    idApi: string,
    amount: number,
    rate: number,
    user: User,
  ): Promise<AmmountReceivedCalculation> {
    const validAmount = amount > 0;

    if (!validAmount) {
      throw new InternalServerErrorException('El monto debe ser mayor a cero');
    }

    const calculatedAmount =
      tipoDeCambio === 'compra'
        ? amount * rate
        : tipoDeCambio === 'venta'
          ? amount / rate
          : 0;

    const exchange = await this.prisma.$transaction([
      this.prisma.exchangeRequest.create({
        data: {
          tipo_de_cambio: tipoDeCambio,
          tasa_de_cambio: {
            _id: idApi,
            purchase_price: tipoDeCambio === 'compra' ? rate : 0,
            sale_price: tipoDeCambio === 'venta' ? rate : 0,
          },
          monto_enviar: parseFloat(amount.toFixed(2)),
          monto_recibir: parseFloat(calculatedAmount.toFixed(2)),
          id_usuario: user.id,
        },
      }),
    ]);

    return exchange[0];
  }

  async getCambioSeguro(url: string): Promise<{
    _id: string;
    purchase_price: number;
    sale_price: number;
  }> {
    const { data }: { data: CambioSeguroResponse } = await axios.get(url);
    const rates = data?.data;

    if (!rates) {
      throw new InternalServerErrorException(
        'No se pudo obtener la tasa de cambio',
      );
    }

    return rates;
  }

  async getExchangeHistory(
    page: number,
    limit: number,
    user: User,
  ): Promise<GetExchangeHistoryResponseDto> {
    const validPage = Math.max(1, Number(page));
    const validLimit = Math.min(Math.max(1, Number(limit)), 100);
    const skip = (validPage - 1) * validLimit;

    const [totalCount, exchanges] = await this.prisma.$transaction([
      this.prisma.exchangeRequest.count({ where: { id_usuario: user.id } }),
      this.prisma.exchangeRequest.findMany({
        where: {
          id_usuario: user.id,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      pagination: {
        totalItems: totalCount,
        totalPages,
        currentPage: page,
        pageSize: limit,
      },
      data: exchanges,
    };
  }

  async getExchangeHistoryDetail(
    id: string,
    user: User,
  ): Promise<GetExchangeHistoryDetailResponseDto> {
    const exchange = await this.prisma.exchangeRequest.findUnique({
      where: {
        id,
      },
    });

    if (!exchange || exchange.id_usuario !== user.id) {
      throw new NotFoundException(
        'No se encontró el historial de cambio solicitado',
      );
    }

    return exchange;
  }

  async deleteExchangeHistory(
    id: string,
    user: User,
  ): Promise<DeleteExchangeHistoryResponseDto> {
    await this.prisma.$transaction(async (x) => {
      const exchange = await x.exchangeRequest.findFirst({
        where: {
          id,
          id_usuario: user.id,
        },
      });

      if (!exchange) {
        throw new NotFoundException('Historial de cambio no encontrado');
      }

      switch (exchange.estadoSolicitud) {
        case 'pendiente':
          await x.exchangeRequest.delete({
            where: {
              id: exchange.id,
            },
          });
          return { action: 'borrado', id: exchange.id };
        case 'aceptado':
          await x.exchangeRequest.update({
            where: {
              id: exchange.id,
            },
            data: {
              estadoSolicitud: 'cancelado',
            },
          });
          return { action: 'cancelado', id: exchange.id };
        default:
          throw new BadRequestException(
            `No se puede procesar un historial con estado "${exchange.estadoSolicitud}".`,
          );
      }
    });

    return {
      success: true,
      message: 'Operación de historial de cambio procesada correctamente',
    };
  }
}
