import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from './game.entity';
import { UsersService } from '../users/users.service';
import { Chess } from 'chess.js';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game)
    private readonly gamesRepo: Repository<Game>,
    private readonly usersService: UsersService,
  ) {}

  async list() {
    return this.gamesRepo.find({ relations: ['white', 'black'], order: { createdAt: 'DESC' } });
  }

  async createGame(whiteUsername?: string, blackUsername?: string) {
    const white = whiteUsername ? await this.usersService.create(whiteUsername) : null;
    const black = blackUsername ? await this.usersService.create(blackUsername) : null;
    const game = this.gamesRepo.create({ white, black, startFen: 'start', pgn: '' });
    return this.gamesRepo.save(game);
  }

  async getGame(id: string) {
    const game = await this.gamesRepo.findOne({ where: { id }, relations: ['white', 'black'] });
    if (!game) throw new NotFoundException('Game not found');
    return game;
  }

  private loadChessFromGame(game: Game) {
    const chess = new Chess();
    if (game.pgn) chess.loadPgn(game.pgn);
    return chess;
  }

  async makeMove(id: string, move: { from: string; to: string; promotion?: 'q' | 'r' | 'b' | 'n' }) {
    const game = await this.getGame(id);
    if (game.status !== 'in_progress') throw new BadRequestException('Game already finished');
    const chess = this.loadChessFromGame(game);
    const result = chess.move(move);
    if (!result) throw new BadRequestException('Illegal move');
    game.pgn = chess.pgn();

    if (chess.isGameOver()) {
      if (chess.isCheckmate()) {
        game.status = chess.turn() === 'w' ? 'black_won' : 'white_won';
        game.resultReason = 'checkmate';
      } else if (chess.isDraw()) {
        game.status = 'draw';
        game.resultReason = 'draw';
      } else if (chess.isStalemate()) {
        game.status = 'draw';
        game.resultReason = 'stalemate';
      } else if (chess.isThreefoldRepetition()) {
        game.status = 'draw';
        game.resultReason = 'threefold repetition';
      } else if (chess.isInsufficientMaterial()) {
        game.status = 'draw';
        game.resultReason = 'insufficient material';
      }
    }

    await this.gamesRepo.save(game);
    return { game, move: result, fen: chess.fen(), pgn: chess.pgn() };
  }
}
