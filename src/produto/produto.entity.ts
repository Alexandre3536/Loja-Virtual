// src/produto/produto.entity.ts
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('produtos')
export class Produto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  nome: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  preco: number;

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  foto1: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  foto2: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  foto3: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  video: string;
}