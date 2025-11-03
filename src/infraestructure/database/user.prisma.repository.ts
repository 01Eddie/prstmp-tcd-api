import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client/default.js';
import { User } from 'src/domain/dto/user.entity.dto';
import { IUserRepository } from 'src/domain/user.repository';
import { PrismaService } from '../security/prisma/prisma.service';

@Injectable()
export class UserPrismaRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }
    return {
      id: user.id,
      email: user.email,
      password: user.password,
    };
  }

  async create(user: User): Promise<User> {
    try {
      const createdUser = await this.prisma.user.create({
        data: {
          email: user.email,
          password: user.password,
        },
      });

      return {
        id: createdUser.id,
        email: createdUser.email,
        password: createdUser.password,
      };
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

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return null;
    }
    return {
      id: user.id,
      email: user.email,
      password: user.password,
    };
  }
}
