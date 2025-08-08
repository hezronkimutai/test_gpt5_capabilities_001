import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Game {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'whiteId' })
  white: User | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'blackId' })
  black: User | null;

  @Column({ type: 'text', default: 'start' })
  startFen: string;

  @Column({ type: 'text', default: '' })
  pgn: string;

  @Column({ type: 'text', default: 'in_progress' })
  status: 'in_progress' | 'white_won' | 'black_won' | 'draw' | 'aborted';

  @Column({ type: 'text', nullable: true })
  resultReason: string | null;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;
}
