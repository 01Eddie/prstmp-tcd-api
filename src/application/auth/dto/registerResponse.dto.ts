import { IsObject, IsString } from 'class-validator';
import { UserResponseDto } from './userResponse.dto';

export class RegisterResponseDto {
  @IsString()
  message: string;

  @IsObject()
  user: UserResponseDto;
}
