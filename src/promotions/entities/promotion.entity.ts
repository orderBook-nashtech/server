import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToOne, ManyToMany, JoinTable, JoinColumn } from 'typeorm';
import { Order } from 'src/orders/entities/order.entity';
import { Orderitem } from 'src/orderitems/entities/orderitem.entity';
import { Condition } from 'src/conditions/entities/condition.entity';
import { Book } from 'src/books/entities/book.entity';

export enum PromotionLevel {
  Product = 'OrderItem',
  Order = 'Order'
}

export enum PromotionStatus {
  Active = 'Active',
  Inactive = 'Inactive'
}

@Entity()
export class Promotion {
  @PrimaryGeneratedColumn('uuid')
  promotionId: string;

  @Column({ unique: true })
  code: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({ type: 'enum', enum: PromotionStatus, default: PromotionStatus.Inactive })
  status: PromotionStatus;

  @Column({ type: 'enum', enum: PromotionLevel, default: PromotionLevel.Product })
  level: PromotionLevel;

  @OneToMany(() => Condition, condition => condition.promotion, { cascade: true })
  conditions: Condition[];

  @ManyToOne(() => Order, order => order.promotions, {nullable: true})
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @ManyToMany(() => Book, book => book.promotions)
  @JoinTable()
  books: Book[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
