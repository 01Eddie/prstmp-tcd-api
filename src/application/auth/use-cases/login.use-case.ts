import { IUserRepository } from 'src/domain/user.repository';
import { JwtService } from 'src/infraestructure/security/jwt/jwt.service';
import bcrypt from 'bcrypt';

export class LoginUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<{ token: string }> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new Error('Credenciales Inválidas');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Credenciales Inválidas');

    const token = this.jwtService.sign({ id: user.id, email: user.email });

    return { token };
  }
}
