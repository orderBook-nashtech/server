import { Order } from "src/orders/entities/order.entity";
import { Book } from "src/books/entities/book.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Promotion } from "src/promotions/entities/promotion.entity";

@Entity()
export class Orderitem {
    @PrimaryGeneratedColumn('uuid')
    orderItemId: string;

    @Column()
    quantity: number;

    @Column('decimal', { precision: 15, scale: 2 })
    unitPrice: number;

    @Column('decimal', { precision: 15, scale: 2, nullable: true })
    discount: number | null;

    @ManyToOne(() => Order, (order) => order.orderItems)
    @JoinColumn({ name: 'orderId' })
    order: Order;

    @ManyToOne(() => Book, (book) => book.orderItems)
    @JoinColumn({ name: 'bookId' })
    book: Book;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
