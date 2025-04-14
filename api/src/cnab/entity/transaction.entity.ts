import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  value: number;

  @Column()
  cpf: string;

  @Column()
  card: string;

  @Column({ type: 'time' })
  hour: string;

  @Column()
  storeOwner: string;

  @Column()
  storeName: string;
}
