import { Category } from 'src/categories/entities/category.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Orderitem } from 'src/orderitems/entities/orderitem.entity';
import { Author } from 'src/authors/entities/author.entity';
import { Promotion } from 'src/promotions/entities/promotion.entity';
import { Condition } from 'src/conditions/entities/condition.entity';

@Entity()
export class Book {
  @PrimaryGeneratedColumn('uuid')
  bookId: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('decimal')
  unitPrice: number;

  @Column({ default: true })
  isActive: boolean;

  @Column('decimal', { precision: 2, scale: 1, default: 0 })
  rating: number;

  @Column('int')
  quantityInStock: number;

  @Column()
  bookImage: string;

  @ManyToOne(() => Category, (category) => category.books, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @ManyToOne(() => Author, (author) => author.books, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'authorId' })
  author: Author;

  @OneToMany(() => Review, (review) => review.book)
  reviews: Review[];

  @OneToMany(() => Orderitem, (orderitem) => orderitem.book)
  orderItems: Orderitem[];

  @ManyToMany(() => Promotion, (promotion) => promotion.books)
  promotions: Promotion[];

  @OneToMany(() => Condition, (condition) => condition.book)
  conditions: Condition[];

  @Column({ default: false })
  onSale: boolean;

  @Column({ nullable: true, type: 'decimal' })
  salePrice: number;

  @Column({ nullable: true, type: 'timestamp' })
  saleStartDate: Date;

  @Column({ nullable: true, type: 'timestamp' })
  saleEndDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
