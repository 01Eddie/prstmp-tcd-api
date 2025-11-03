import { IsNumber, IsObject, IsString } from 'class-validator';
import { User } from 'src/domain/dto/user.entity.dto';

export class GetExchangeResponseDto {
  @IsString()
  idTipoDeCambio: string;

  @IsString()
  tipoDeCambio: string;

  @IsNumber()
  tasa: number;

  @IsObject()
  user: User;
}
