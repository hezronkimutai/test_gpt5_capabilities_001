import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GamesService } from './games.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class GamesGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly gamesService: GamesService) {}

  handleConnection(socket: Socket) {
    // no-op
  }

  @SubscribeMessage('join')
  async onJoin(@ConnectedSocket() socket: Socket, @MessageBody() data: { gameId: string }) {
    socket.join(`game:${data.gameId}`);
    const game = await this.gamesService.getGame(data.gameId);
    this.server.to(socket.id).emit('state', { game });
  }

  @SubscribeMessage('move')
  async onMove(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: { gameId: string; move: { from: string; to: string; promotion?: 'q' | 'r' | 'b' | 'n' } },
  ) {
    const { game, move, fen, pgn } = await this.gamesService.makeMove(payload.gameId, payload.move);
    this.server.to(`game:${payload.gameId}`).emit('moved', { game, move, fen, pgn });
  }
}
