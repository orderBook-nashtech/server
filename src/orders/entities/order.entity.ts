import { Orderitem } from "src/orderitems/entities/orderitem.entity";
import { Promotion } from "src/promotions/entities/promotion.entity";
import { Shipper } from "src/shippers/entities/shipper.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum OrderStatus {
    PENDING = 'Pending',
    PROCESSING = 'Processing',
    SHIPPED = 'Shipped',
    DELIVERED = 'Delivered',
    CANCELLED = 'Cancelled'
}

@Entity()
export class Order {
    @PrimaryGeneratedColumn('uuid')
    orderId: string;

    @Column({ nullable: true }) 
    totalPrice: number | null;

    @Column({
        type: 'enum',
        enum: OrderStatus,
        default: OrderStatus.PENDING
    })
    status: OrderStatus;

    @Column()
    orderDate: Date;

    @Column()
    shipAddress: string;

    @Column()
    shippedDate: Date;

    @Column()
    paymentMethod: string;

    @ManyToOne(() => User, (user) => user.orders)
    @JoinColumn({ name: 'userId' })
    user: User;

    @OneToMany(() => Orderitem, (orderItem) => orderItem.order, { cascade: true })
    orderItems: Orderitem[];

    @ManyToOne(() => Shipper, (shipper) => shipper.orders, { nullable: true })
    @JoinColumn({ name: 'shipperId' })
    shipper: Shipper;

    @OneToMany(() => Promotion, promotion => promotion.order)
    promotions: Promotion[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
