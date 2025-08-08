import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GamesService } from './games.service';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get()
  list() {
    return this.gamesService.list();
  }

  @Post()
  async create(@Body('white') white?: string, @Body('black') black?: string) {
    const game = await this.gamesService.createGame(white, black);
    return { id: game.id, pgn: game.pgn };
  }

  @Post(':id/move')
  move(
    @Param('id') id: string,
    @Body() body: { from: string; to: string; promotion?: 'q' | 'r' | 'b' | 'n' },
  ) {
    return this.gamesService.makeMove(id, body);
  }
}
