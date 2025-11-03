import {
  AmmountReceivedCalculation,
  GetCambioSeguro,
} from './dto/exchange.entity.dto';
import { User } from './dto/user.entity.dto';
import { GetExchangeHistoryResponseDto } from 'src/application/exchange/dto/getExchangeHistoryResponse.dto';
import { GetExchangeHistoryDetailResponseDto } from 'src/application/exchange/dto/getExchangeHistoryDetailResponse.dto';

export interface IExchangeRepository {
  ammountReceivedCalculation(
    tipoDeCambio: 'compra' | 'venta',
    idApi: string,
    amount: number,
    rate: number,
    user: User,
  ): Promise<AmmountReceivedCalculation>;
  getCambioSeguro(url: string): Promise<GetCambioSeguro>;
  getExchangeHistory(
    page: number,
    limit: number,
    user: User,
  ): Promise<GetExchangeHistoryResponseDto>;
  getExchangeHistoryDetail(
    id: string,
    user: User,
  ): Promise<GetExchangeHistoryDetailResponseDto>;
  deleteExchangeHistory(id: string, user: User): Promise<{ message: string }>;
}
