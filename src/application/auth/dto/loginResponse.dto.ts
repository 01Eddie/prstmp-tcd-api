import { IsString } from 'class-validator';

export class LoginResponseDto {
  @IsString()
  message: string;

  @IsString()
  access_token: string;
}
