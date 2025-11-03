import { IsDate, IsNumber, IsObject, IsString } from 'class-validator';
import { CambioSeguroResponse } from './cambioSeguroResponse.dto';

export class CalculateAmountResponseDto {
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
  tasa_de_cambio: CambioSeguroResponse['data'];

  @IsObject()
  id_usuario: UserAmount;
}

export class UserAmount {
  @IsString()
  id: string;

  @IsString()
  email: string;
}
