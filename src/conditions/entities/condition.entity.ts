import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Promotion } from 'src/promotions/entities/promotion.entity';
import { Book } from 'src/books/entities/book.entity';
import { IsOptional } from 'class-validator';

@Entity()
export class Condition {
  @PrimaryGeneratedColumn()
  conditionId: string; 

  @Column({ type: 'int', nullable: true })
  @IsOptional()
  limitProduct: number;

  @Column({ type: 'int', nullable: true })
  @IsOptional()
  limitOrderValue: number;

  @ManyToOne(() => Book, book => book.conditions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bookId' })
  book: Book;

  @ManyToOne(() => Promotion, promotion => promotion.conditions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'promotionId' })
  promotion: Promotion;
}
