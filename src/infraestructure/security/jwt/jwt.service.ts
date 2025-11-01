import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';

@Injectable()
export class JwtService {
  constructor(private readonly jwt: NestJwtService) {}

  sign(payload: object): string {
    return this.jwt.sign(payload);
  }

  verify(token: string): any {
    return this.jwt.verify(token);
  }
}
