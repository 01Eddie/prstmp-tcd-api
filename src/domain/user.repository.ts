import { User } from './dto/user.entity.dto';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(user: User): Promise<User>;
  // validateUser(id: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
}
