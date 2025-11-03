import { IsDate, IsNumber, IsObject, IsString } from 'class-validator';

export class GetExchangeHistoryDetailResponseDto {
  @IsString()
  id_usuario: string;

  @IsString()
  id: string;

  @IsString()
  tipo_de_cambio: string;

  @IsNumber()
  monto_enviar: number;

  @IsNumber()
  monto_recibir: number;

  @IsDate()
  createdAt: Date;

  @IsObject()
  tasa_de_cambio: any;
}
