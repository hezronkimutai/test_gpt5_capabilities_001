import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './game.entity';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { GamesGateway } from './games.gateway';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Game]), UsersModule],
  controllers: [GamesController],
  providers: [GamesService, GamesGateway],
  exports: [GamesService],
})
export class GamesModule {}
