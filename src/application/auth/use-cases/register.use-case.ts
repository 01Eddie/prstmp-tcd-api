import { IUserRepository } from 'src/domain/user.repository';
// import { JwtService } from "src/infraestructure/security/jwt/jwt.service";
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/infraestructure/security/prisma/prisma.service';

export class RegisterUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    // private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async register(email: string, password: string) {
    const existingUser = await this.userRepo.findByEmail(email);
    if (existingUser) {
      throw new Error('Usuario ya registrado');
    }

    const hashed = await bcrypt.hash(password, 10);

    return this.prisma.user.create({
      data: {
        email,
        password: hashed,
      },
    });
  }
}
