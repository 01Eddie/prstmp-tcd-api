import { IsDate, IsNumber, IsObject, IsString } from 'class-validator';

export class GetCambioSeguro {
  @IsString()
  _id: string;

  @IsNumber()
  purchase_price: number;

  @IsNumber()
  sale_price: number;
}

export class AmmountReceivedCalculation {
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

  @IsString()
  id_usuario: string;
}
