import { IsDate, IsString } from 'class-validator';

export class UserResponseDto {
  @IsString()
  id: string;

  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsDate()
  createdAt: Date;
}
