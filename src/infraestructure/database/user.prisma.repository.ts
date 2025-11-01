import { Injectable } from '@nestjs/common';
import { User } from 'src/domain/user.entity';
import { IUserRepository } from 'src/domain/user.repository';
import { PrismaService } from '../security/prisma/prisma.service';
import { Prisma } from '@prisma/client/default.js';

@Injectable()
export class UserPrismaRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return user ? new User(user.id, user.email, user.password) : null;
  }

  async create(user: User): Promise<User> {
    try {
      const createdUser = await this.prisma.user.create({
        data: {
          email: user.email,
          password: user.password,
        },
      });

      return new User(createdUser.id, createdUser.email, createdUser.password);
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new Error('Usuario con este correo ya existe.');
      }

      throw error;
    }
  }
}
