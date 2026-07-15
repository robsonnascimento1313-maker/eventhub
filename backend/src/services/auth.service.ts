import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MemoryStore } from '../database/memory.store';

@Injectable()
export class AuthService {
  constructor(
    private readonly store: MemoryStore,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: { name: string; email: string; password: string; role: string }) {
    const existingUser = this.store.findByEmail(data.email);

    if (existingUser) {
      throw new ConflictException('Email já cadastrado');
    }

    const user = this.store.createUser(data);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  async login(email: string, password: string) {
    const user = this.store.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const passwordValid = this.store.verifyPassword(password, user.passwordHash);

    if (!passwordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    return {
      accessToken: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
