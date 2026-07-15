import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { MemoryStore } from './database/memory.store';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'eventhub_demo_secret',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, MemoryStore],
})
export class AppModule {}
