import {
  IsArray,
  IsDate,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class GetExchangeHistoryResponseDto {
  @IsObject()
  pagination: ExchangeHistoryPagination;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExchangeHistoryData)
  data: ExchangeHistoryData[];
}

class ExchangeHistoryPagination {
  @IsNumber()
  totalItems: number;

  @IsNumber()
  totalPages: number;

  @IsNumber()
  currentPage: number;

  @IsNumber()
  pageSize: number;
}

class ExchangeHistoryData {
  @IsString()
  id: string;

  @IsString()
  tipo_de_cambio: string;

  @IsNumber()
  monto_enviar: number;

  @IsNumber()
  monto_recibir: number;

  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @IsObject()
  tasa_de_cambio: any;

  @IsString()
  id_usuario: string;
}
