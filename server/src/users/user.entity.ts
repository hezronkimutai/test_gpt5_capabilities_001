import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ type: 'text', unique: true })
  username: string;

  @Column({ type: 'int', default: 1200 })
  rating: number;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;
}
