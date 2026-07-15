import { Injectable } from '@nestjs/common';
import { randomBytes, scryptSync, timingSafeEqual, randomUUID } from 'crypto';

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: string;
  createdAt: Date;
}

/**
 * Armazenamento em memória para o MODO DEMO.
 * Não requer banco de dados. Os dados são reiniciados a cada restart do servidor.
 * Para produção, substituir por PrismaService (ver src/database/prisma.service.ts).
 */
@Injectable()
export class MemoryStore {
  private users: StoredUser[] = [];

  constructor() {
    // Conta demo pré-cadastrada: login imediato sem precisar registrar.
    this.createUser({
      name: 'Usuário Demo',
      email: 'demo@eventhub.com',
      password: 'demo123',
      role: 'empresa',
    });
  }

  private hashPassword(password: string): string {
    const salt = randomBytes(16).toString('hex');
    const derived = scryptSync(password, salt, 64).toString('hex');
    return `${salt}:${derived}`;
  }

  verifyPassword(password: string, stored: string): boolean {
    const [salt, key] = stored.split(':');
    const derived = scryptSync(password, salt, 64);
    const keyBuffer = Buffer.from(key, 'hex');
    return keyBuffer.length === derived.length && timingSafeEqual(keyBuffer, derived);
  }

  findByEmail(email: string): StoredUser | undefined {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  createUser(data: { name: string; email: string; password: string; role: string }): StoredUser {
    const user: StoredUser = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      passwordHash: this.hashPassword(data.password),
      role: data.role,
      createdAt: new Date(),
    };
    this.users.push(user);
    return user;
  }
}
